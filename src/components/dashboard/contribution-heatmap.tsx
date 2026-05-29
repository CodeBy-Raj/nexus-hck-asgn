'use client';

import { useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, subWeeks, isSameDay } from 'date-fns';

interface HeatmapGridProps {
  sessions: { date: Date; minutes: number }[];
}

export function ContributionHeatmap({ sessions }: HeatmapGridProps) {
  const weeks = 12;
  const daysInWeek = 7;
  
  const gridData = useMemo(() => {
    const today = new Date();
    const startDate = startOfWeek(subWeeks(today, weeks - 1));
    
    return Array.from({ length: weeks }).map((_, wIndex) => {
      return Array.from({ length: daysInWeek }).map((_, dIndex) => {
        const date = addDays(startDate, wIndex * 7 + dIndex);
        const daySessions = sessions.filter(s => isSameDay(s.date, date));
        const totalMinutes = daySessions.reduce((acc, curr) => acc + curr.minutes, 0);
        
        return { date, totalMinutes };
      });
    });
  }, [sessions]);

  const getIntensity = (mins: number) => {
    if (mins === 0) return 'bg-white/[0.02] border-white/[0.02]';
    if (mins < 30) return 'bg-blue-900/30 border-blue-800/20'; // Deep room base
    if (mins < 60) return 'bg-blue-600/50 border-blue-500/30';
    if (mins < 120) return 'bg-blue-400/80 border-blue-300/40 shadow-[0_0_10px_rgba(96,165,250,0.3)]';
    return 'bg-blue-300 border-blue-100 shadow-[0_0_15px_rgba(191,219,254,0.6)]'; // Bright electric blue
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
        <span>Focus Intensity</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 30, 60, 120, 200].map(m => (
              <div key={m} className={cn("w-2.5 h-2.5 rounded-[2px]", getIntensity(m))} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <TooltipProvider>
          {gridData.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1.5 shrink-0">
              {week.map((day, dIndex) => (
                <Tooltip key={dIndex}>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "w-4 h-4 rounded-sm border transition-all duration-300 hover:scale-125 cursor-crosshair",
                      getIntensity(day.totalMinutes)
                    )} />
                  </TooltipTrigger>
                  <TooltipContent className="bg-background/95 backdrop-blur-md border-white/10 z-50">
                    <p className="text-[10px] font-bold uppercase">{format(day.date, 'MMM dd, yyyy')}</p>
                    <p className="text-xs">{day.totalMinutes} focus minutes</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
