
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChatInterface } from './chat-interface';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Close chat modal on route change, except if navigating to /chat itself (handled by hiding this button)
    if (pathname !== '/chat') {
      setIsChatOpen(false);
    }
  }, [pathname]);

  if (pathname === '/chat') {
    return null; // Don't render button on the main chat page
  }

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className={cn(
          "fixed bottom-5 right-5 h-14 w-14 rounded-full shadow-xl z-40 bg-primary hover:bg-primary/90 transition-transform duration-200 ease-out",
          isChatOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
        onClick={() => setIsChatOpen(true)}
        aria-label="Open chat"
      >
        <MessageCircle className="h-7 w-7 text-primary-foreground" />
        {/* Simple notification badge - can be enhanced later */}
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent border-2 border-primary animate-pulse"></span>
      </Button>

      {isChatOpen && (
        <div className="fixed bottom-5 right-5 w-[calc(100vw-40px)] max-w-md h-[calc(100vh-90px)] sm:h-[70vh] max-h-[600px] bg-background shadow-2xl rounded-xl flex flex-col z-50 border border-border overflow-hidden">
          <ChatInterface displayMode="modal" onClose={() => setIsChatOpen(false)} />
        </div>
      )}
    </>
  );
}
