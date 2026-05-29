
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, BrainCircuit } from 'lucide-react';
import { generateSessionSummary } from '@/ai/flows/generate-session-summary';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

interface GenerateSummaryButtonProps {
  roomId: string;
  roomTitle: string;
  members: string[];
}

export function GenerateSummaryButton({ roomId, roomTitle, members }: GenerateSummaryButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!db || !user) return;
    setIsGenerating(true);

    try {
      // 1. Fetch context (last 50 messages)
      const msgsQuery = query(collection(db, 'rooms', roomId, 'messages'), orderBy('timestamp', 'desc'), limit(50));
      const msgsSnap = await getDocs(msgsQuery);
      const chatLogs = msgsSnap.docs.map(doc => ({
        sender: doc.data().senderName,
        message: doc.data().content
      })).reverse();

      // 2. Fetch context (last 20 logs)
      const logsQuery = query(collection(db, 'rooms', roomId, 'logs'), orderBy('timestamp', 'desc'), limit(20));
      const logsSnap = await getDocs(logsQuery);
      const activityLogs = logsSnap.docs.map(doc => `${doc.data().userName}: ${doc.data().action}`);

      // 3. Call AI Flow
      const result = await generateSessionSummary({
        sessionTitle: roomTitle,
        chatLogs,
        activityLogs
      });

      // 4. Persist to Firestore
      const recapData = {
        ...result,
        roomId,
        roomTitle,
        generatedAt: serverTimestamp(),
        viewerIds: members
      };

      addDoc(collection(db, 'rooms', roomId, 'recaps'), recapData)
        .catch(async () => {
          const permissionError = new FirestorePermissionError({
            path: `rooms/${roomId}/recaps`,
            operation: 'create',
            requestResourceData: recapData,
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
        });

      // 5. Log system message
      const msgData = {
        senderId: 'system',
        senderName: 'Nexus AI',
        content: `Intelligence analysis completed: "${result.summaryTitle}" has been added to the archives.`,
        timestamp: serverTimestamp(),
        type: 'system'
      };

      addDoc(collection(db, 'rooms', roomId, 'messages'), msgData)
        .catch(async () => {
          const permissionError = new FirestorePermissionError({
            path: `rooms/${roomId}/messages`,
            operation: 'create',
            requestResourceData: msgData,
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({
        title: 'Intel Analysis Complete',
        description: 'The session summary is now available in your Recaps archive.'
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error.message || 'Could not reach the AI nodes.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="h-8 text-[10px] font-bold uppercase tracking-widest gap-2 border-primary/20 hover:bg-primary/5 text-primary rounded-lg"
      onClick={handleGenerate}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <BrainCircuit className="w-3.5 h-3.5" />
          Generate Intel
        </>
      )}
    </Button>
  );
}
