import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

type ContactField = {
  label?: string;
  value?: string;
  type?: string;
};

type ContactPayload = {
  fields?: ContactField[];
  locale?: string;
  page?: string;
  source?: string;
  email?: string;
  name?: string;
  message?: string;
  subject?: string;
  bot?: string;
};

const REQUIRED_ENV_VARS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
  'SMTP_TO',
];

const MAX_VALUE_LENGTH = 2000;

function getMissingEnv() {
  return REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
}

function safeValue(value?: string) {
  if (!value) return '';
  return value.toString().trim().slice(0, MAX_VALUE_LENGTH);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function findFieldValue(
  fields: ContactField[],
  predicate: (field: ContactField) => boolean
) {
  const match = fields.find(predicate);
  return safeValue(match?.value);
}

function buildTextBody(
  fields: ContactField[],
  meta: Record<string, string | undefined>
) {
  const lines = [
    'New contact request',
    '',
    ...Object.entries(meta)
      .filter(([, value]) => Boolean(value))
      .map(([label, value]) => `${label}: ${value}`),
    '',
    'Fields:',
    ...fields.map((field) => `${field.label}: ${field.value}`),
  ];

  return lines.join('\n');
}

function buildHtmlBody(
  fields: ContactField[],
  meta: Record<string, string | undefined>
) {
  const metaRows = Object.entries(meta)
    .filter(([, value]) => Boolean(value))
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#2b251a;">${escapeHtml(label)}</td><td style="padding:6px 12px;color:#1d1a12;">${escapeHtml(value ?? '')}</td></tr>`
    )
    .join('');

  const fieldRows = fields
    .map(
      (field) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#2b251a;">${escapeHtml(field.label)}</td><td style="padding:6px 12px;color:#1d1a12;">${escapeHtml(field.value)}</td></tr>`
    )
    .join('');

  return `
    <div style="font-family:Arial, sans-serif; background:#f7f3e8; padding:24px;">
      <h2 style="margin:0 0 16px; color:#1d1a12;">New contact request</h2>
      <table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
        ${metaRows}
      </table>
      <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:12px; overflow:hidden;">
        ${fieldRows}
      </table>
    </div>
  `;
}

export async function POST(request: Request) {
  const missingEnv = getMissingEnv();
  if (missingEnv.length) {
    return NextResponse.json(
      { error: 'SMTP is not configured.' },
      { status: 500 }
    );
  }

  const body = (await request
    .json()
    .catch(() => null)) as ContactPayload | null;
  if (!body) {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }

  if (body.bot) {
    return NextResponse.json({ ok: true });
  }

  const fields = Array.isArray(body.fields)
    ? body.fields
        .map((field) => ({
          label: safeValue(field.label) || 'Field',
          value: safeValue(field.value),
          type: safeValue(field.type),
        }))
        .filter((field) => field.value)
    : [];

  if (!fields.length) {
    return NextResponse.json(
      { error: 'Please include at least one field.' },
      { status: 400 }
    );
  }

  const email =
    safeValue(body.email) ||
    findFieldValue(fields, (field) => field.type === 'email');
  const name =
    safeValue(body.name) ||
    findFieldValue(
      fields,
      (field) => field.label?.toLowerCase().includes('name') ?? false
    );
  const message =
    safeValue(body.message) ||
    findFieldValue(
      fields,
      (field) =>
        field.type === 'textarea' ||
        field.label?.toLowerCase().includes('message')
    );
  const subject = safeValue(body.subject) || 'New contact request';

  const meta = {
    Name: name || 'Website visitor',
    Email: email,
    Message: message,
    Locale: safeValue(body.locale),
    Page: safeValue(body.page),
    Source: safeValue(body.source),
  };

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subjectPrefix = process.env.CONTACT_SUBJECT_PREFIX;
  const subjectLine = subjectPrefix ? `${subjectPrefix}: ${subject}` : subject;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.SMTP_TO,
    replyTo: email || undefined,
    subject: subjectLine,
    text: buildTextBody(fields, meta),
    html: buildHtmlBody(fields, meta),
  });

  return NextResponse.json({ ok: true });
}
