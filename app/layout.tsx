import ToastManager from '@/components/ui/toast';

import { pretendard } from '../public/fonts/font';

import type { Metadata } from 'next';

import './globals.css';
import 'swagger-ui-react/swagger-ui.css';

export const metadata: Metadata = {
  title: 'Swagger Chat',
  description: 'API 문서를 읽지 마세요. 대화하세요.',
  icons: {
    icon: '/logo.svg',
  },
  metadataBase: new URL('https://swagger-chat.vercel.app'),
  openGraph: {
    title: 'Swagger Chat - API 문서와 대화하세요',
    description:
      'Swagger/OpenAPI 문서를 챗봇과 함께 더 쉽게 이해하세요. API 문서를 읽지 말고 대화하세요.',
    url: 'https://swagger-chat.vercel.app',
    siteName: 'Swagger Chat',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Swagger Chat Preview',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swagger Chat - API 문서와 대화하세요',
    description:
      'Swagger/OpenAPI 문서를 챗봇과 함께 더 쉽게 이해하세요. API 문서를 읽지 말고 대화하세요.',
    images: ['/og-image.png'],
    creator: '@minselim',
  },
  alternates: {
    canonical: 'https://swagger-chat.vercel.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pretendard.variable}>
      <body className="min-h-screen antialiased">
        {children}
        <ToastManager />
      </body>
    </html>
  );
}
