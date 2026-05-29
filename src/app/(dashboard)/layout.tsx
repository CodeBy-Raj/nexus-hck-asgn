'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BrainCircuit, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SyncStatusBar } from "@/components/layout/sync-status-bar";
import { NotificationPopover } from "@/components/layout/notification-popover";
import { Toaster as SonnerToaster } from 'sonner';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <SyncStatusBar />
        <SonnerToaster position="top-center" theme="dark" />
        
        <SidebarNav />

        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          {/* Top Header */}
          <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-40 shrink-0">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger className="md:hidden" />
              <div className="flex items-center gap-2 mr-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <BrainCircuit className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-headline font-bold text-lg tracking-tight hidden sm:inline">
                  Nexus<span className="text-primary">Study</span>
                </span>
              </div>
              <div className="relative w-full max-w-md hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search rooms, sessions, or recaps..." 
                  className="pl-10 bg-muted/30 border-none h-10 ring-offset-background focus-visible:ring-primary/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationPopover />
              <Avatar className="w-9 h-9 border border-border">
                <AvatarImage src="https://picsum.photos/seed/user/100/100" />
                <AvatarFallback>NS</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto relative">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
