
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BrainCircuit, 
  Zap, 
  Users, 
  Clock, 
  Sparkles, 
  Target, 
  BookOpen, 
  Keyboard, 
  MessageSquare, 
  FileEdit,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GuidePage() {
  const phases = [
    {
      title: "Phase 1: Deployment",
      icon: Users,
      description: "Establishing your workspace and roster.",
      steps: [
        "Create a Study Hub: Launch a dedicated node for a specific subject or project.",
        "Invite Scholars: Share your unique 6-character invite code with peers.",
        "Join a Hub: Enter an existing code to synchronize with another study group."
      ]
    },
    {
      title: "Phase 2: Deep Work",
      icon: Zap,
      description: "Executing high-performance focus cycles.",
      steps: [
        "Select Mode: Choose between standard countdowns or Pomodoro (25/5) intervals.",
        "Set Goals: Define a clear objective to keep the group aligned.",
        "Focus Mode: Press Ctrl+Shift+F to declutter the UI and spotlight the timer.",
        "Collaboration: Use the Shared Board for collective active recall notes."
      ]
    },
    {
      title: "Phase 3: Analysis",
      icon: BrainCircuit,
      description: "Synthesizing intelligence and tracking growth.",
      steps: [
        "Generate Intel: Use the AI analysis button to recap chat and activity logs.",
        "Review Recaps: Access the Recaps archive for spaced repetition sessions.",
        "Track Trajectory: Monitor your heatmap and streaks in the Scholar Terminal."
      ]
    }
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
            Scholar Manual
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Master the Nexus protocols to optimize your collaborative deep work and reach your academic milestones faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {phases.map((phase, i) => (
          <Card key={i} className="glass-morphism border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-background/50 flex items-center justify-center mb-4 border border-white/5">
                <phase.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{phase.title}</CardTitle>
              <CardDescription>{phase.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {phase.steps.map((step, si) => (
                  <li key={si} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {step}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-primary/5 border-primary/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Strategies for Effective Output
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-bold text-sm uppercase tracking-widest text-primary">1. Synchronized Accountability</h4>
              <p className="text-sm text-muted-foreground">
                Always study in a group hub even if you aren't talking. Seeing your peers' focus timers creates a "body doubling" effect that significantly reduces procrastination.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-sm uppercase tracking-widest text-primary">2. Spaced Repetition via AI</h4>
              <p className="text-sm text-muted-foreground">
                Don't just chat—discuss concepts. The AI Recap engine picks up on discussion points. Review these recaps 24 hours later for the most effective knowledge retention.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-sm uppercase tracking-widest text-primary">3. Active Recall Boards</h4>
              <p className="text-sm text-muted-foreground">
                Use the Shared Board to quiz each other. Write a question, and let another member provide the answer in markdown. This interactive recall is superior to passive reading.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-white/5 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-primary" />
              Keyboard Protocols
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-sm font-medium">Toggle Focus Mode</span>
              <kbd className="px-2 py-1 rounded bg-muted text-[10px] font-bold border border-white/10">CTRL + SHIFT + F</kbd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-sm font-medium">Toggle Sidebar</span>
              <kbd className="px-2 py-1 rounded bg-muted text-[10px] font-bold border border-white/10">CMD + B</kbd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-sm font-medium">Exit Hub / Forms</span>
              <kbd className="px-2 py-1 rounded bg-muted text-[10px] font-bold border border-white/10">ESC</kbd>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20 text-xs text-accent text-center font-bold italic">
              "Consistency is the multiplier of intelligence."
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
