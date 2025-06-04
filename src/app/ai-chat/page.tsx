
'use client'; // Required because we are using useState

import type { Metadata } from 'next';
import { useState } from 'react';
import { ChatInterface } from '@/components/chat/chat-interface';
import type { Message } from '@/types';

// Metadata can be defined statically if not dependent on component state
// export const metadata: Metadata = { // This would require moving metadata to a layout or keeping this a server component
//   title: 'AI Chat - HairlossDoctor.AI',
//   description: 'Engage with the HairlossDoctor.AI assistant.',
// };

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  // Set document title dynamically if needed, as metadata object is static
  useEffect(() => {
    document.title = 'AI Chat - HairlossDoctor.AI';
  }, []);


  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ChatInterface 
        displayMode="page" 
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}

// To use static metadata, this component would need to be a Server Component,
// or metadata would be defined in a parent Server Component / layout.
// For simplicity with useState, we've made it a client component and can set title with useEffect.
// If SEO is critical for this page and metadata needs to be static,
// further refactoring of state management might be needed, or ChatInterface
// could be wrapped.
import { useEffect } from 'react'; // ensure useEffect is imported

    