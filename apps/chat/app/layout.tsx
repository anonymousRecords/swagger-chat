import { pretendard } from '@/public/fonts/font';
// import 'swagger-ui-react/swagger-ui.css';
import './globals.css';

export const metadata = {
  title: "Swagger Chat",
  description: "Chat with your Swagger API Documentation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${pretendard.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}