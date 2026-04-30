import { strapi } from '@strapi/client';
import type { API, Config } from '@strapi/client';
import { cacheLife, cacheTag, revalidateTag } from 'next/cache';
import { draftMode } from 'next/headers';

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
  return strapi({
    baseURL: `${API_URL}/api`,
    headers: {
      'strapi-encode-source-maps': isDraftMode ? 'true' : 'false',
      ...config?.headers,
    },
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
    // Some Strapi single-type endpoints reject the `status` query parameter.
    // Retry without it so localized globals still resolve in dev/prod.
    if (status && getHttpStatus(error) === 400) {
      const baseOptions = omitStatusParam(options);
      const fallbackOptions =
        status === 'draft'
          ? ({
              ...baseOptions,
              publicationState: 'preview',
            } as API.BaseQueryParams)
          : baseOptions;

      return client.find(fallbackOptions);
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
  cacheTag(`collection-${collectionName}`);

  const { data } = await createClient(config)
    .collection(collectionName)
    .find({
      ...options,
      status: 'published',
    });

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
      const { data } = await createClient(config, true)
        .collection(collectionName)
        .find({
          ...options,
          status: 'draft',
        });
      return data as T;
    }

    // Bypass cache in development mode
    if (process.env.ENVIRONMENT === 'development') {
      const { data } = await createClient(config)
        .collection(collectionName)
        .find({
          ...options,
          status: 'published',
        });
      return data as T;
    }

    // Use cached version for published content
    return fetchCollectionCached<T>(collectionName, options, config);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[Strapi] Failed to fetch collection "${collectionName}":`,
        error
      );
    }
    return [] as unknown as T;
  }
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
  cacheTag(`single-${singleTypeName}`);

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

    return fetchSingleCached<T>(singleTypeName, options, config);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[Strapi] Failed to fetch single type "${singleTypeName}":`,
        error
      );
    }
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
  cacheTag(`document-${collectionName}-${documentId}`);

  const { data } = await createClient(config)
    .collection(collectionName)
    .findOne(documentId, {
      ...options,
      status: 'published',
    });

  return data as T;
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

    return fetchDocumentCached<T>(collectionName, documentId, options, config);
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
      revalidateTag(`collection-${contentType}`, 'max');
      break;
    case 'single':
      revalidateTag(`single-${contentType}`, 'max');
      break;
    case 'document':
      if (documentId) {
        revalidateTag(`document-${contentType}-${documentId}`, 'max');
      }
      break;
  }
}
