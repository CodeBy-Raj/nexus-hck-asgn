
'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SyncStatusBar() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-2"
        >
          <div className="bg-destructive text-destructive-foreground px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xl border border-white/10">
            <WifiOff className="w-3.5 h-3.5" />
            Nexus Sync Interrupted — Check Connection
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
