import { fetchSeoSettings } from '@/lib/seo/settings';

export async function GET() {
  const settings = await fetchSeoSettings('en');
  const fallback = [
    '# LLMs.txt',
    'User-agent: *',
    'Allow: /',
    '',
    '# Provide explicit crawling/training intent from Strapi Global settings (llmsTxt).',
  ].join('\n');

  return new Response(settings.llmsTxt?.trim() || fallback, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
    },
  });
}
