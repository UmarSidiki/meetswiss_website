'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/elements/button';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { cn } from '@/lib/utils';

export type ContactFormField = {
  key: string;
  label: string;
  placeholder?: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
};

export type ContactFormCopy = {
  title: string;
  subtitle?: string;
  submitLabel: string;
  successMessage: string;
  helperMessage: string;
  fields: ContactFormField[];
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

export function ContactForm({
  copy,
  locale,
}: {
  copy: ContactFormCopy;
  locale?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  const fieldKeys = useMemo(
    () => copy.fields.map((field) => field.key),
    [copy.fields]
  );

  useEffect(() => {
    const nextValues = fieldKeys.reduce<Record<string, string>>((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setValues(nextValues);
  }, [fieldKeys]);

  const emailField = copy.fields.find((field) => field.type === 'email');
  const messageField = copy.fields.find(
    (field) =>
      field.type === 'textarea' || field.label.toLowerCase().includes('message')
  );
  const nameField = copy.fields.find((field) =>
    field.label.toLowerCase().includes('name')
  );
  const subjectField = copy.fields.find((field) =>
    field.label.toLowerCase().includes('subject')
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const missingRequired = copy.fields.find(
      (field) => field.required && !values[field.key]
    );

    if (missingRequired) {
      setError(`Please fill the ${missingRequired.label.toLowerCase()} field.`);
      setStatus('error');
      return;
    }

    if (emailField && !values[emailField.key]) {
      setError('Please add a valid email address.');
      setStatus('error');
      return;
    }

    if (messageField && !values[messageField.key]) {
      setError('Please include a short message.');
      setStatus('error');
      return;
    }

    if (honeypot) {
      setStatus('success');
      return;
    }

    setStatus('sending');

    const payload: ContactPayload = {
      fields: copy.fields.map((field) => ({
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

  const statusMessage =
    status === 'success' ? copy.successMessage : error || copy.helperMessage;

  return (
    <div className="rounded-3xl border border-primary/25 bg-[#0f0f0f] p-6 shadow-[0_24px_50px_rgba(0,0,0,0.35)] md:p-10">
      <div className="space-y-3">
        <Heading as="h2" size="sm" className="mx-0 text-left">
          {copy.title}
        </Heading>
        {copy.subtitle && (
          <Subheading className="mx-0 my-2 text-left">
            {copy.subtitle}
          </Subheading>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-5"
        aria-busy={status === 'sending'}
      >
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

        {copy.fields.map((field) => {
          const fieldId = `contact-${field.key}`;
          const isTextarea = field.type === 'textarea';
          const isInvalid = Boolean(
            field.required && status === 'error' && !values[field.key]
          );

          return (
            <div key={field.key} className="space-y-2">
              <label
                htmlFor={fieldId}
                className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c6baa1]"
              >
                {field.label}
              </label>
              {isTextarea ? (
                <textarea
                  id={fieldId}
                  rows={5}
                  required={field.required}
                  aria-invalid={isInvalid}
                  placeholder={field.placeholder}
                  value={values[field.key] || ''}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.key]: event.target.value,
                    }))
                  }
                  className={cn(
                    'w-full rounded-2xl border bg-black/40 px-4 py-3 text-sm text-[#f5f1e8] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.3)] outline-none transition',
                    'focus:border-primary focus:ring-2 focus:ring-amber-300/30',
                    isInvalid ? 'border-[#b86b61]' : 'border-primary/30'
                  )}
                />
              ) : (
                <input
                  id={fieldId}
                  type={field.type}
                  required={field.required}
                  aria-invalid={isInvalid}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  value={values[field.key] || ''}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.key]: event.target.value,
                    }))
                  }
                  className={cn(
                    'w-full rounded-full border bg-black/40 px-4 py-3 text-sm text-[#f5f1e8] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.3)] outline-none transition',
                    'focus:border-primary focus:ring-2 focus:ring-amber-300/30',
                    isInvalid ? 'border-[#b86b61]' : 'border-primary/30'
                  )}
                />
              )}
            </div>
          );
        })}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Button
            type="submit"
            className={cn(
              'w-full md:w-auto md:min-w-[12rem] py-3',
              status === 'sending' && 'cursor-not-allowed opacity-70'
            )}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : copy.submitLabel}
          </Button>

          <div
            className="text-xs text-[#c6baa1] md:text-right"
            aria-live="polite"
          >
            {statusMessage}
          </div>
        </div>
      </form>
    </div>
  );
}
