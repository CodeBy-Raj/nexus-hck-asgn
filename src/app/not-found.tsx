
import { Button } from '@/components/ui/button';
import { BrainCircuit, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
      
      <div className="relative z-10 max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-700">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-card border border-white/5 flex items-center justify-center relative overflow-hidden group">
            <Search className="w-12 h-12 text-muted-foreground/20 absolute transition-transform group-hover:scale-150" />
            <BrainCircuit className="w-10 h-10 text-primary relative z-10" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">404: Node Missing</h1>
          <p className="text-muted-foreground max-w-[280px] mx-auto text-sm">
            This workspace coordinate does not exist in the Nexus archive.
          </p>
        </div>

        <Button asChild className="w-full gap-2 rounded-xl h-12 shadow-lg shadow-primary/20">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4" /> Back to Terminal
          </Link>
        </Button>
      </div>
    </div>
  );
}
