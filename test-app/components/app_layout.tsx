/**
 * Application layout wrapper with sidebar
 * Provides consistent layout structure for all pages
 */

'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * App layout component with sidebar
 * Excludes sidebar for hazo_connect routes (admin UI should be standalone)
 */
export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isHazoConnectRoute = pathname?.startsWith('/hazo_connect');

  // Standalone layout for hazo_connect routes (no sidebar)
  if (isHazoConnectRoute) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }

  // Standard layout with sidebar for all other routes
  return (
    <div className="cls_app_layout_container flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="cls_app_main flex-1 overflow-hidden flex flex-col min-h-0">
        {children}
      </main>
    </div>
  );
}

