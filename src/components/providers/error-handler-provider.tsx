'use client';

import { useEffect } from 'react';
import { clientErrorHandler } from '@/lib/client-error-handler';

/**
 * Client-Side Error Handler Provider
 *
 * Initializes global error handling for the FAEVision application.
 * Must be mounted client-side to access browser APIs.
 *
 * **JORDAN LEE (CURSOR EXPERT)** + **ALEX THOMPSON (LEAD DEVELOPER)**
 */
export function ErrorHandlerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Error handler is initialized automatically via its constructor
    // This component just ensures it's loaded on the client-side

    if (process.env.NODE_ENV === 'development') {
      console.log('🛡️ FAEVision Error Handler initialized');
    }
  }, []);

  return <>{children}</>;
}
