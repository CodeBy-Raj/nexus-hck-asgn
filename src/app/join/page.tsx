
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, where, getDocs, updateDoc, arrayUnion, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function JoinRoomPage() {
  const [code, setCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !db || !user) return;

    setIsJoining(true);
    try {
      const q = query(collection(db, 'rooms'), where('inviteCode', '==', code.toUpperCase().trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({ variant: 'destructive', title: 'Invalid Code', description: 'No study room found with this invite code.' });
        setIsJoining(false);
        return;
      }

      const roomDoc = querySnapshot.docs[0];
      const roomId = roomDoc.id;
      const roomData = roomDoc.data();

      if (roomData.members.includes(user.uid)) {
        router.push(`/rooms/${roomId}`);
        return;
      }

      if (roomData.members.length >= (roomData.maxMembers || 50)) {
        toast({ variant: 'destructive', title: 'Room Full', description: 'This hub has reached its maximum capacity.' });
        setIsJoining(false);
        return;
      }

      // Add member to room
      await updateDoc(doc(db, 'rooms', roomId), {
        members: arrayUnion(user.uid)
      });

      // Log system message
      await addDoc(collection(db, 'rooms', roomId, 'messages'), {
        senderId: 'system',
        senderName: 'Nexus AI',
        content: `${user.displayName || 'A new scholar'} joined the hub.`,
        timestamp: serverTimestamp(),
        type: 'system'
      });

      toast({ title: 'Joined!', description: `Welcome to ${roomData.title}` });
      router.push(`/rooms/${roomId}`);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md glass-morphism border-white/5 relative z-10 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-shimmer bg-[length:200%_100%]" />
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full hover:bg-white/5">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Nexus Network</span>
          </div>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            Join a Hub <Sparkles className="w-5 h-5 text-accent" />
          </CardTitle>
          <CardDescription>Enter a 6-character invite code to enter a study room.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-xs uppercase tracking-widest text-muted-foreground">Invite Code</Label>
              <Input
                id="code"
                placeholder="e.g. XJ7K9P"
                className="text-center text-2xl font-mono tracking-[0.5em] h-14 bg-background/50 border-white/10 uppercase"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                disabled={isJoining}
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg shadow-lg shadow-primary/10" disabled={isJoining || code.length < 6}>
              {isJoining ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Enter Hub'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
