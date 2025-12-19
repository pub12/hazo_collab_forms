'use client';

/**
 * Client-side providers wrapper
 * Wraps children with LoggerProvider for hazo_collab_forms logging
 */

import { LoggerProvider } from 'hazo_collab_forms';
import { collab_forms_logger } from '@/lib/collab_forms_logger';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LoggerProvider logger={collab_forms_logger}>
      {children}
    </LoggerProvider>
  );
}
