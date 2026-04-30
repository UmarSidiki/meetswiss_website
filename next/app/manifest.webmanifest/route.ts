import { getAbsoluteUrl } from '@/lib/seo/config';
import { fetchSeoSettings } from '@/lib/seo/settings';
import { strapiImage } from '@/lib/strapi/strapiImage';

export async function GET() {
  const settings = await fetchSeoSettings('en');
  const siteName = settings.siteName || 'MeetSwiss Transfers';
  const iconUrl = settings.defaultSocialImage?.url
    ? strapiImage(settings.defaultSocialImage.url)
    : getAbsoluteUrl('/next.svg');
  const iconType = iconUrl.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
  const themeColor = settings.themeColor || '#c79a42';

  const manifest = {
    name: siteName,
    short_name: siteName,
    description: settings.siteDescription || '',
    start_url: '/en',
    scope: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: themeColor,
    icons: [
      {
        src: iconUrl,
        sizes: iconType === 'image/svg+xml' ? 'any' : '512x512',
        type: iconType,
        purpose: 'any',
      },
      {
        src: iconUrl,
        sizes: iconType === 'image/svg+xml' ? 'any' : '512x512',
        type: iconType,
        purpose: 'maskable',
      },
    ],
  };

  return Response.json(manifest, {
    headers: {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
    },
  });
}
