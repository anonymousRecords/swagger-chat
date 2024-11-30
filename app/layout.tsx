import ToastManager from '@/components/ui/toast';

import { pretendard } from '../public/fonts/font';

import type { Metadata } from 'next';

import './globals.css';
import 'swagger-ui-react/swagger-ui.css';

export const metadata: Metadata = {
  title: 'Swagger Chat',
  description: 'Don’t read swagger. Just chat.',
  icons: {
    icon: '/logo.svg',
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
