
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Send, 
  MessageSquare, 
  BrainCircuit, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Sparkles,
  Loader2,
  Clock,
  LogOut,
  ChevronRight,
  Activity,
  Square,
  Trophy,
  Users as UsersIcon,
  Maximize2,
  Minimize2,
  FileEdit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection, addDoc, serverTimestamp, updateDoc, query, orderBy, limit, increment } from "firebase/firestore";
import { TimerWheel } from "@/components/sessions/timer-wheel";
import { StartSessionDialog } from "@/components/sessions/start-session-dialog";
import { type StudySession, type StudyRoom } from "@/types/study";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { MessageBubble } from "@/components/chat/message-bubble";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { RoomLeaderboard } from "@/components/rooms/room-leaderboard";
import { SharedNotes } from "@/components/rooms/shared-notes";
import { GenerateSummaryButton } from "@/components/rooms/generate-summary-button";
import { playAlert } from "@/lib/audio-utils";
import { useFocusMode } from "@/hooks/use-focus-mode";
import { cn } from "@/lib/utils";

export default function StudyRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const roomId = params.id as string;
  const { isFocused, toggleFocus } = useFocusMode();

  const roomRef = useMemoFirebase(() => doc(db, "rooms", roomId), [db, roomId]);
  const { data: room, loading: roomLoading } = useDoc<StudyRoom>(roomRef as any);

  const activeSessionRef = useMemoFirebase(() => {
    if (!room?.activeSessionId) return null;
    return doc(db, "rooms", roomId, "sessions", room.activeSessionId);
  }, [db, roomId, room?.activeSessionId]);
  const { data: activeSession } = useDoc<StudySession>(activeSessionRef as any);

  const { messages, sendMessage, typingUsers, setTyping } = useChatSocket(db, roomId);

  const logsQuery = useMemoFirebase(() => {
    return query(collection(db, 'rooms', roomId, 'logs'), orderBy('timestamp', 'desc'), limit(50));
  }, [db, roomId]);
  const { data: logs } = useCollection(logsQuery);

  const [newMessage, setNewMessage] = useState("");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleEndSession = async (status: 'COMPLETED' | 'CANCELLED' = 'CANCELLED') => {
    if (!activeSessionRef || !roomRef || !user) return;
    
    await updateDoc(activeSessionRef as any, { status });
    await updateDoc(roomRef, { activeSessionId: null });
    
    addDoc(collection(db, "rooms", roomId, "messages"), {
      senderId: 'system',
      senderName: 'Nexus AI',
      content: `Hub session concluded with status: ${status}.`,
      timestamp: serverTimestamp(),
      type: 'system'
    });

    if (status === 'COMPLETED') {
      toast({ title: "Productivity Milestone!", description: "Target session results recorded." });
    }
  };

  const handlePhaseSwitch = async () => {
    if (!activeSessionRef || !user || !activeSession) return;
    
    const isOwner = user.uid === activeSession.initiatorId || user.uid === room?.ownerId;
    if (!isOwner) return;

    const nextPhase = activeSession.pomodoroPhase === 'FOCUS' ? 'BREAK' : 'FOCUS';
    const nextDuration = nextPhase === 'BREAK' ? 5 : 25;

    await updateDoc(activeSessionRef as any, {
      pomodoroPhase: nextPhase,
      startTime: serverTimestamp(),
      durationMinutes: nextDuration,
      completedIntervals: increment(nextPhase === 'BREAK' ? 1 : 0)
    });

    addDoc(collection(db, "rooms", roomId, "messages"), {
      senderId: 'system',
      senderName: 'Nexus AI',
      content: `State transition: Moving to ${nextPhase} mode.`,
      timestamp: serverTimestamp(),
      type: 'system'
    });
  };

  useEffect(() => {
    if (!activeSession || activeSession.status !== 'ACTIVE' || !activeSession.startTime) {
      setTimeLeft(0);
      return;
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const startTime = activeSession.startTime.toMillis();
      const totalSeconds = activeSession.durationMinutes * 60;
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, totalSeconds - elapsedSeconds);
      
      setTimeLeft(remaining);

      if (remaining === 0) {
        if (activeSession.isPomodoro) {
          playAlert(activeSession.pomodoroPhase === 'FOCUS' ? 'BREAK' : 'FOCUS');
          handlePhaseSwitch();
        } else if (user?.uid === activeSession.initiatorId || user?.uid === room?.ownerId) {
          handleEndSession('COMPLETED');
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession, user?.uid, room?.ownerId]);

  if (roomLoading) return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" /></div>;
  if (!room) return <div className="p-8 text-center bg-background h-screen">Invalid Workspace Node.</div>;

  return (
    <div className={cn("flex flex-col h-[calc(100vh-4rem)] transition-all duration-500 overflow-hidden", isFocused ? "bg-black" : "bg-background")}>
      <header className={cn(
        "flex items-center justify-between bg-card/40 p-3 m-4 rounded-xl border border-white/5 backdrop-blur-md transition-opacity duration-500 shrink-0",
        isFocused ? "opacity-20 hover:opacity-100" : "opacity-100"
      )}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shadow-lg shadow-primary/10 shrink-0">
            <BrainCircuit className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight line-clamp-1">{room.title}</h1>
            <div className="flex items-center gap-2 text-[8px] text-muted-foreground font-bold uppercase tracking-widest">
              <Badge variant="outline" className="h-3 px-1 text-[7px] border-white/5">{room.inviteCode}</Badge>
              <span className="hidden sm:inline truncate">{room.category}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isFocused && (
            <div className="hidden lg:block mr-2">
               <GenerateSummaryButton roomId={roomId} roomTitle={room.title} members={room.members} />
            </div>
          )}
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-white/5" onClick={toggleFocus} title="Toggle Focus Mode (Ctrl+Shift+F)">
            {isFocused ? <Minimize2 className="w-4 h-4 text-primary" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6 bg-white/10 hidden sm:block" />
          <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-white/5 hidden sm:flex" onClick={() => setIsMicOn(!isMicOn)}>
            {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 text-destructive" />}
          </Button>
          <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-white/5 hidden sm:flex" onClick={() => setIsVideoOn(!isVideoOn)}>
            {isVideoOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5 text-destructive" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-[10px] text-muted-foreground gap-2 hover:bg-destructive/10 hover:text-destructive rounded-lg" onClick={() => router.push('/dashboard')}>
            <LogOut className="w-3.5 h-3.5" /> <span className="hidden md:inline">Leave Hub</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 px-4 pb-4 min-h-0 flex flex-col overflow-hidden">
        <Tabs defaultValue="session" className="flex flex-col h-full overflow-hidden">
          <TabsList className={cn(
            "bg-muted/30 p-1 mb-4 w-fit border border-white/5 transition-opacity duration-500 shrink-0",
            isFocused && "opacity-0 pointer-events-none"
          )}>
            <TabsTrigger value="session" className="gap-2 rounded-lg text-xs h-8"><Clock className="w-3.5 h-3.5" /> Focus</TabsTrigger>
            <TabsTrigger value="chat" className="gap-2 rounded-lg text-xs h-8"><MessageSquare className="w-3.5 h-3.5" /> Hub Chat</TabsTrigger>
            <TabsTrigger value="notes" className="gap-2 rounded-lg text-xs h-8"><FileEdit className="w-3.5 h-3.5" /> Board</TabsTrigger>
            <TabsTrigger value="activity" className="gap-2 rounded-lg text-xs h-8"><Activity className="w-3.5 h-3.5" /> Telemetry</TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0 relative">
            <TabsContent value="session" className="absolute inset-0 m-0 h-full w-full data-[state=active]:flex">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full w-full overflow-hidden">
                <div className={cn("transition-all duration-500 flex flex-col h-full min-h-0 overflow-hidden", isFocused ? "lg:col-span-12" : "lg:col-span-8")}>
                  <Card className={cn(
                    "border-none bg-card/40 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-all duration-700 flex-1 min-h-0 h-full",
                    isFocused && "scale-105"
                  )}>
                    <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto space-y-6 sm:space-y-12">
                      <TimerWheel 
                        remainingSeconds={timeLeft} 
                        totalSeconds={(activeSession?.durationMinutes || 25) * 60} 
                        isActive={!!activeSession} 
                        phase={activeSession?.pomodoroPhase}
                      />
                      <div className={cn(
                        "flex flex-col items-center gap-4 w-full max-w-xs relative z-10 transition-opacity",
                        isFocused && "opacity-30 hover:opacity-100"
                      )}>
                        {!activeSession ? (
                          <StartSessionDialog roomId={roomId} roomTitle={room.title} />
                        ) : (
                          <div className="space-y-4 w-full text-center">
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary animate-pulse line-clamp-1">{activeSession.goal}</p>
                              {activeSession.isPomodoro && (
                                <div className="flex justify-center gap-1.5 mt-2">
                                  {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className={cn(
                                      "w-1.5 h-1.5 rounded-full border border-primary/30",
                                      i < (activeSession.completedIntervals || 0) ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "bg-transparent"
                                    )} />
                                  ))}
                                </div>
                              )}
                            </div>
                            <Button variant="outline" size="sm" className="w-full border-destructive/20 text-destructive hover:bg-destructive/10 bg-destructive/5 rounded-xl h-9" onClick={() => handleEndSession('CANCELLED')}>
                              <Square className="w-3 h-3 mr-2 fill-current" /> Terminate Node
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
                
                {!isFocused && (
                  <div className="lg:col-span-4 flex flex-col h-full min-h-0 animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden">
                    <Card className="flex-1 border-none bg-sidebar/30 overflow-hidden flex flex-col border border-white/5 rounded-2xl h-full">
                      <CardHeader className="p-3 flex flex-row items-center justify-between border-b border-white/5 bg-background/20 shrink-0">
                        <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Analytics Leaderboard</CardTitle>
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      </CardHeader>
                      <ScrollArea className="flex-1 h-full min-h-0">
                        <CardContent className="p-4">
                          <RoomLeaderboard roomId={roomId} db={db} />
                        </CardContent>
                      </ScrollArea>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="chat" className="absolute inset-0 m-0 h-full w-full data-[state=active]:flex flex-col">
              <Card className="border-none bg-card/40 flex flex-col h-full overflow-hidden border border-white/5 rounded-2xl">
                <ScrollArea className="flex-1 px-4 min-h-0">
                  <div className="max-w-4xl mx-auto py-6">
                    {messages.map((msg, i) => (
                      <MessageBubble 
                        key={msg.id} 
                        message={msg} 
                        isFirstInGroup={!messages[i-1] || messages[i-1].senderId !== msg.senderId}
                        isLastInGroup={!messages[i+1] || messages[i+1].senderId !== msg.senderId}
                      />
                    ))}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-border/40 bg-background/50 backdrop-blur-md shrink-0">
                  <TypingIndicator users={Object.values(typingUsers)} />
                  <form className="flex gap-2 max-w-4xl mx-auto mt-2" onSubmit={(e) => {
                    e.preventDefault();
                    if (!newMessage.trim()) return;
                    sendMessage(newMessage);
                    setNewMessage("");
                  }}>
                    <Input 
                      placeholder="Message the hub roster..." 
                      className="bg-muted/30 border-none h-11 rounded-xl focus-visible:ring-primary/50 text-sm"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        setTyping(e.target.value.length > 0);
                      }}
                    />
                    <Button size="icon" type="submit" className="h-11 w-11 rounded-xl shadow-lg shadow-primary/20 shrink-0">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="absolute inset-0 m-0 h-full w-full data-[state=active]:flex flex-col">
               <SharedNotes roomId={roomId} db={db} initialContent={room.sharedNotes} />
            </TabsContent>
            
            <TabsContent value="activity" className="absolute inset-0 m-0 h-full w-full data-[state=active]:flex flex-col">
              <ScrollArea className="flex-1 bg-card/20 rounded-2xl border border-white/5 h-full min-h-0">
                <div className="p-4 space-y-3">
                  {logs?.map((log, i) => (
                    <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 border border-white/5 hover:border-primary/20 transition-all animate-in slide-in-from-bottom-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.3)] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold truncate">{log.userName}</p>
                          <Badge variant="outline" className="text-[7px] h-3 px-1 border-white/10 uppercase tracking-tighter opacity-50 shrink-0">{log.action}</Badge>
                        </div>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">
                          {log.timestamp?.toDate?.().toLocaleString()}
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-20 shrink-0" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
