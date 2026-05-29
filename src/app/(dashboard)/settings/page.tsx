
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to profile with the settings tab selected
    router.replace('/profile?tab=settings');
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground animate-pulse text-sm">Loading Workspace Settings...</p>
      </div>
    </div>
  );
}
