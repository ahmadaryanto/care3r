'use client';

import { useEffect } from 'react';

/**
 * Suppresses noisy runtime errors injected by browser wallet extensions
 * (e.g. TronLink's "set on proxy: trap returned falsish for property 'tronlinkParams'").
 *
 * These errors come from third-party extensions trying to inject globals
 * into window. They are not caused by this application.
 *
 * The real fix for users is to disable the offending extension(s) on localhost
 * or on this origin.
 */
export default function ClientErrorSuppressor() {
  useEffect(() => {
    const isWalletExtensionNoise = (message: string | undefined): boolean => {
      if (!message) return false;
      const lower = message.toLowerCase();
      return (
        lower.includes('tronlinkparams') ||
        lower.includes('tronlink') ||
        lower.includes('set on proxy') ||
        lower.includes('trap returned falsish')
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === 'string'
          ? reason
          : reason?.message || reason?.toString?.() || '';

      if (isWalletExtensionNoise(message)) {
        // Prevent it from bubbling to Next.js error overlay and console noise
        event.preventDefault();
        // You can uncomment the next line during development if you want visibility
        // console.debug('[suppressed] Wallet extension error:', message);
      }
    };

    const handleError = (event: ErrorEvent) => {
      if (isWalletExtensionNoise(event.message)) {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError, true);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  return null;
}
