
'use client';

import { useState, useEffect } from 'react';
import { useSidebar } from '@/components/ui/sidebar';

export function useFocusMode() {
  const [isFocused, setIsFocused] = useState(false);
  const { setOpen } = useSidebar();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFocus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  const toggleFocus = () => {
    const nextState = !isFocused;
    setIsFocused(nextState);
    if (nextState) {
      setOpen(false); // Collapse sidebar
    } else {
      setOpen(true); // Restore sidebar
    }
  };

  return { isFocused, toggleFocus };
}
