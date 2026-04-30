import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { i18n } from '@/i18n.config';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const localeInPath = i18n.locales.find(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (localeInPath === i18n.defaultLocale) {
      const newPath = pathname.replace(`/${i18n.defaultLocale}`, '') || '/';
      return NextResponse.redirect(new URL(newPath, request.url));
    }

    return NextResponse.next();
  }

  request.nextUrl.pathname = `/${i18n.defaultLocale}${pathname}`;
  return NextResponse.rewrite(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|manifest.webmanifest).*)',
  ],
};
