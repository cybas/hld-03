'use client';

import { useState, useEffect }_from_ 'react';
import type { Message } from '@/types';
import useLocalStorage from '@/hooks/use-local-storage';
import useChatScroll from '@/hooks/use-chat-scroll';
import { generateInitialResponse } from '@/ai/flows/generate-initial-response';
import { MessageBubble } from './message-bubble';
import { ChatInput } from './chat-input';
import { TypingIndicator } from './typing-indicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, MessageSquare } from 'lucide-react';

const CHAT_STORAGE_KEY = 'hairlossdoctor-ai-chat-messages';
const INITIAL_AI_MESSAGE: Message = {
  id: 'initial-ai-message',
  text: "I'm a specialized AI for hair loss assessment. I can help you understand hair loss patterns, contributing factors, and treatment options. What would you like to know?",
  sender: 'ai',
  timestamp: new Date(),
};

export function ChatInterface() {
  const [messages, setMessages] = useLocalStorage<Message[]>(CHAT_STORAGE_KEY, []);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useChatScroll(messages);

  useEffect(() => {
    // Add initial AI message if chat is empty
    if (messages.length === 0) {
      setMessages([INITIAL_AI_MESSAGE]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount if messages is empty

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await generateInitialResponse({ question: text });
      const aiMessage: Message = {
        id: `${Date.now().toString()}-ai`,
        text: aiResponse.response,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = {
        id: `${Date.now().toString()}-error`,
        text: "Sorry, I encountered an issue processing your request. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 p-4 backdrop-blur-sm">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/" aria-label="Back to homepage">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold text-foreground">HairlossDoctor.AI Chat</h1>
        <div className="w-8"> {/* Placeholder for right alignment */} </div>
      </header>

      <ScrollArea ref={chatContainerRef} className="flex-grow p-4 lg:p-6 space-y-4 chat-scroll-area">
        {messages.length > 0 ? (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="w-16 h-16 mb-4" />
            <p className="text-lg">No messages yet.</p>
            <p>Start by asking a question below.</p>
          </div>
        )}
        {isLoading && (
          <div className="flex justify-start">
             <MessageBubble message={{id: 'typing', text: '', sender: 'ai', timestamp: new Date()}} />
             {/* The MessageBubble for typing is a hack to show avatar. Actual typing dots are below. */}
          </div>
        )}
         {isLoading && <div className="pl-12 -mt-8"><TypingIndicator /></div>}
      </ScrollArea>
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
