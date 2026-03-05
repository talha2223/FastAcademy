'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { initFirebaseAnalytics } from '@/lib/firebase-client';

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    void initFirebaseAnalytics();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
