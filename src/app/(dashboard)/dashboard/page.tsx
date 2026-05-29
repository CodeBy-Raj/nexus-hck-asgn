
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, orderBy, limit, collectionGroup, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Clock, Zap, PlayCircle, Plus, TrendingUp, Calendar, Target, Flame, History, AlertCircle, Sparkles } from "lucide-react";
import { RoomCard } from "@/components/rooms/room-card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { CreateRoomDialog } from '@/components/rooms/create-room-dialog';
import { StatCard } from '@/components/dashboard/stat-card';
import { FocusTrendChart } from '@/components/dashboard/focus-trend-chart';
import { ContributionHeatmap } from '@/components/dashboard/contribution-heatmap';
import { subDays, format } from 'date-fns';
import confetti from 'canvas-confetti';

interface DashboardStats {
  totalHrs: string;
  rawHrs: number;
  currentStreak: number;
  peakStreak: number;
  avgFlow: number;
  trendData: { date: string; minutes: number }[];
  heatmapData: { date: Date; minutes: number }[];
  isDemo: boolean;
}

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();

  // 1. Define Queries (Order matters - define before use)
  const myRoomsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'rooms'),
      where('members', 'array-contains', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [db, user?.uid]);

  const sessionsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collectionGroup(db, 'sessions'),
      where('participantIds', 'array-contains', user.uid),
      where('status', '==', 'COMPLETED'),
      orderBy('startTime', 'desc'),
      limit(100)
    );
  }, [db, user?.uid]);

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  // 2. Fetch Data
  const { data: myRooms, loading: roomsLoading, error: roomsError } = useCollection(myRoomsQuery);
  const { data: sessions, loading: sessionsLoading, error: sessionsError } = useCollection(sessionsQuery);
  const { data: profile } = useDoc(userDocRef);

  const targetHours = profile?.weeklyGoal || 15;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // 3. Process Stats
  useEffect(() => {
    if (!hasHydrated || userLoading || (sessionsLoading && !sessions)) return;

    const isActuallyAnonymous = user?.isAnonymous;
    const hasRealSessions = sessions && sessions.length > 0;
    const now = new Date();
    
    // Static trend map initialization
    const trendMap = new Map();
    for (let i = 29; i >= 0; i--) {
      trendMap.set(format(subDays(now, i), 'MMM dd'), 0);
    }

    if (isActuallyAnonymous && !hasRealSessions) {
      // Mock data for Anonymous Guests
      const mockTrendData = Array.from({ length: 30 }).map((_, i) => ({
        date: format(subDays(now, 29 - i), 'MMM dd'),
        minutes: Math.round((Math.sin(i / 5) * 40 + 60) + Math.random() * 20)
      }));

      const mockHeatmapData: { date: Date; minutes: number }[] = [];
      for (let i = 0; i < 84; i++) {
        if (Math.random() > 0.3) {
          mockHeatmapData.push({ date: subDays(now, i), minutes: Math.round(Math.random() * 120 + 30) });
        }
      }

      setStats({
        totalHrs: '42.8',
        rawHrs: 42.8,
        currentStreak: 7,
        peakStreak: 12,
        avgFlow: 48,
        trendData: mockTrendData,
        heatmapData: mockHeatmapData,
        isDemo: true
      });
      return;
    }

    // Real data processing
    const totalMins = sessions?.reduce((acc, s) => acc + (s.durationMinutes || 0), 0) || 0;
    const totalHrs = totalMins / 60;
    
    const heatmapSessions: { date: Date; minutes: number }[] = [];
    sessions?.forEach(s => {
      if (!s.startTime) return;
      const dateObj = s.startTime.toDate ? s.startTime.toDate() : new Date(s.startTime);
      const dateStr = format(dateObj, 'MMM dd');
      if (trendMap.has(dateStr)) {
        trendMap.set(dateStr, trendMap.get(dateStr) + (s.durationMinutes || 0));
      }
      heatmapSessions.push({ date: dateObj, minutes: s.durationMinutes || 0 });
    });

    // Milestone Celebration (Client Side Only)
    if (totalHrs >= targetHours && targetHours > 0 && hasRealSessions) {
      const lastMilestone = localStorage.getItem('last_celebration_v3');
      if (lastMilestone !== targetHours.toString()) {
        confetti({ 
          particleCount: 150, 
          spread: 70, 
          origin: { y: 0.6 }, 
          colors: ['#3b82f6', '#f59e0b', '#10b981'] 
        });
        localStorage.setItem('last_celebration_v3', targetHours.toString());
      }
    }

    setStats({
      totalHrs: totalHrs.toFixed(1),
      rawHrs: totalHrs,
      currentStreak: hasRealSessions ? 1 : 0,
      peakStreak: hasRealSessions ? 1 : 0,
      avgFlow: hasRealSessions ? Math.round(totalMins / sessions!.length) : 0,
      trendData: Array.from(trendMap).map(([date, minutes]) => ({ date, minutes })),
      heatmapData: heatmapSessions,
      isDemo: false
    });
  }, [sessions, targetHours, user?.isAnonymous, sessionsLoading, userLoading, hasHydrated]);

  if (userLoading || !stats) {
    return (
      <div className="p-6 space-y-8 max-w-7xl mx-auto animate-pulse">
        <div className="h-20 w-1/3 bg-muted/20 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted/20 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
              Scholar Terminal
            </h1>
            {stats.isDemo && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary font-bold uppercase animate-pulse">
                <Sparkles className="w-3 h-3" /> Sample Data
              </div>
            )}
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> {format(new Date(), 'EEEE, MMMM do')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="border-white/10 hover:bg-white/5 rounded-xl">
            <Link href="/join">Join Hub</Link>
          </Button>
          <CreateRoomDialog />
        </div>
      </div>

      {(roomsError || sessionsError) && !stats.isDemo && (
        <Card className="border-destructive/20 bg-destructive/5 text-destructive p-4 flex items-center gap-3 rounded-xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Sync Error: Indexes Required</p>
            <p className="opacity-80">Check browser console for index setup links.</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Cumulative Focus" value={stats.totalHrs} subValue="Hrs" icon={Clock} color="text-primary" />
        <StatCard label="Operational Streak" value={stats.currentStreak} subValue={`Peak: ${stats.peakStreak}d`} icon={Flame} color="text-orange-400" />
        <StatCard label="Average Session" value={stats.avgFlow} subValue="Min" icon={Zap} color="text-emerald-400" />
        <StatCard label="Goal Progress" value={`${Math.min(100, Math.round((stats.rawHrs / (targetHours || 1)) * 100))}%`} subValue={`of ${targetHours}h`} icon={Target} color="text-blue-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none bg-card/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Focus Trajectory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FocusTrendChart data={stats.trendData} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Active Hubs</h2>
            </div>
            {roomsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => <div key={i} className="h-64 rounded-2xl bg-card/40 animate-pulse border border-white/5" />)}
              </div>
            ) : myRooms && myRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myRooms.map((room) => <RoomCard key={room.id} room={room as any} />)}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-white/5 bg-transparent flex flex-col items-center justify-center p-12 text-center rounded-3xl space-y-4">
                <BrainCircuit className="w-12 h-12 text-muted-foreground opacity-20" />
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-muted-foreground">No focus nodes identified</h3>
                </div>
                <CreateRoomDialog />
              </Card>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none bg-sidebar/30 border border-white/5 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" /> Target Projection
                </CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold tracking-tighter">Weekly Scholar Milestone</CardDescription>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" asChild>
                <Link href="/profile?tab=settings">
                  <Plus className="w-4 h-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span>{stats.rawHrs.toFixed(1)} / {targetHours} Hours</span>
                  <span>{Math.min(100, Math.round((stats.rawHrs / (targetHours || 1)) * 100))}%</span>
                </div>
                <Progress value={(stats.rawHrs / (targetHours || 1)) * 100} className="h-2 rounded-full bg-white/[0.03]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-sidebar/30 border border-white/5 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Contribution Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContributionHeatmap sessions={stats.heatmapData} />
            </CardContent>
          </Card>

          <Card className="border-none bg-gradient-to-br from-primary/20 to-blue-500/20 border border-white/10 overflow-hidden relative rounded-2xl group">
             <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Rapid Start</CardTitle>
                <PlayCircle className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <CardDescription className="text-xs">Launch a 25m Pomodoro cycle instantly.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl">
                <Link href={myRooms?.[0] ? `/rooms/${myRooms[0].id}` : '/dashboard'}>Launch Solo Focus</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
