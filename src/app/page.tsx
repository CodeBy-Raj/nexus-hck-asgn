"use client";

import { Button } from "@/components/ui/button";
import { 
  BrainCircuit, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Shield, 
  Globe, 
  BookOpen, 
  Users, 
  Timer, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle2,
  Lock,
  Search
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import placeholderData from "@/app/lib/placeholder-images.json";

export default function LandingPage() {
  const getImage = (id: string) => placeholderData.placeholderImages.find(img => img.id === id);

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/30">
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="h-16 flex items-center justify-between px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <BrainCircuit className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight">Nexus<span className="text-primary">Study</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How it Works</Link>
            <Link href="/guide" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Manual</Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex rounded-xl">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild className="rounded-xl shadow-lg shadow-primary/10">
              <Link href="/register">Join Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-20">
             <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-primary blur-[120px] rounded-full animate-pulse" />
             <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-accent blur-[100px] rounded-full animate-pulse delay-700" />
          </div>

          <div className="px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Synchronized Deep Work</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-headline font-bold leading-[1.1] tracking-tight text-foreground">
                Study in <span className="text-primary">Real-Time</span> With Elite Scholars
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Transform solitary study into a high-performance hub. Synchronized focus timers, AI recaps, and real-time presence for modern learners.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Button size="lg" className="h-14 px-8 text-lg gap-2 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform" asChild>
                  <Link href="/register">
                    Start Focusing Now <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-2xl border-border bg-card/50 hover:bg-muted" asChild>
                  <Link href="/guide">View Protocols</Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 justify-center lg:justify-start pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                      <Image 
                        src={`https://picsum.photos/seed/scholar${i}/100/100`} 
                        alt="scholar" 
                        width={40} 
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground text-left">
                  <p className="text-foreground font-bold">1,200+ Scholars Active</p>
                  <p>In 45+ study hubs right now</p>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-10 duration-1000">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-[2.5rem] blur-3xl opacity-30" />
              <div className="relative rounded-[2rem] border border-border/50 bg-card overflow-hidden shadow-2xl">
                <Image 
                  src={getImage('hero-study')?.imageUrl || ''} 
                  alt="Nexus Study Workspace" 
                  width={800} 
                  height={600}
                  className="w-full h-auto opacity-95 group-hover:scale-105 transition-transform duration-700"
                  data-ai-hint="collaborative study"
                />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-morphism border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="text-[10px] uppercase font-bold tracking-widest text-white">
                      Live Hub: Quantum Dynamics
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">25:00</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="py-12 border-y border-border/40 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Deep Work Minutes', value: '4.2M+', icon: Timer },
                { label: 'Global Study Hubs', value: '18k+', icon: Globe },
                { label: 'AI Recaps Generated', value: '95k+', icon: BrainCircuit },
                { label: 'Scholar Satisfaction', value: '99.8%', icon: Sparkles },
              ].map(stat => (
                <div key={stat.label} className="text-center space-y-1">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-5 h-5 text-primary opacity-60" />
                  </div>
                  <p className="text-2xl md:text-3xl font-headline font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-headline font-bold text-foreground tracking-tight">Optimized for Academic Mastery</h2>
            <p className="text-muted-foreground text-lg">Every feature is designed to reduce procrastination and maximize cognitive output.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'High-Fidelity Presence', 
                desc: 'See exactly who is online and their current focus state. Synchronized body-doubling that eliminates the feeling of studying alone.', 
                icon: Users,
                color: 'text-blue-500'
              },
              { 
                title: 'AI Intelligence Recaps', 
                desc: 'Our Gemini-powered engine parses session chat logs to generate structured summaries, key points, and future study targets.', 
                icon: BrainCircuit,
                color: 'text-primary'
              },
              { 
                title: 'Synchronized Focus Engine', 
                desc: 'Universal Pomodoro or countdown timers that sync for everyone in the hub, creating group accountability for breaks and work.', 
                icon: Zap,
                color: 'text-amber-500'
              },
              { 
                title: 'Contribution Matrix', 
                desc: 'Track your focus trajectory with GitHub-style heatmaps and streak monitoring in your personal Scholar Terminal.', 
                icon: TrendingUp,
                color: 'text-emerald-500'
              },
              { 
                title: 'Collaborative Boards', 
                desc: 'Real-time markdown workspace for shared notes, active recall questions, and collaborative project mapping.', 
                icon: MessageSquare,
                color: 'text-purple-500'
              },
              { 
                title: 'Encrypted Safe-Space', 
                desc: 'Privacy-first architecture ensuring your study data and hub chats remain between you and your roster.', 
                icon: Shield,
                color: 'text-rose-500'
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-card border border-border/40 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 space-y-6">
                <div className={`w-14 h-14 rounded-2xl bg-muted flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Workflow Section */}
        <section id="how-it-works" className="py-24 bg-card/30 border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-headline font-bold text-foreground tracking-tight">The Scholar Protocol</h2>
                <p className="text-muted-foreground text-lg">Three phases to transform your productivity cycle.</p>
              </div>

              <div className="space-y-8">
                {[
                  { 
                    step: '01', 
                    title: 'Establish Your Node', 
                    desc: 'Create a subject-specific Study Hub or join an existing roster with a unique 6-character invite code.' 
                  },
                  { 
                    step: '02', 
                    title: 'Sync Focus Cycles', 
                    desc: 'Launch a Pomodoro (25/5) or Custom timer. Everyone in the hub synchronizes to the same clock instantly.' 
                  },
                  { 
                    step: '03', 
                    title: 'Synthesize Intelligence', 
                    desc: 'Conclude your session and trigger an AI Intel Analysis to recap the entire hub discussion for later review.' 
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-none w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-headline font-bold text-xl">
                      {item.step}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
              <div className="relative rounded-[2.5rem] bg-background border border-border/50 p-2 overflow-hidden shadow-2xl">
                <Image 
                  src={getImage('focus-engine-preview')?.imageUrl || ''} 
                  alt="Focus Engine Workflow" 
                  width={800} 
                  height={600}
                  className="rounded-[2rem] opacity-90 transition-transform duration-700 group-hover:scale-[1.01]"
                  data-ai-hint="dashboard interface"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-muted-foreground/50 mb-12">Trusted by scholars at</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all">
             <div className="text-2xl font-bold italic tracking-tighter">STANFORD</div>
             <div className="text-2xl font-bold tracking-tight">MIT</div>
             <div className="text-2xl font-bold serif">HARVARD</div>
             <div className="text-2xl font-bold tracking-[0.2em]">OXFORD</div>
          </div>

          <div className="mt-32 max-w-3xl mx-auto">
            <div className="relative">
              <Sparkles className="absolute -top-8 -left-8 w-12 h-12 text-primary/20" />
              <p className="text-2xl md:text-4xl font-headline font-medium leading-relaxed italic text-foreground">
                "Nexus Study isn't just a timer; it's a cognitive force multiplier. The synchronized presence alone reduced my procrastination by 60% in one semester."
              </p>
              <div className="mt-8 flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full border-2 border-primary overflow-hidden">
                  <Image src="https://picsum.photos/seed/quote1/100/100" alt="Sarah J." width={56} height={56} />
                </div>
                <p className="font-bold">Dr. Marcus Vance</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Neuroscience Researcher</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-muted/20 border-t border-border/40">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-headline font-bold text-foreground">Frequently Asked Protocols</h2>
              <p className="text-muted-foreground">Everything you need to know about the Nexus network.</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {[
                { 
                  q: "How does the real-time synchronization work?", 
                  a: "We use high-frequency Firestore listeners that synchronize timer states, chat messages, and member presence in under 150ms globally." 
                },
                { 
                  q: "Is the AI recap feature secure?", 
                  a: "Yes. All analyses are performed in an isolated server context. Your data is not used to train global LLMs; it is processed once to generate your recap and then archived securely." 
                },
                { 
                  q: "What is the 6-character code for?", 
                  a: "Every Study Hub has a unique identifier. This code allows you to invite specific peers without needing public links, maintaining the privacy of your research node." 
                },
                { 
                  q: "Can I use Nexus Study for solo sessions?", 
                  a: "Absolutely. Our 'Solo Focus' launcher allows you to create private nodes where you can leverage the timer, AI recaps, and Scholar Terminal features individually." 
                }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border/40">
                  <AccordionTrigger className="text-left font-bold hover:text-primary transition-colors">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-4xl md:text-6xl font-headline font-bold text-foreground tracking-tight">
              Ready to Upgrade Your <span className="text-primary">Learning Flow?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Join thousands of scholars worldwide who are already using Nexus Study to master their crafts. Establish your first hub today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="h-16 px-10 text-xl gap-2 rounded-2xl shadow-2xl shadow-primary/20" asChild>
                <Link href="/register">Enter the Hub Now</Link>
              </Button>
              <p className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">No credit card required • Free forever for scholars</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-border/40 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-headline font-bold text-2xl">Nexus Study</span>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              The ultimate collaborative deep-work environment for modern students, researchers, and creators. Master your craft through collective focus.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer">
                <Globe className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer">
                <Zap className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Platform</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-primary transition-colors">Scholar Protocol</Link></li>
              <li><Link href="/guide" className="hover:text-primary transition-colors">Manual</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Scholar Terminal</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Mission</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Research</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground">
            © 2024 Nexus Study Platform. Designed for deep work and collective intelligence.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Shield className="w-3 h-3 text-emerald-500" /> System Status: All Nodes Operational
          </div>
        </div>
      </footer>
    </div>
  );
}
