import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { i18n } from '@/i18n.config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const localeInPath = i18n.locales.find(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (localeInPath) {
    if (localeInPath === i18n.defaultLocale) {
      const newPath = pathname.replace(`/${i18n.defaultLocale}`, '') || '/';
      return NextResponse.redirect(new URL(newPath, request.url));
    }

    const headers = new Headers(request.headers);
    headers.set('x-locale', localeInPath);
    headers.set('x-pathname', pathname);
    return NextResponse.next({ request: { headers } });
  }

  const headers = new Headers(request.headers);
  headers.set('x-locale', i18n.defaultLocale);
  headers.set('x-pathname', pathname);

  request.nextUrl.pathname = `/${i18n.defaultLocale}${pathname}`;
  return NextResponse.rewrite(request.nextUrl, { request: { headers } });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|manifest.webmanifest).*)',
  ],
};
