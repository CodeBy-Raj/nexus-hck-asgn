
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/firebase';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath = pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/register') || pathname === '/guide';

  useEffect(() => {
    if (!loading && !user && !isPublicPath) {
      router.push('/login');
    }
  }, [user, loading, isPublicPath, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground animate-pulse font-medium">Syncing Nexus session...</p>
        </div>
      </div>
    );
  }

  // Prevent flash of protected content before redirect
  if (!user && !isPublicPath) {
    return null;
  }

  return <>{children}</>;
}
