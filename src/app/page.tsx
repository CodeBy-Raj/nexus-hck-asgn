"use client";

import { Button } from "@/components/ui/button";
import { BrainCircuit, ArrowRight, Sparkles, Zap, Shield, Globe, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="h-20 flex items-center justify-between px-8 max-w-7xl mx-auto w-full border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight">Nexus<span className="text-primary">Study</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/guide" className="text-sm font-medium hover:text-primary transition-colors hidden md:flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Instructions
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">Login</Link>
          <Button asChild className="rounded-xl">
            <Link href="/dashboard">Get Started Free</Link>
          </Button>
        </div>
      </nav>

      <main className="flex-1">
        <section className="py-20 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Study Collaboration</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight">
              Study Smarter with <span className="text-primary">Real-time</span> Hubs
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Nexus Study combines high-performance real-time collaboration with AI-powered insights to supercharge your learning flow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="h-14 px-8 text-lg gap-2 rounded-2xl shadow-xl shadow-primary/20" asChild>
                <Link href="/dashboard">
                  Enter the Hub <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-2xl border-white/10 hover:bg-white/5" asChild>
                <Link href="/guide">Instructions</Link>
              </Button>
            </div>
            <div className="flex items-center gap-6 justify-center lg:justify-start pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden ring-2 ring-primary/20">
                    <Image src={`https://picsum.photos/seed/face${i}/100/100`} alt="user" width={40} height={40} />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Join <span className="text-foreground font-bold">1,200+</span> active scholars online now</p>
            </div>
          </div>

          <div className="relative group perspective-1000 hidden lg:block">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
              <Image 
                src="https://picsum.photos/seed/nexus1/800/600" 
                alt="Nexus Interface" 
                width={800} 
                height={600}
                className="opacity-90"
              />
            </div>
          </div>
        </section>

        <section className="py-24 bg-card/30 border-y border-border/40">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-headline font-bold">Built for Deep Focus</h2>
              <p className="text-muted-foreground">Every protocol you need to master your subjects in record time.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Live Study Hubs', desc: 'Real-time collaborative rooms with synchronized timers and presence handling.', icon: Zap },
                { title: 'Presence Tracking', desc: 'Real-time visibility into who is studying and their current focus state.', icon: Globe },
                { title: 'Session Recaps', desc: 'Generative AI summaries of chat logs and activity for high-fidelity reviews.', icon: BrainCircuit }
              ].map(feature => (
                <div key={feature.title} className="p-8 rounded-3xl bg-background/50 border border-border/40 hover:border-primary/50 transition-all duration-300 space-y-4 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-headline font-bold">Nexus Study</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Nexus Study Platform. Optimized for deep work.</p>
          <div className="flex items-center gap-6">
            <Link href="/guide" className="text-xs text-muted-foreground hover:text-primary transition-colors">Scholar Manual</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
