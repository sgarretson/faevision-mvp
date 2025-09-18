import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/navigation';
import { AuthSessionProvider } from '@/components/providers/session-provider';
import { ErrorHandlerProvider } from '@/components/providers/error-handler-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FAEVision | Strategic Intelligence Platform',
  description:
    'Internal MVP for architecture and engineering firm operational excellence',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthSessionProvider>
          <ErrorHandlerProvider>
            <Navigation />
            {children}
          </ErrorHandlerProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
