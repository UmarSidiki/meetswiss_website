'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';

import { Container } from '../container';
import ShootingStars from '../decorations/shooting-star';
import StarBackground from '../decorations/star-background';
import { Button } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { StrapiImage } from '../ui/strapi-image';
import { cn } from '@/lib/utils';

type FormInput = {
  type?: string;
  name?: string;
  placeholder?: string;
};

type FormBlock = {
  inputs?: FormInput[];
};

type SectionUser = {
  firstname?: string;
  lastname?: string;
  job?: string;
  image?: { url?: string; alternativeText?: string };
};

type SectionBlock = {
  heading?: string;
  sub_heading?: string;
  users?: SectionUser[];
};

type SocialMediaIconLink = {
  image?: { url?: string; alternativeText?: string };
  link?: Array<{ URL?: string; text?: string; target?: string }>;
};

type ContactField = {
  key: string;
  label: string;
  type: string;
  placeholder?: string;
};

type ContactPayload = {
  fields: Array<{ label: string; value: string; type: string }>;
  locale?: string;
  page?: string;
  source?: string;
  email?: string;
  name?: string;
  message?: string;
  subject?: string;
  bot?: string;
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

export function FormNextToSection({
  heading,
  sub_heading,
  form,
  section,
  social_media_icon_links,
  locale,
}: {
  heading?: string;
  sub_heading?: string;
  form?: FormBlock;
  section?: SectionBlock;
  social_media_icon_links?: SocialMediaIconLink[];
  locale?: string;
}) {
  const { fields, submitLabel } = useMemo(() => {
    const inputs = form?.inputs ?? [];
    const usedKeys = new Set<string>();
    let submitText = 'Send message';
    const builtFields: ContactField[] = [];

    inputs.forEach((input, index) => {
      const type = (input.type || 'text').toLowerCase();
      if (type === 'submit') {
        submitText = input.name?.trim() || submitText;
        return;
      }

      const label = input.name?.trim() || `Field ${index + 1}`;
      const fallback = `field_${index + 1}`;
      const key = normalizeKey(label, fallback, usedKeys);

      builtFields.push({
        key,
        label,
        type,
        placeholder: input.placeholder?.trim() || undefined,
      });
    });

    return { fields: builtFields, submitLabel: submitText };
  }, [form?.inputs]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    const initialValues = fields.reduce<Record<string, string>>(
      (acc, field) => {
        acc[field.key] = '';
        return acc;
      },
      {}
    );
    setValues(initialValues);
  }, [fields]);

  const emailField = fields.find((field) => field.type === 'email');
  const messageField = fields.find(
    (field) =>
      field.type === 'textarea' || field.label.toLowerCase().includes('message')
  );
  const subjectField = fields.find((field) =>
    field.label.toLowerCase().includes('subject')
  );
  const nameField = fields.find((field) =>
    field.label.toLowerCase().includes('name')
  );

  const hasContent = Boolean(heading || sub_heading || fields.length);

  if (!hasContent) {
    return null;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (emailField && !values[emailField.key]) {
      setError('Please add a valid email address.');
      return;
    }

    if (messageField && !values[messageField.key]) {
      setError('Please include a short message.');
      return;
    }

    setStatus('sending');

    const payload: ContactPayload = {
      fields: fields.map((field) => ({
        label: field.label,
        value: values[field.key] || '',
        type: field.type,
      })),
      locale,
      source: 'contact-page',
      email: emailField ? values[emailField.key] : undefined,
      name: nameField ? values[nameField.key] : undefined,
      message: messageField ? values[messageField.key] : undefined,
      subject: subjectField ? values[subjectField.key] : undefined,
      bot: honeypot,
      page:
        typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Unable to send your message.');
      }

      setStatus('success');
      setValues((prev) =>
        Object.keys(prev).reduce<Record<string, string>>((acc, key) => {
          acc[key] = '';
          return acc;
        }, {})
      );
    } catch (submitError) {
      setStatus('error');
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to send your message.'
      );
    }
  };

  const isSending = status === 'sending';

  return (
    <section className="relative py-16 md:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-primary/25 bg-[#0f0f0f] p-6 shadow-[0_24px_50px_rgba(0,0,0,0.35)] md:p-10">
            <div className="space-y-3">
              {heading && (
                <Heading as="h2" size="md" className="mx-0 text-left">
                  {heading}
                </Heading>
              )}
              {sub_heading && (
                <Subheading className="mx-0 text-left">
                  {sub_heading}
                </Subheading>
              )}
            </div>

            {fields.length > 0 ? (
              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div className="hidden">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="off"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                  />
                </div>

                {fields.map((field) => {
                  const fieldId = `contact-${field.key}`;
                  const isRequired =
                    field.type === 'email' ||
                    field.type === 'textarea' ||
                    field.label.toLowerCase().includes('message');

                  return (
                    <div key={field.key} className="space-y-2">
                      <label
                        htmlFor={fieldId}
                        className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c6baa1]"
                      >
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          id={fieldId}
                          rows={5}
                          required={isRequired}
                          placeholder={field.placeholder}
                          value={values[field.key] || ''}
                          onChange={(event) =>
                            setValues((prev) => ({
                              ...prev,
                              [field.key]: event.target.value,
                            }))
                          }
                          className="w-full rounded-2xl border border-primary/30 bg-black/40 px-4 py-3 text-sm text-[#f5f1e8] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.3)] outline-none transition focus:border-primary focus:ring-2 focus:ring-amber-300/30"
                        />
                      ) : (
                        <input
                          id={fieldId}
                          type={field.type}
                          required={isRequired}
                          placeholder={field.placeholder}
                          value={values[field.key] || ''}
                          onChange={(event) =>
                            setValues((prev) => ({
                              ...prev,
                              [field.key]: event.target.value,
                            }))
                          }
                          className="w-full rounded-full border border-primary/30 bg-black/40 px-4 py-3 text-sm text-[#f5f1e8] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.3)] outline-none transition focus:border-primary focus:ring-2 focus:ring-amber-300/30"
                        />
                      )}
                    </div>
                  );
                })}

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <Button
                    type="submit"
                    className={cn(
                      'w-full md:w-auto',
                      isSending && 'cursor-not-allowed opacity-70'
                    )}
                    disabled={isSending}
                  >
                    {isSending ? 'Sending...' : submitLabel}
                  </Button>

                  <div
                    className="text-xs text-[#c6baa1] md:text-right"
                    aria-live="polite"
                  >
                    {status === 'success'
                      ? 'Message sent. We will be in touch shortly.'
                      : error ||
                        'We reply within one business day for all inquiries.'}
                  </div>
                </div>
              </form>
            ) : (
              <div className="mt-8 rounded-2xl border border-primary/20 bg-black/30 p-6 text-sm text-[#b8aa91]">
                Add form inputs in Strapi to display the contact form.
              </div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-[#0b0b0b] p-8">
            <StarBackground className="opacity-60" />
            <ShootingStars />

            <div className="relative z-10 space-y-6">
              {section?.users?.length ? (
                <div className="flex flex-wrap items-center gap-2">
                  {section.users.slice(0, 5).map((user, index) => (
                    <div
                      key={`${user.firstname || 'user'}-${index}`}
                      className="h-11 w-11 overflow-hidden rounded-full border border-primary/40 bg-[#17130b]"
                    >
                      {user.image?.url ? (
                        <StrapiImage
                          src={user.image.url}
                          alt={
                            user.image.alternativeText ||
                            user.firstname ||
                            'Team member'
                          }
                          width={88}
                          height={88}
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
              ) : null}

              {section?.heading && (
                <h3 className="text-2xl font-semibold text-[#f5f1e8]">
                  {section.heading}
                </h3>
              )}
              {section?.sub_heading && (
                <p className="text-sm leading-relaxed text-[#c8bfa8]">
                  {section.sub_heading}
                </p>
              )}

              {social_media_icon_links?.length ? (
                <div className="flex flex-wrap gap-3">
                  {social_media_icon_links.map((item, index) => {
                    const link = item.link?.[0];
                    const href = link?.URL || '#';
                    const altText =
                      item.image?.alternativeText ||
                      link?.text ||
                      'Social link';
                    return (
                      <a
                        key={`social-${index}`}
                        href={href}
                        target={link?.target || '_blank'}
                        rel="noopener noreferrer"
                        className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-black/50 transition hover:border-primary hover:bg-primary/10"
                      >
                        {item.image?.url ? (
                          <StrapiImage
                            src={item.image.url}
                            alt={altText}
                            width={24}
                            height={24}
                            className="h-5 w-5 object-contain"
                          />
                        ) : (
                          <span className="text-xs text-primary">
                            {link?.text?.[0] || 'S'}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
