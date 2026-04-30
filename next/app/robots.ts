import type { MetadataRoute } from 'next';

import { getAbsoluteUrl } from '@/lib/seo/config';
import { fetchSeoSettings } from '@/lib/seo/settings';

function parseDisallowPaths(input?: string): string[] {
  if (!input) {
    return [];
  }

  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seoSettings = await fetchSeoSettings('en');
  const disallow = parseDisallowPaths(seoSettings.robotsDisallowPaths);
  const blockAiCrawlers = seoSettings.allowAiCrawlers === false;

  const rules: MetadataRoute.Robots['rules'] = [
    {
      userAgent: '*',
      allow: ['/'],
      disallow,
    },
  ];

  if (blockAiCrawlers) {
    rules.push(
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'PerplexityBot', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' }
    );
  }

  return {
    rules,
    sitemap: getAbsoluteUrl('/sitemap.xml'),
    host: getAbsoluteUrl('/'),
  };
}
