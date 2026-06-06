'use client';

import { useState } from 'react';
import { 
  Bell, 
  BrainCircuit, 
  Users, 
  Target, 
  Sparkles, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: any;
  type: 'ai' | 'system' | 'goal';
  unread: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Intel Analysis Complete',
    description: 'The recap for "Quantum Algorithms" has been archived.',
    time: '2m ago',
    icon: BrainCircuit,
    type: 'ai',
    unread: true
  },
  {
    id: '2',
    title: 'New Scholar Joined',
    description: 'Sarah Jenkins has entered your study hub.',
    time: '15m ago',
    icon: Users,
    type: 'system',
    unread: true
  },
  {
    id: '3',
    title: 'Milestone Approaching',
    description: 'You are 2 hours away from your weekly focus goal.',
    time: '1h ago',
    icon: Target,
    type: 'goal',
    unread: false
  },
  {
    id: '4',
    title: 'Operational Streak',
    description: '7-day study streak confirmed by Nexus protocols.',
    time: '5h ago',
    icon: Sparkles,
    type: 'system',
    unread: false
  }
];

export function NotificationPopover() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 glass-morphism border-white/10" align="end">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h4 className="text-xs font-bold uppercase tracking-widest">Scholar Alerts</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              className="h-auto p-0 text-[10px] text-primary hover:bg-transparent"
              onClick={markAllRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          <div className="flex flex-col">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={cn(
                  "p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-default relative",
                  n.unread && "bg-primary/5"
                )}
              >
                {n.unread && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />}
                <div className="flex gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    n.type === 'ai' ? "bg-primary/20 text-primary" : 
                    n.type === 'goal' ? "bg-accent/20 text-accent" : 
                    "bg-muted/50 text-muted-foreground"
                  )}>
                    <n.icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold leading-none">{n.title}</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{n.description}</p>
                    <p className="text-[9px] text-muted-foreground/50 flex items-center gap-1 pt-1">
                      <Clock className="w-2.5 h-2.5" /> {n.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t border-white/5 text-center bg-white/[0.01]">
          <Button variant="ghost" className="w-full text-[10px] h-8 text-muted-foreground">
            Clear all history
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
