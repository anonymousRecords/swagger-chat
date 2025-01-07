import type { Metadata } from "next";
import "./globals.css";
import { pretendard } from '@/public/fonts/font';
import 'swagger-ui-react/swagger-ui.css';

export const metadata: Metadata = {
  title: "Swagger Chat",
  description: "Swagger Chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pretendard.variable}antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
