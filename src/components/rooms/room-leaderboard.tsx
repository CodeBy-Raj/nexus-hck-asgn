'use client';

import { useMemo } from 'react';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, doc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDoc } from '@/firebase';
import { Progress } from "@/components/ui/progress";
import { Loader2, Trophy, Medal } from "lucide-react";
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  roomId: string;
  db: any;
}

export function RoomLeaderboard({ roomId, db }: LeaderboardProps) {
  const sessionsQuery = useMemoFirebase(() => {
    return query(
      collection(db, 'rooms', roomId, 'sessions'),
      where('status', 'in', ['COMPLETED'])
    );
  }, [db, roomId]);

  const { data: sessions, loading } = useCollection(sessionsQuery);

  const leaderboard = useMemo(() => {
    if (!sessions) return [];
    
    const userMap = new Map<string, number>();
    sessions.forEach(s => {
      Object.keys(s.participants || {}).forEach(uid => {
        userMap.set(uid, (userMap.get(uid) || 0) + (s.durationMinutes || 0));
      });
    });

    return Array.from(userMap.entries())
      .map(([uid, mins]) => ({ uid, mins }))
      .sort((a, b) => b.mins - a.mins)
      .slice(0, 10);
  }, [sessions]);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary opacity-50" /></div>;

  const maxMins = leaderboard[0]?.mins || 1;

  return (
    <div className="space-y-6">
      {leaderboard.map((entry, index) => (
        <LeaderboardRow 
          key={entry.uid} 
          uid={entry.uid} 
          mins={entry.mins} 
          index={index} 
          maxMins={maxMins}
          db={db}
        />
      ))}
      {leaderboard.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-xs italic">
          No operational data available for this hub roster.
        </div>
      )}
    </div>
  );
}

function LeaderboardRow({ uid, mins, index, maxMins, db }: any) {
  const { data: profile } = useDoc(doc(db, 'users', uid));
  const percentage = (mins / maxMins) * 100;

  if (!profile) return null;

  return (
    <div className="space-y-2 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-8 w-8 border border-white/5">
              <AvatarImage src={profile.photoURL} />
              <AvatarFallback>{profile.displayName?.[0]}</AvatarFallback>
            </Avatar>
            {index < 3 && (
              <div className={cn(
                "absolute -top-1 -right-1 p-0.5 rounded-full",
                index === 0 ? "bg-amber-400" : index === 1 ? "bg-slate-300" : "bg-orange-600"
              )}>
                <Trophy className="w-2.5 h-2.5 text-black" />
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-bold group-hover:text-primary transition-colors">{profile.displayName}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-medium">{mins} mins focus</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground">#{index + 1}</span>
      </div>
      <Progress value={percentage} className="h-1.5 bg-white/[0.03]" indicatorClassName={cn(
        index === 0 ? "bg-primary" : "bg-primary/50"
      )} />
    </div>
  );
}
