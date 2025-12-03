/**
 * Root layout for the test application
 */

import type { Metadata } from 'next';
import './globals.css';
import { AppLayout } from '@/components/app_layout';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Hazo Collab Forms - Test App',
  description: 'Test application for hazo_collab_forms package',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </body>
    </html>
  );
}

