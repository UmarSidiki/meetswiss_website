import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { i18n } from '@/i18n.config';
import { revalidateContent } from '@/lib/strapi';

type StrapiWebhookPayload = {
  event?: string;
  model?: string;
  entry?: Record<string, unknown>;
};

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

  return NextResponse.json({
    revalidated: true,
    model: payload.model || null,
    event: payload.event || null,
  });
}
