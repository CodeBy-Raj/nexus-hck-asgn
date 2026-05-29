'use client';

import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Users, History } from 'lucide-react';
import { format } from 'date-fns';

interface SessionHistoryProps {
  roomId: string;
}

export function SessionHistory({ roomId }: SessionHistoryProps) {
  const db = useFirestore();
  const sessionsQuery = useMemoFirebase(() => {
    if (!db || !roomId) return null;
    return query(
      collection(db, 'rooms', roomId, 'sessions'), 
      where('status', 'in', ['COMPLETED', 'CANCELLED']),
      orderBy('startTime', 'desc'),
      limit(10)
    );
  }, [db, roomId]);

  const { data: sessions, loading } = useCollection(sessionsQuery);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-20 bg-muted/20 rounded-xl" /></div>;

  return (
    <div className="space-y-4">
      {sessions?.map((session) => (
        <Card key={session.id} className="bg-card/30 border-white/5 overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">{session.goal}</CardTitle>
              <Badge variant={session.status === 'COMPLETED' ? 'secondary' : 'outline'} className="text-[8px] h-4">
                {session.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.durationMinutes}m</span>
              <span className="flex items-center gap-1">
                <History className="w-3 h-3" /> 
                {session.startTime?.toDate ? format(session.startTime.toDate(), 'MMM dd, HH:mm') : 'Recently'}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
      {sessions?.length === 0 && (
        <div className="text-center py-8 text-xs text-muted-foreground italic">No historical data recorded for this hub.</div>
      )}
    </div>
  );
}
