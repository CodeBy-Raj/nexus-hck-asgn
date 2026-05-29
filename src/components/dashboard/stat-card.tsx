'use client';

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
  subValue?: string;
}

export function StatCard({ label, value, icon: Icon, trend, color, subValue }: StatCardProps) {
  return (
    <Card className="border-none bg-card/40 backdrop-blur-sm relative overflow-hidden group">
      <div className={cn("absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity", color?.replace('text-', 'bg-') || 'bg-primary')} />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2 rounded-lg bg-background/50", color || "text-primary")}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{label}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-bold tabular-nums">{value}</h3>
            {subValue && <span className="text-xs text-muted-foreground font-medium">{subValue}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
