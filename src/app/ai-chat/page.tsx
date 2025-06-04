
'use client';

import { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/chat/chat-interface';
import type { Message } from '@/types';

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    document.title = 'AI Chat - HairlossDoctor.AI';
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-page-gradient-from to-page-gradient-to p-4 selection:bg-primary/20 selection:text-primary">
      {/* The ChatInterface will contain the floating glass card when messages are empty */}
      <ChatInterface
        displayMode="page"
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}
