
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TimerWheelProps {
  remainingSeconds: number;
  totalSeconds: number;
  isActive: boolean;
  phase?: 'FOCUS' | 'BREAK';
}

export function TimerWheel({ remainingSeconds, totalSeconds, isActive, phase = 'FOCUS' }: TimerWheelProps) {
  const [offset, setOffset] = useState(0);
  const size = 280; // Reduced base size for better fit
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
    setOffset(circumference - progress * circumference);
  }, [remainingSeconds, totalSeconds, circumference]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const colorClass = phase === 'BREAK' ? "text-emerald-400" : "text-primary";
  const glowClass = phase === 'BREAK' ? "bg-emerald-400/5" : "bg-primary/5";

  return (
    <div className="relative flex items-center justify-center select-none transition-all duration-700 max-w-full aspect-square">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 w-full max-w-[280px] h-auto">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/5"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-1000 ease-linear",
            colorClass,
            isActive && "animate-pulse"
          )}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-mono text-5xl sm:text-6xl font-bold tracking-tighter tabular-nums">
          {formatTime(remainingSeconds)}
        </div>
        <div className={cn(
          "text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold mt-2 text-center px-4",
          phase === 'BREAK' ? "text-emerald-400" : "text-muted-foreground"
        )}>
          {isActive ? (phase === 'BREAK' ? 'Breather Mode' : 'Deep Work') : 'Ready to focus'}
        </div>
      </div>

      {isActive && (
        <div className={cn("absolute inset-0 rounded-full blur-3xl -z-10 animate-pulse", glowClass)} />
      )}
    </div>
  );
}
