import { strapi } from '@strapi/client';
import type { API, Config } from '@strapi/client';
import { cacheLife, cacheTag, revalidateTag } from 'next/cache';
import { draftMode } from 'next/headers';

import { i18n } from '@/i18n.config';

import { API_URL } from '../utils';

export class StrapiError extends Error {
  constructor(
    message: string,
    public readonly contentType: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'StrapiError';
  }
}

const createClient = (
  config?: Omit<Config, 'baseURL'>,
  isDraftMode: boolean = false
) => {
  const headers: Record<string, string> = {
    'strapi-encode-source-maps': isDraftMode ? 'true' : 'false',
    ...config?.headers as Record<string, string>,
  };

  if (process.env.STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }

  return strapi({
    baseURL: `${API_URL}/api`,
    headers,
    ...config,
  });
};

function getHttpStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const maybeResponse = (error as { response?: { status?: number } }).response;
  if (maybeResponse && typeof maybeResponse.status === 'number') {
    return maybeResponse.status;
  }

  return undefined;
}

function omitStatusParam(
  options?: API.BaseQueryParams
): API.BaseQueryParams | undefined {
  if (!options || !('status' in options)) {
    return options;
  }

  const { status: _status, ...rest } = options as API.BaseQueryParams & {
    status?: string;
  };

  return rest as API.BaseQueryParams;
}

async function findSingleTypeWithStatusFallback(
  singleTypeName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>,
  status?: 'draft' | 'published',
  isDraftMode: boolean = false
) {
  const client = createClient(config, isDraftMode).single(singleTypeName);
  const query = status
    ? ({ ...options, status } as API.BaseQueryParams)
    : options;

  try {
    return await client.find(query);
  } catch (error) {
    const status = getHttpStatus(error);
    
    // Return empty data for 404s (e.g., missing translation)
    if (status === 404) {
      return { data: {} };
    }

    // Some Strapi single-type endpoints reject the `status` query parameter.
    // Retry without it so localized globals still resolve in dev/prod.
    if (status === 400 && query?.status) {
      const baseOptions = omitStatusParam(options);
      const fallbackOptions =
        query.status === 'draft'
          ? ({
              ...baseOptions,
              publicationState: 'preview',
            } as API.BaseQueryParams)
          : baseOptions;

      try {
        return await client.find(fallbackOptions);
      } catch (fallbackError) {
        if (getHttpStatus(fallbackError) === 404) {
          return { data: {} };
        }
        throw fallbackError;
      }
    }

    throw error;
  }
}

async function findCollectionWithStatusFallback(
  collectionName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>,
  status?: 'draft' | 'published',
  isDraftMode: boolean = false
) {
  const client = createClient(config, isDraftMode).collection(collectionName);
  const query = status
    ? ({ ...options, status } as API.BaseQueryParams)
    : options;

  try {
    return await client.find(query);
  } catch (error) {
    const httpStatus = getHttpStatus(error);
    
    if (httpStatus === 404) {
      return { data: [] };
    }

    if (httpStatus === 400 && query?.status) {
      const baseOptions = omitStatusParam(options);
      const fallbackOptions =
        query.status === 'draft'
          ? ({
              ...baseOptions,
              publicationState: 'preview',
            } as API.BaseQueryParams)
          : baseOptions;

      try {
        return await client.find(fallbackOptions);
      } catch (fallbackError) {
        const fallbackStatus = getHttpStatus(fallbackError);
        if (fallbackStatus === 404) {
          return { data: [] };
        }
        
        // If it still fails with 400, it might be the `locale` parameter causing issues for non-localized collections
        if (fallbackStatus === 400 && fallbackOptions?.locale) {
          const { locale, ...noLocaleOptions } = fallbackOptions as any;
          try {
            return await client.find(noLocaleOptions);
          } catch (noLocaleError) {
             if (getHttpStatus(noLocaleError) === 404) {
               return { data: [] };
             }
             throw noLocaleError;
          }
        }
        
        throw fallbackError;
      }
    }

    throw error;
  }
}

async function isDraftModeEnabled(): Promise<boolean> {
  // In development or during static generation, skip draft mode check
  if (process.env.ENVIRONMENT === 'development') {
    return false;
  }

  try {
    return (await draftMode()).isEnabled;
  } catch (error) {
    // Return false if we're outside a request scope (e.g., during build)
    return false;
  }
}

/**
 * Cached fetch for collection types (published content only).
 * Uses Next.js 16 'use cache' directive for explicit caching.
 */
async function fetchCollectionCached<T = API.Document[]>(
  collectionName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  'use cache';
  cacheLife('max');
  cacheTag(`v2-collection-${collectionName}`);

  const { data } = await findCollectionWithStatusFallback(
    collectionName,
    options,
    config,
    'published'
  );

  return data as T;
}

/**
 * Fetches a collection type from Strapi.
 * Automatically bypasses cache in draft mode.
 *
 * @throws {StrapiError} When the fetch fails
 */
export async function fetchCollectionType<T = API.Document[]>(
  collectionName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  const isDraftMode = await isDraftModeEnabled();

  try {
    // Bypass cache in draft mode for real-time preview
    if (isDraftMode) {
      const { data } = await findCollectionWithStatusFallback(
        collectionName,
        options,
        config,
        'draft',
        true
      );
      return data as T;
    }

    // Bypass cache in development mode
    if (process.env.ENVIRONMENT === 'development') {
      const { data } = await findCollectionWithStatusFallback(
        collectionName,
        options,
        config,
        'published'
      );
      return data as T;
    }

    // Use cached version for published content
    return await fetchCollectionCached<T>(collectionName, options, config);
  } catch (error) {
    // Always log errors to help debug production issues where sitemaps return empty
    console.error(
      `[Strapi] Failed to fetch collection "${collectionName}":`,
      error instanceof Error ? error.message : error
    );
    return [] as unknown as T;
  }
}

/**
 * Fetches all locales in parallel and merges results.
 *
 * Strapi public API often returns empty data or 403 for `locale: 'all'` depending on
 * permissions; per-locale queries match what the Public role allows.
 */
export async function fetchCollectionAllLocales<T = API.Document[]>(
  collectionName: string,
  options?: Omit<API.BaseQueryParams, 'locale'>,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  const batches = await Promise.all(
    i18n.locales.map((locale) =>
      fetchCollectionType<API.Document[]>(
        collectionName,
        { ...options, locale } as API.BaseQueryParams,
        config
      )
    )
  );

  return batches.flat() as T;
}

/**
 * Cached fetch for single types (published content only).
 */
async function fetchSingleCached<T = API.Document>(
  singleTypeName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  'use cache';
  cacheLife('max');
  cacheTag(`v2-single-${singleTypeName}`);

  const { data } = await findSingleTypeWithStatusFallback(
    singleTypeName,
    options,
    config,
    'published'
  );

  return data as T;
}

/**
 * Fetches a single type from Strapi.
 * Automatically bypasses cache in draft mode.
 *
 * @throws {StrapiError} When the fetch fails
 */
export async function fetchSingleType<T = API.Document>(
  singleTypeName: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  const isDraftMode = await isDraftModeEnabled();

  try {
    if (isDraftMode) {
      const { data } = await findSingleTypeWithStatusFallback(
        singleTypeName,
        options,
        config,
        'draft',
        true
      );
      return data as T;
    }

    if (process.env.ENVIRONMENT === 'development') {
      const { data } = await findSingleTypeWithStatusFallback(
        singleTypeName,
        options,
        config,
        'published'
      );
      return data as T;
    }

    return await fetchSingleCached<T>(singleTypeName, options, config);
  } catch (error) {
    console.error(
      `[Strapi] Failed to fetch single type "${singleTypeName}":`,
      error instanceof Error ? error.message : error
    );
    return {} as unknown as T;
  }
}

/**
 * Cached fetch for documents (published content only).
 */
async function fetchDocumentCached<T = API.Document>(
  collectionName: string,
  documentId: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  'use cache';
  cacheLife('max');
  cacheTag(`v2-document-${collectionName}-${documentId}`);

  try {
    const { data } = await createClient(config)
      .collection(collectionName)
      .findOne(documentId, {
        ...options,
        status: 'published',
      });

    return data as T;
  } catch (error) {
    if (getHttpStatus(error) === 404) {
      return null as T;
    }
    throw error;
  }
}

/**
 * Fetches a single document from a collection by documentId.
 * Automatically bypasses cache in draft mode.
 *
 * @throws {StrapiError} When the fetch fails
 */
export async function fetchDocument<T = API.Document>(
  collectionName: string,
  documentId: string,
  options?: API.BaseQueryParams,
  config?: Omit<Config, 'baseURL'>
): Promise<T> {
  const isDraftMode = await isDraftModeEnabled();

  try {
    if (isDraftMode) {
      const { data } = await createClient(config, true)
        .collection(collectionName)
        .findOne(documentId, {
          ...options,
          status: 'draft',
        });
      return data as T;
    }

    if (process.env.ENVIRONMENT === 'development') {
      const { data } = await createClient(config)
        .collection(collectionName)
        .findOne(documentId, {
          ...options,
          status: 'published',
        });
      return data as T;
    }

    return await fetchDocumentCached<T>(collectionName, documentId, options, config);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[Strapi] Failed to fetch document "${documentId}" from "${collectionName}":`,
        error
      );
    }
    return null as unknown as T;
  }
}

/**
 * Revalidate cache for a specific content type.
 * Call this from a webhook when Strapi content is updated.
 *
 * @example
 * // Revalidate all articles
 * revalidateContent('collection', 'articles');
 *
 * // Revalidate a specific document
 * revalidateContent('document', 'articles', 'abc123');
 *
 * // Revalidate a single type
 * revalidateContent('single', 'global');
 */
export function revalidateContent(
  type: 'collection' | 'single' | 'document',
  contentType: string,
  documentId?: string
): void {
  // Use 'max' profile for stale-while-revalidate behavior
  // This serves stale content while fetching fresh data in background
  switch (type) {
    case 'collection':
      revalidateTag(`v2-collection-${contentType}`, 'max');
      break;
    case 'single':
      revalidateTag(`v2-single-${contentType}`, 'max');
      break;
    case 'document':
      if (documentId) {
        revalidateTag(`v2-document-${contentType}-${documentId}`, 'max');
      }
      break;
  }
}
