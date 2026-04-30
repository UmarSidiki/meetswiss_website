import { fetchSingleType } from '@/lib/strapi';

export type SeoSettings = {
  siteName?: string;
  siteDescription?: string;
  siteKeywords?: string;
  defaultRobots?: string;
  allowAiCrawlers?: boolean;
  robotsDisallowPaths?: string;
  llmsTxt?: string;
  themeColor?: string;
  defaultSocialImage?: { url: string };
  organizationName?: string;
  organizationUrl?: string;
  organizationLogo?: { url: string };
  xHandle?: string;
  contactEmail?: string;
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  yandexVerification?: string;
  facebookDomainVerification?: string;
  locale?: string;
  localizations?: Array<{ locale: string }>;
  updatedAt?: string;
};

export async function fetchSeoSettings(locale: string): Promise<SeoSettings> {
  const settings = await fetchSingleType<SeoSettings | null>('global', {
    locale,
  });

  return settings || {};
}
