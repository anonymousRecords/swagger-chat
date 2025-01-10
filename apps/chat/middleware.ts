import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

let locales = ['en', 'ko', 'ja', 'zh'];
let defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  const headers = {
    'accept-language': request.headers.get('accept-language') || '',
  };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  // const pathname = request.nextUrl.pathname;
  // const pathnameIsMissingLocale = locales.every(
  //   (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  // );

  // if (pathnameIsMissingLocale) {
  //   const locale = getLocale(request);
  //   return NextResponse.redirect(
  //     new URL(`/${locale}${pathname}`, request.url)
  //   );
  // }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
};
