
'use client';

import type { Metadata } from 'next'; // Keep for potential dynamic title setting
import { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/chat/chat-interface';
import type { Message } from '@/types';

// Metadata for static export or if needed (dynamic title set via useEffect)
// export const metadata: Metadata = {
//   title: 'AI Chat - HairlossDoctor.AI',
//   description: 'Engage with the HairlossDoctor.AI assistant for a premium experience.',
// };

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    document.title = 'AI Chat - HairlossDoctor.AI';
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-page-gradient-from to-page-gradient-to p-4 selection:bg-primary/20 selection:text-primary">
      {/* The ChatInterface will contain the floating glass card when messages are empty */}
      <ChatInterface
        displayMode="page"
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}
