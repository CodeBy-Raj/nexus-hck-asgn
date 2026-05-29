
'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, updateDoc, onSnapshot, Firestore } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

interface SharedNotesProps {
  roomId: string;
  db: Firestore;
  initialContent?: string;
}

export function SharedNotes({ roomId, db, initialContent = '' }: SharedNotesProps) {
  const [notes, setNotes] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (snapshot) => {
      const data = snapshot.data();
      if (data?.sharedNotes !== undefined && data.sharedNotes !== notes) {
        setNotes(data.sharedNotes);
      }
    }, async (serverError) => {
      if (serverError.code === 'permission-denied') {
        const permissionError = new FirestorePermissionError({
          path: `rooms/${roomId}`,
          operation: 'get',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      }
    });
    return () => unsubscribe();
  }, [db, roomId, notes]);

  const saveNotes = useCallback((content: string) => {
    setIsSaving(true);
    const data = { sharedNotes: content };
    updateDoc(doc(db, 'rooms', roomId), data)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `rooms/${roomId}`,
          operation: 'update',
          requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [db, roomId]);

  // Debounced effect for auto-save
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (notes !== initialContent) {
        saveNotes(notes);
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [notes, initialContent, saveNotes]);

  return (
    <Card className="border-none bg-card/40 flex flex-col h-full overflow-hidden border border-white/5">
      <CardHeader className="p-4 flex flex-row items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Collaborative Hub Board</CardTitle>
          {isSaving && <Badge variant="secondary" className="text-[8px] animate-pulse">Syncing...</Badge>}
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="edit" className="flex-1 flex flex-col">
          <div className="px-4 py-2 border-b border-white/5 bg-background/20">
            <TabsList className="h-8 bg-muted/20">
              <TabsTrigger value="edit" className="text-xs gap-2"><FileText className="w-3 h-3" /> Write</TabsTrigger>
              <TabsTrigger value="preview" className="text-xs gap-2"><Eye className="w-3 h-3" /> Preview</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="edit" className="flex-1 m-0">
            <Textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Start collaborating on shared hub notes (Markdown supported)..."
              className="h-full w-full border-none bg-transparent resize-none p-6 font-mono text-sm focus-visible:ring-0 leading-relaxed"
            />
          </TabsContent>
          
          <TabsContent value="preview" className="flex-1 m-0 overflow-y-auto p-6">
            <div className="prose prose-invert max-w-none text-sm text-muted-foreground leading-relaxed">
              {notes ? (
                <div className="whitespace-pre-wrap">{notes}</div>
              ) : (
                <p className="italic opacity-50">Nothing to preview yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
