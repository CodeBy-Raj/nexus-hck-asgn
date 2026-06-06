'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface LimelightNavProps {
  items: NavItem[];
  className?: string;
}

export function LimelightNav({ items, className }: LimelightNavProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const currentActive = items.findIndex((item) => item.isActive);
    if (currentActive !== -1) {
      setActiveIndex(currentActive);
    }
  }, [items]);

  return (
    <div className={cn("fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-fit", className)}>
      <nav className="relative flex items-center gap-1 p-2 bg-card/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        {/* The Limelight Effect */}
        <AnimatePresence>
          <motion.div
            layoutId="limelight"
            className="absolute top-0 bottom-0 z-0 bg-primary/10 rounded-xl"
            initial={false}
            animate={{
              left: activeIndex * 60 + 8, // Estimated width of items
              width: 52,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent blur-sm" />
          </motion.div>
        </AnimatePresence>

        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <button
              onClick={() => {
                setActiveIndex(index);
                item.onClick?.();
              }}
              className={cn(
                "relative z-10 flex flex-col items-center justify-center w-[52px] h-[52px] rounded-xl transition-colors duration-300",
                index === activeIndex ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="scale-110">
                {React.cloneElement(item.icon as React.ReactElement, {
                  className: cn("w-5 h-5", index === activeIndex ? "stroke-[2.5px]" : "stroke-2")
                })}
              </div>
              <span className="sr-only">{item.label}</span>
            </button>

            {/* Hover Label */}
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full mt-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-popover border border-white/10 shadow-xl pointer-events-none z-50 whitespace-nowrap"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                    {item.label}
                  </p>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-t border-l border-white/10 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>
    </div>
  );
}
