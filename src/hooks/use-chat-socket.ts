
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  Firestore,
  setDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { type Message } from '@/types/study';
import { useUser } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export function useChatSocket(db: Firestore | null, roomId: string) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  
  const lastTypingUpdate = useRef<number>(0);
  const TYPING_THROTTLE = 2000;

  useEffect(() => {
    if (!db || !roomId) return;

    const q = query(
      collection(db, 'rooms', roomId, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveBatch = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message)).reverse();
      
      setMessages(prev => {
        const combined = [...prev, ...liveBatch];
        const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());
        
        return unique.sort((a, b) => {
          const timeA = a.timestamp?.toMillis?.() || 0;
          const timeB = b.timestamp?.toMillis?.() || 0;
          return timeA - timeB;
        });
      });
      
      setLoading(false);
    }, async (serverError) => {
      if (serverError.code === 'permission-denied') {
        const permissionError = new FirestorePermissionError({
          path: `rooms/${roomId}/messages`,
          operation: 'list',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      }
    });

    return () => unsubscribe();
  }, [db, roomId]);

  useEffect(() => {
    if (!db || !roomId) return;

    const typingRef = collection(db, 'rooms', roomId, 'typing');
    const unsubscribe = onSnapshot(typingRef, (snapshot) => {
      const typing: Record<string, string> = {};
      snapshot.forEach(doc => {
        if (doc.id !== user?.uid) {
          typing[doc.id] = doc.data().userName;
        }
      });
      setTypingUsers(typing);
    }, async (serverError) => {
      if (serverError.code === 'permission-denied') {
        const permissionError = new FirestorePermissionError({
          path: `rooms/${roomId}/typing`,
          operation: 'list',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      }
    });

    return () => unsubscribe();
  }, [db, roomId, user?.uid]);

  const setTyping = useCallback((isTyping: boolean) => {
    if (!db || !roomId || !user) return;
    
    const now = Date.now();
    if (!isTyping) {
      deleteDoc(doc(db, 'rooms', roomId, 'typing', user.uid))
        .catch(async () => {
          const permissionError = new FirestorePermissionError({
            path: `rooms/${roomId}/typing/${user.uid}`,
            operation: 'delete',
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
        });
      return;
    }

    if (now - lastTypingUpdate.current < TYPING_THROTTLE) return;
    
    lastTypingUpdate.current = now;
    const typingData = { 
      userName: user.displayName || 'Anonymous', 
      timestamp: serverTimestamp() 
    };
    setDoc(doc(db, 'rooms', roomId, 'typing', user.uid), typingData)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `rooms/${roomId}/typing/${user.uid}`,
          operation: 'write',
          requestResourceData: typingData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  }, [db, roomId, user]);

  const sendMessage = useCallback((content: string) => {
    if (!db || !roomId || !user || !content.trim()) return;

    const msgData = {
      senderId: user.uid,
      senderName: user.displayName || 'Anonymous',
      senderPhoto: user.photoURL || '',
      content,
      timestamp: serverTimestamp(),
      type: 'user'
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
    setTyping(false);
  }, [db, roomId, user, setTyping]);

  return {
    messages,
    loading,
    typingUsers,
    sendMessage,
    setTyping
  };
}
