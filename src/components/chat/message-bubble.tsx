
'use client';

import React from 'react';
import { type Message } from '@/types/study';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MessageBubbleProps {
  message: Message;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

// Memoized to prevent re-renders on every scroll update if historical data loads
export const MessageBubble = React.memo(({ message, isFirstInGroup, isLastInGroup }: MessageBubbleProps) => {
  const { user } = useUser();
  const isMe = message.senderId === user?.uid;
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center w-full py-2 my-2 animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-muted/30 border border-border/50 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
          <Info className="w-3 h-3" />
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex w-full group relative mb-0.5",
      isMe ? "justify-end" : "justify-start",
      isFirstInGroup && "mt-4"
    )}>
      {!isMe && (
        <div className="w-8 mr-2 flex-shrink-0">
          {isLastInGroup && (
            <Avatar className="h-8 w-8 border border-white/5 animate-in slide-in-from-left-2">
              <AvatarImage src={message.senderPhoto || `https://picsum.photos/seed/${message.senderId}/100/100`} />
              <AvatarFallback>{message.senderName?.[0]}</AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      <div className={cn(
        "max-w-[75%] flex flex-col",
        isMe ? "items-end" : "items-start"
      )}>
        {isFirstInGroup && !isMe && (
          <span className="text-[10px] font-bold text-muted-foreground mb-1 ml-1 uppercase tracking-tight">
            {message.senderName}
          </span>
        )}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              "px-4 py-2 text-sm transition-all duration-200 select-none",
              isMe 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" 
                : "bg-muted/50 text-foreground",
              isMe && isFirstInGroup && "rounded-t-2xl rounded-bl-2xl rounded-br-none",
              isMe && !isFirstInGroup && !isLastInGroup && "rounded-l-2xl rounded-r-none",
              isMe && isLastInGroup && "rounded-b-2xl rounded-tl-2xl rounded-tr-none",
              !isMe && isFirstInGroup && "rounded-t-2xl rounded-br-2xl rounded-bl-none",
              !isMe && !isFirstInGroup && !isLastInGroup && "rounded-r-2xl rounded-l-none",
              !isMe && isLastInGroup && "rounded-b-2xl rounded-tr-2xl rounded-tl-none",
              (isFirstInGroup && isLastInGroup) && (isMe ? "rounded-2xl rounded-tr-none" : "rounded-2xl rounded-tl-none")
            )}>
              {message.content}
            </div>
          </TooltipTrigger>
          <TooltipContent side={isMe ? "left" : "right"} className="bg-background/90 backdrop-blur-md border-white/10">
            <p className="text-[10px] font-medium">
              {message.timestamp?.toDate ? format(message.timestamp.toDate(), 'h:mm a') : 'Sending...'}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';
