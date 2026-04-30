import type { Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import {
  ContactForm,
  type ContactFormField,
} from '@/components/contact/contact-form';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { StructuredData } from '@/components/seo/structured-data';
import { StrapiImage } from '@/components/ui/strapi-image';
import { i18n } from '@/i18n.config';
import { getAbsoluteUrl } from '@/lib/seo/config';
import { fetchSeoSettings } from '@/lib/seo/settings';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType, fetchSingleType } from '@/lib/strapi';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

type ContactPageEntry = {
  slug?: string;
  locale?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    structuredData?: unknown;
  };
  localizations?: Array<{ locale: string; slug?: string }>;
  dynamic_zone?: Array<FormBlock | { __component?: string }>;
};

type GlobalData = {
  siteName?: string;
  organizationName?: string;
  organizationUrl?: string;
  footer?: {
    tagline?: string;
    contact_phone?: string;
    contact_email?: string;
    contact_whatsapp?: string;
  };
};

type ContactCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  detailsTitle: string;
  detailsSubtitle: string;
  supportTitle: string;
  supportSubtitle: string;
  responseNote: string;
  helperMessage: string;
  successMessage: string;
  fields: ContactFormField[];
  submitLabel: string;
  formTitle: string;
  formSubtitle: string;
};

type FormInput = {
  type?: string;
  name?: string;
  placeholder?: string;
};

type FormBlock = {
  __component?: string;
  heading?: string;
  sub_heading?: string;
  form?: {
    inputs?: FormInput[];
  };
  section?: {
    heading?: string;
    sub_heading?: string;
    users?: Array<{
      firstname?: string;
      lastname?: string;
      job?: string;
      image?: { url?: string; alternativeText?: string };
    }>;
  };
};

const FALLBACK_FIELDS: ContactFormField[] = [
  {
    key: 'name',
    label: 'Full name',
    placeholder: 'Your name',
    type: 'text',
    required: true,
    autoComplete: 'name',
  },
  {
    key: 'email',
    label: 'Email address',
    placeholder: 'you@example.com',
    type: 'email',
    required: true,
    autoComplete: 'email',
  },
  {
    key: 'phone',
    label: 'Phone number',
    placeholder: '+41 44 000 00 00',
    type: 'tel',
    autoComplete: 'tel',
  },
  {
    key: 'route',
    label: 'Route or pickup details',
    placeholder: 'Zurich Airport to St. Moritz',
    type: 'text',
    autoComplete: 'off',
  },
  {
    key: 'message',
    label: 'Message',
    placeholder: 'Share travel date, passengers, and luggage.',
    type: 'textarea',
    required: true,
  },
];

const FALLBACK_COPY: ContactCopy = {
  eyebrow: 'Meetswiss Transfers',
  title: 'Contact our concierge',
  subtitle:
    'Tell us about your trip, timing, and preferences. We will curate the best vehicle and route for your journey.',
  detailsTitle: 'Direct line',
  detailsSubtitle:
    'Prefer to speak with a coordinator? Reach us by phone, email, or WhatsApp.',
  supportTitle: 'Local expertise',
  supportSubtitle:
    'Our Swiss team coordinates every pickup with precision, from alpine resorts to private terminals.',
  responseNote:
    'We respond within one business day. Urgent requests are prioritized.',
  helperMessage: 'We reply within one business day for all inquiries.',
  successMessage: 'Message sent. We will be in touch shortly.',
  fields: FALLBACK_FIELDS,
  submitLabel: 'Send message',
  formTitle: 'Send a request',
  formSubtitle: 'We will confirm availability and pricing promptly.',
};

const normalizeKey = (label: string, fallback: string, used: Set<string>) => {
  const base = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  let key = base || fallback;
  if (used.has(key)) {
    key = `${key}_${fallback}`;
  }
  used.add(key);
  return key;
};

const inferAutoComplete = (label: string, type: string) => {
  const normalized = label.toLowerCase();
  if (type === 'email' || normalized.includes('email')) return 'email';
  if (normalized.includes('name')) return 'name';
  if (normalized.includes('phone') || normalized.includes('tel')) return 'tel';
  if (normalized.includes('company')) return 'organization';
  return 'off';
};

const buildFormFields = (inputs?: FormInput[]) => {
  if (!inputs?.length) {
    return {
      fields: FALLBACK_FIELDS,
      submitLabel: FALLBACK_COPY.submitLabel,
    };
  }

  const usedKeys = new Set<string>();
  let submitLabel = FALLBACK_COPY.submitLabel;
  const fields: ContactFormField[] = [];

  inputs.forEach((input, index) => {
    const type = (input.type || 'text').toLowerCase();
    if (type === 'submit') {
      submitLabel = input.name?.trim() || submitLabel;
      return;
    }

    const label = input.name?.trim() || `Field ${index + 1}`;
    const key = normalizeKey(label, `field_${index + 1}`, usedKeys);
    const labelLower = label.toLowerCase();
    const required =
      type === 'email' ||
      type === 'textarea' ||
      labelLower.includes('message') ||
      labelLower.includes('name');

    fields.push({
      key,
      label,
      placeholder: input.placeholder?.trim() || undefined,
      type,
      required,
      autoComplete: inferAutoComplete(label, type),
    });
  });

  return {
    fields: fields.length ? fields : FALLBACK_FIELDS,
    submitLabel,
  };
};

const buildContactCopy = (
  pageData: ContactPageEntry | undefined,
  globalData: GlobalData | null | undefined
): ContactCopy & { section?: FormBlock['section'] } => {
  const formBlock = pageData?.dynamic_zone?.find(
    (item) => item?.__component === 'dynamic-zone.form-next-to-section'
  ) as FormBlock | undefined;

  const formFields = buildFormFields(formBlock?.form?.inputs);

  return {
    eyebrow: globalData?.siteName || FALLBACK_COPY.eyebrow,
    title: pageData?.seo?.metaTitle || FALLBACK_COPY.title,
    subtitle: pageData?.seo?.metaDescription || FALLBACK_COPY.subtitle,
    detailsTitle: FALLBACK_COPY.detailsTitle,
    detailsSubtitle: FALLBACK_COPY.detailsSubtitle,
    supportTitle: formBlock?.section?.heading || FALLBACK_COPY.supportTitle,
    supportSubtitle:
      formBlock?.section?.sub_heading || FALLBACK_COPY.supportSubtitle,
    responseNote: FALLBACK_COPY.responseNote,
    helperMessage:
      pageData?.seo?.twitterDescription || FALLBACK_COPY.helperMessage,
    successMessage: pageData?.seo?.twitterTitle || FALLBACK_COPY.successMessage,
    fields: formFields.fields,
    submitLabel: formFields.submitLabel,
    formTitle:
      formBlock?.heading || pageData?.seo?.ogTitle || FALLBACK_COPY.formTitle,
    formSubtitle:
      formBlock?.sub_heading ||
      pageData?.seo?.ogDescription ||
      FALLBACK_COPY.formSubtitle,
    section: formBlock?.section,
  };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [pages, seoSettings] = await Promise.all([
    fetchCollectionType<ContactPageEntry[]>('pages', {
      filters: {
        slug: {
          $eq: 'contact',
        },
        locale: locale,
      },
      pagination: { pageSize: 1 },
    }),
    fetchSeoSettings(locale),
  ]);

  const pageData = pages[0];
  const metadata = generateMetadataObject(
    pageData?.seo || {
      metaTitle: 'Contact MeetSwiss Transfers',
      metaDescription:
        'Request a private transfer with our Swiss concierge team.',
    },
    {
      locale,
      pathname: '/contact',
      localizedPaths: i18n.locales.reduce<Record<string, string>>(
        (acc, item) => {
          acc[item] = 'contact';
          return acc;
        },
        { [locale]: 'contact' }
      ),
      siteSettings: seoSettings,
    }
  );

  return metadata;
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [pages, seoSettings, globalData] = await Promise.all([
    fetchCollectionType<ContactPageEntry[]>('pages', {
      filters: {
        slug: {
          $eq: 'contact',
        },
        locale: locale,
      },
      pagination: { pageSize: 1 },
    }),
    fetchSeoSettings(locale),
    fetchSingleType<GlobalData>('global', { locale }),
  ]);

  const pageData = pages[0];
  const copy = buildContactCopy(pageData, globalData);

  const localizedSlugs =
    pageData?.localizations?.reduce(
      (
        acc: Record<string, string>,
        localization: { locale: string; slug?: string }
      ) => {
        acc[localization.locale] = localization.slug || 'contact';
        return acc;
      },
      { [locale]: 'contact' }
    ) ||
    i18n.locales.reduce<Record<string, string>>((acc, localeKey) => {
      acc[localeKey] = 'contact';
      return acc;
    }, {});

  const contactEmail =
    globalData?.footer?.contact_email || seoSettings.contactEmail;
  const contactPhone = globalData?.footer?.contact_phone;
  const contactWhatsapp = globalData?.footer?.contact_whatsapp;

  const contactStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: copy.title,
    description: copy.subtitle,
    url: getAbsoluteUrl(`/${locale}/contact`),
    mainEntity: {
      '@type': 'Organization',
      name: seoSettings.organizationName || globalData?.siteName,
      url: seoSettings.organizationUrl || getAbsoluteUrl(`/${locale}`),
      contactPoint: [
        contactEmail
          ? {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              email: contactEmail,
            }
          : null,
        contactPhone
          ? {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              telephone: contactPhone,
            }
          : null,
      ].filter(Boolean),
    },
  };

  const supportUsers = copy.section?.users || [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] pb-24 pt-28 md:pt-40">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <StructuredData
        data={[pageData?.seo?.structuredData, contactStructuredData]}
      />
      <AmbientColor />
      <Container>
        <div className="mb-14 animate-in fade-in-0 slide-in-from-bottom-3 duration-500 fill-mode-both border-b border-primary/20 pb-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-0">
            <div className="shrink-0 md:w-44 md:pb-1">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.3em] text-primary/80">
                {copy.eyebrow}
              </p>
            </div>
            <div className="flex-1 md:border-l md:border-primary/25 md:pl-12">
              <Heading as="h1" size="xl" className="mx-0 text-left">
                {copy.title}
              </Heading>
              <Subheading className="mt-3 max-w-2xl text-left text-[#c8bfa8]">
                {copy.subtitle}
              </Subheading>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both space-y-6">
            <div className="rounded-3xl border border-primary/20 bg-[#0f0f0f] p-6 md:p-8">
              <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                {copy.detailsTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#c8bfa8]">
                {copy.detailsSubtitle}
              </p>

              <div className="mt-6 grid gap-3">
                {contactPhone && (
                  <a
                    href={`tel:${contactPhone.replace(/\s/g, '')}`}
                    className="flex min-h-[2.75rem] items-center justify-between rounded-2xl border border-primary/20 bg-black/30 px-4 text-sm text-[#f5f1e8] transition hover:border-primary/50 hover:bg-black/50"
                  >
                    <span className="text-[#c8bfa8]">Phone</span>
                    <span className="font-medium text-[#f5f1e8]">
                      {contactPhone}
                    </span>
                  </a>
                )}
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex min-h-[2.75rem] items-center justify-between rounded-2xl border border-primary/20 bg-black/30 px-4 text-sm text-[#f5f1e8] transition hover:border-primary/50 hover:bg-black/50"
                  >
                    <span className="text-[#c8bfa8]">Email</span>
                    <span className="font-medium text-[#f5f1e8]">
                      {contactEmail}
                    </span>
                  </a>
                )}
                {contactWhatsapp && (
                  <a
                    href={`https://wa.me/${contactWhatsapp.replace(/[^0-9]/g, '')}`}
                    className="flex min-h-[2.75rem] items-center justify-between rounded-2xl border border-primary/20 bg-black/30 px-4 text-sm text-[#f5f1e8] transition hover:border-primary/50 hover:bg-black/50"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-[#c8bfa8]">WhatsApp</span>
                    <span className="font-medium text-[#f5f1e8]">Chat now</span>
                  </a>
                )}

                {!contactPhone && !contactEmail && !contactWhatsapp && (
                  <div className="rounded-2xl border border-primary/20 bg-black/30 px-4 py-3 text-sm text-[#c8bfa8]">
                    Add contact details in Strapi Global settings to display
                    phone and email.
                  </div>
                )}
              </div>

              <p className="mt-6 text-xs text-[#9c9179]">{copy.responseNote}</p>
            </div>

            <div className="rounded-3xl border border-primary/20 bg-[#0b0b0b] p-6 md:p-8">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#f5f1e8]">
                  {copy.supportTitle}
                </h3>
                <p className="text-sm leading-relaxed text-[#c8bfa8]">
                  {copy.supportSubtitle}
                </p>
              </div>

              {supportUsers.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {supportUsers.slice(0, 5).map((user, index) => (
                    <div
                      key={`${user.firstname || 'member'}-${index}`}
                      className="h-12 w-12 overflow-hidden rounded-full border border-primary/30 bg-[#17130b]"
                    >
                      {user.image?.url ? (
                        <StrapiImage
                          src={user.image.url}
                          alt={
                            user.image.alternativeText ||
                            user.firstname ||
                            'Team member'
                          }
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-primary">
                          {user.firstname?.[0] || 'M'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
            <ContactForm
              copy={{
                title: copy.formTitle,
                subtitle: copy.formSubtitle,
                submitLabel: copy.submitLabel,
                successMessage: copy.successMessage,
                helperMessage: copy.helperMessage,
                fields: copy.fields,
              }}
              locale={locale}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
