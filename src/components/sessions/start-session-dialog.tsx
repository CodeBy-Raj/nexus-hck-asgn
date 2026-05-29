
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Play, Loader2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StartSessionDialogProps {
  roomId: string;
  roomTitle: string;
}

export function StartSessionDialog({ roomId, roomTitle }: StartSessionDialogProps) {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('25');
  const [isPomodoro, setIsPomodoro] = useState(false);

  const handleStart = async () => {
    if (!user || !db || !goal) return;
    setLoading(true);

    try {
      const sessionData = {
        roomId,
        initiatorId: user.uid,
        goal,
        startTime: serverTimestamp(),
        durationMinutes: isPomodoro ? 25 : parseInt(duration),
        status: 'ACTIVE',
        isPomodoro,
        pomodoroPhase: isPomodoro ? 'FOCUS' : null,
        completedIntervals: 0,
        participantIds: [user.uid],
        participants: {
          [user.uid]: serverTimestamp()
        }
      };

      const sessionRef = await addDoc(collection(db, 'rooms', roomId, 'sessions'), sessionData);
      
      await updateDoc(doc(db, 'rooms', roomId), {
        activeSessionId: sessionRef.id
      });

      await addDoc(collection(db, 'rooms', roomId, 'messages'), {
        senderId: 'system',
        senderName: 'Nexus AI',
        content: `${user.displayName || 'Owner'} started a ${isPomodoro ? 'Pomodoro cycle' : 'focus session'}: "${goal}"`,
        timestamp: serverTimestamp(),
        type: 'system'
      });

      toast({ title: isPomodoro ? 'Pomodoro Cycle Launched' : 'Focus Started', description: `Good luck with: ${goal}` });
      setOpen(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-14 px-8 text-lg gap-2 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
          <Play className="w-5 h-5 fill-current" /> Start Focus Session
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-morphism border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Launch Focus Mode</DialogTitle>
          <DialogDescription>
            Setting a clear goal helps the group stay productive.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Pomodoro Mode
              </Label>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">25m Work / 5m Breather sync</p>
            </div>
            <Switch checked={isPomodoro} onCheckedChange={setIsPomodoro} disabled={loading} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="goal">Primary Focus Goal</Label>
            <Input
              id="goal"
              placeholder="e.g., Finishing Chapter 4 Notes"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              disabled={loading}
            />
          </div>

          {!isPomodoro && (
            <div className="grid gap-2">
              <Label>Duration (Minutes)</Label>
              <Select value={duration} onValueChange={setDuration} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 Minutes (Short Burst)</SelectItem>
                  <SelectItem value="25">25 Minutes (Standard)</SelectItem>
                  <SelectItem value="50">50 Minutes (Deep Focus)</SelectItem>
                  <SelectItem value="90">90 Minutes (Flow State)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleStart} disabled={loading || !goal} className="w-full h-11">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Start Clock'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
