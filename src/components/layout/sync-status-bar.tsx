"use client";

import { useState, useEffect } from "react";
import { useFirestore } from "@/firebase";
import { onSnapshotsInSync } from "firebase/firestore";
import { WifiOff, Wifi, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SyncStatusBar() {
  const db = useFirestore();
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let hideTimer: NodeJS.Timeout;
    let isCurrentlySyncing = false;

    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    const unsubscribe = onSnapshotsInSync(db, () => {
      if (!isCurrentlySyncing) {
        isCurrentlySyncing = true;
        setIsSyncing(true);
      }

      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        isCurrentlySyncing = false;
        setIsSyncing(false);
      }, 1500);
    });

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      unsubscribe();
      clearTimeout(hideTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            Sync Interrupted — Re-establishing Connection...
          </div>
        </motion.div>
      )}

      {isOnline && isSyncing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-[100]"
        >
          <div className="bg-primary/20 backdrop-blur-md text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-primary/20">
            <Loader2 className="w-3 h-3 animate-spin" />
            Nexus Sync
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
