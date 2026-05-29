
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Library, 
  PlusCircle, 
  UserCircle, 
  LogOut, 
  MessageSquare, 
  Settings,
  BrainCircuit,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth-store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Rooms", href: "/dashboard", icon: Library },
  { name: "AI Recaps", href: "/recaps", icon: BrainCircuit },
  { name: "Scholar Guide", href: "/guide", icon: BookOpen },
];

const secondaryNavItems = [
  { name: "Profile", href: "/profile", icon: UserCircle },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged out", description: "Come back soon!" });
      router.push("/login");
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to logout" });
    }
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-sidebar-background/80 backdrop-blur-xl">
      <SidebarHeader className="h-16 flex items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <BrainCircuit className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight group-data-[collapsible=icon]:hidden">
            Nexus<span className="text-primary">Study</span>
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Core Workspace</SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.href)}
                    tooltip={item.name}
                    className={cn(
                      "rounded-xl transition-all duration-300",
                      isActive(item.href) ? "bg-primary/10 text-primary" : "hover:bg-white/5"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn(isActive(item.href) ? "text-primary" : "text-muted-foreground")} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">User Preferences</SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.href)}
                    tooltip={item.name}
                    className={cn(
                      "rounded-xl transition-all duration-300",
                      isActive(item.href) ? "bg-primary/10 text-primary" : "hover:bg-white/5"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn(isActive(item.href) ? "text-primary" : "text-muted-foreground")} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Logout" 
              onClick={handleLogout}
              className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
