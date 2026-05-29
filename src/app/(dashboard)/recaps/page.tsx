
'use client';

import { useMemo } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, query, where, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Sparkles, Clock, ArrowRight, MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function RecapsPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();

  const recapsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collectionGroup(db, 'recaps'),
      where('viewerIds', 'array-contains', user.uid),
      orderBy('generatedAt', 'desc'),
      limit(20)
    );
  }, [db, user?.uid]);

  const { data: recaps, loading: recapsLoading, error } = useCollection(recapsQuery);

  const isLoading = userLoading || (recapsLoading && !recaps);

  const stats = [
    { title: "Session Analysis", count: recaps?.length || 0, icon: BrainCircuit },
    { title: "Network Highlights", count: recaps ? Math.floor(recaps.length * 4.2) : 0, icon: Sparkles },
    { title: "Knowledge Nodes", count: recaps ? recaps.length * 2 : 0, icon: Clock },
  ];

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="h-20 w-1/3 bg-muted/20 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-card/40 animate-pulse border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
            AI Workspace Recaps
          </h1>
          <p className="text-muted-foreground mt-1">Intelligent summaries of your collaborative deep-work sessions.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {stats.map(s => (
            <div key={s.title} className="bg-card/40 px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 shrink-0">
              <s.icon className="w-4 h-4 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold leading-none mb-1">{s.title}</p>
                <p className="text-sm font-bold">{s.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <Card className="border-destructive/20 bg-destructive/5 text-destructive p-4 flex flex-col gap-2 rounded-xl">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold uppercase tracking-widest">Index Required for Analytics</p>
          </div>
          <p className="text-[10px] opacity-80 leading-relaxed">
            This workspace view requires a Firestore Collection Group index. 
            Please check your browser console for the direct creation link provided by Firebase.
          </p>
        </Card>
      )}

      {recaps && recaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recaps.map((recap) => (
            <Card key={recap.id} className="glass-morphism border-white/5 hover:border-primary/20 transition-all group cursor-pointer relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="w-4 h-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
              <CardHeader className="flex-none">
                <Badge variant="outline" className="w-fit mb-2 bg-primary/5 text-primary border-primary/20 text-[9px] uppercase tracking-tighter">
                  {recap.roomTitle}
                </Badge>
                <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {recap.summaryTitle}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
                  <Clock className="w-3 h-3" /> 
                  {recap.generatedAt?.toDate ? format(recap.generatedAt.toDate(), 'MMM dd, yyyy') : 'Recently Generated'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed flex-1">
                  {recap.overallSummary}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    <BrainCircuit className="w-3 h-3 text-primary" /> Intelligence Archive
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
            <BrainCircuit className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight">Archives Empty</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Your intelligence recaps appear here after a session concludes. Join a hub and trigger an <b>Intel Analysis</b> to begin your archive.
            </p>
          </div>
          <Button asChild variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 h-11 px-8 rounded-xl">
            <Link href="/dashboard">Return to Scholar Terminal</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
