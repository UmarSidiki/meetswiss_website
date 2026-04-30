import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { createWriteStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import { i18n } from '@/i18n.config';
import { revalidateContent } from '@/lib/strapi';

type StrapiWebhookPayload = {
  event?: string;
  model?: string;
  entry?: Record<string, unknown>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const IMAGES_DIR = join(process.cwd(), 'public', 'strapi-images');

/**
 * Scan a webhook entry payload for image URLs and download any that
 * are missing from the local strapi-images cache.
 */
async function syncEntryImages(
  entry: Record<string, unknown>
): Promise<number> {
  const urls = new Set<string>();

  // Recursively scan the entry for image URLs
  function scan(obj: unknown) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach(scan);
      return;
    }
    for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
      if (
        key === 'url' &&
        typeof val === 'string' &&
        val.includes('/uploads/')
      ) {
        urls.add(val);
      }
      if (typeof val === 'object' && val !== null) {
        scan(val);
      }
    }
  }

  scan(entry);

  let downloaded = 0;
  for (const url of urls) {
    const relativePath = url.startsWith('http') ? new URL(url).pathname : url;
    const destPath = join(IMAGES_DIR, relativePath);

    // Skip if already exists
    try {
      if (statSync(destPath).isFile()) continue;
    } catch {
      /* doesn't exist, proceed */
    }

    const downloadUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
    try {
      const dir = dirname(destPath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

      const res = await fetch(downloadUrl);
      if (res.ok && res.body) {
        const body = Readable.fromWeb(
          res.body as import('node:stream/web').ReadableStream
        );
        await pipeline(body, createWriteStream(destPath));
        downloaded++;
      }
    } catch (err) {
      console.warn(
        `[revalidate] Failed to download image ${downloadUrl}:`,
        err
      );
    }
  }

  return downloaded;
}

const CONTENT_MAP: Record<string, { tagType: 'collection' | 'single' }> = {
  page: { tagType: 'collection' },
  article: { tagType: 'collection' },
  transfer: { tagType: 'collection' },
  service: { tagType: 'collection' },
  fleet: { tagType: 'collection' },
  global: { tagType: 'single' },
  'blog-page': { tagType: 'single' },
  'fleet-page': { tagType: 'single' },
  'services-page': { tagType: 'single' },
  'transfers-page': { tagType: 'single' },
  redirection: { tagType: 'collection' },
};

const COLLECTION_BY_MODEL: Record<string, string> = {
  page: 'pages',
  article: 'articles',
  transfer: 'transfers',
  service: 'services',
  fleet: 'fleets',
  redirection: 'redirections',
};

function revalidateAllKnownPaths() {
  for (const locale of i18n.locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/blog`);
    revalidatePath(`/${locale}/contact`);
    revalidatePath(`/${locale}/transfers`);
    revalidatePath(`/${locale}/services`);
    revalidatePath(`/${locale}/fleet`);
    revalidatePath(`/${locale}/[slug]`, 'page');
    revalidatePath(`/${locale}/blog/[slug]`, 'page');
    revalidatePath(`/${locale}/transfers/[slug]`, 'page');
    revalidatePath(`/${locale}/services/[slug]`, 'page');
    revalidatePath(`/${locale}/fleet/[slug]`, 'page');
  }

  revalidatePath('/sitemap.xml');
  revalidatePath('/robots.txt');
  revalidatePath('/llms.txt');
  revalidatePath('/manifest.webmanifest');
}

export async function POST(request: Request) {
  const webhookSecret = process.env.REVALIDATE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'REVALIDATE_WEBHOOK_SECRET is not configured' },
      { status: 500 }
    );
  }

  const requestSecret = request.headers.get('x-revalidate-secret');
  if (requestSecret !== webhookSecret) {
    return NextResponse.json(
      { error: 'Invalid webhook secret' },
      { status: 401 }
    );
  }

  const payload = (await request.json()) as StrapiWebhookPayload;
  const content = payload.model ? CONTENT_MAP[payload.model] : undefined;

  if (payload.model && content) {
    if (content.tagType === 'single') {
      revalidateContent('single', payload.model);
    } else {
      const collectionName = COLLECTION_BY_MODEL[payload.model];
      if (!collectionName) {
        return NextResponse.json({
          revalidated: false,
          reason: 'Unsupported model',
        });
      }
      revalidateContent('collection', collectionName);
      if (
        payload.entry?.documentId &&
        typeof payload.entry.documentId === 'string'
      ) {
        revalidateContent('document', collectionName, payload.entry.documentId);
      }
    }
  } else {
    revalidateContent('single', 'global');
    revalidateContent('single', 'blog-page');
    revalidateContent('single', 'fleet-page');
    revalidateContent('single', 'services-page');
    revalidateContent('single', 'transfers-page');
    revalidateContent('collection', 'pages');
    revalidateContent('collection', 'articles');
    revalidateContent('collection', 'transfers');
    revalidateContent('collection', 'services');
    revalidateContent('collection', 'fleets');
    revalidateContent('collection', 'redirections');
  }

  revalidateAllKnownPaths();

  // Sync images from the entry payload so new/changed images are available locally
  let imagesSynced = 0;
  if (payload.entry && typeof payload.entry === 'object') {
    try {
      imagesSynced = await syncEntryImages(payload.entry);
    } catch (err) {
      console.warn('[revalidate] Image sync failed:', err);
    }
  }

  return NextResponse.json({
    revalidated: true,
    model: payload.model || null,
    event: payload.event || null,
    imagesSynced,
  });
}
