
'use client';

export function TypingIndicator({ users }: { users: string[] }) {
  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-[10px] text-muted-foreground animate-in fade-in slide-in-from-bottom-2">
      <div className="flex gap-0.5">
        <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
      </div>
      <span>
        {users.length === 1 
          ? `${users[0]} is typing...` 
          : `${users.length} users are typing...`}
      </span>
    </div>
  );
}
