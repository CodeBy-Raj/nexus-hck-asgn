
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full space-y-8 text-center animate-in fade-in duration-500">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <AlertCircle className="w-10 h-10" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">System Exception</h1>
          <p className="text-muted-foreground">
            The Nexus has encountered a synchronization error. Our automated protocols are attempting recovery.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-muted-foreground/50">Error ID: {error.digest}</p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={() => reset()} className="w-full gap-2">
            <RefreshCw className="w-4 h-4" /> Re-sync Workspace
          </Button>
          <Button variant="outline" asChild className="w-full gap-2">
            <Link href="/dashboard">
              <Home className="w-4 h-4" /> Return to Terminal
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
