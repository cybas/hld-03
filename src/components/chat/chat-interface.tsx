
'use client';

import { useState, useEffect } from 'react';
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
import { ArrowLeft, MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const CHAT_STORAGE_KEY = 'hairlossdoctor-ai-chat-messages';
const INITIAL_AI_MESSAGE_TEXT = "I'm a specialized AI assistant designed for hair loss assessment and guidance. I've been trained on comprehensive medical literature covering diet, hormones, medications, lifestyle factors, and treatment protocols. I can help you understand your hair loss and explore evidence-based solutions. What would you like to know?";

const CONVERSATION_STARTERS = [
  "What type of hair loss do I have?",
  "Tell me about treatment options",
  "Should I get blood tests?",
  "Start hair loss assessment"
];

interface ChatInterfaceProps {
  displayMode?: 'page' | 'modal';
  onClose?: () => void;
}

export function ChatInterface({ displayMode = 'page', onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useLocalStorage<Message[]>(CHAT_STORAGE_KEY, []);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useChatScroll(messages);

  const createInitialMessage = (): Message => ({
    id: 'initial-ai-message',
    text: INITIAL_AI_MESSAGE_TEXT,
    sender: 'ai',
    timestamp: new Date(),
  });

  useEffect(() => {
    if (messages.length === 0 || (messages.length === 1 && messages[0].id !== 'initial-ai-message')) {
      setMessages([createInitialMessage()]);
    } else if (messages.length > 0 && messages[0].text !== INITIAL_AI_MESSAGE_TEXT && messages[0].id === 'initial-ai-message') {
      // If the initial message text has changed, update it
      setMessages(prev => [createInitialMessage(), ...prev.slice(1)]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

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

  const showConversationStarters = messages.length === 1 && messages[0].id === 'initial-ai-message';

  return (
    <div className={cn("flex flex-col h-full bg-background", displayMode === 'modal' ? 'rounded-lg' : '')}>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-primary text-primary-foreground p-4 backdrop-blur-sm">
        {displayMode === 'page' ? (
          <Button variant="ghost" size="icon" asChild className="hover:bg-primary/80">
            <Link href="/" aria-label="Back to homepage">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chat" className="hover:bg-primary/80">
            <X className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center">
          <h1 className="text-lg font-semibold">HairlossDoctor.AI Assistant</h1>
          <span className="ml-2 h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" title="Online"></span>
        </div>
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
          </div>
        )}
         {isLoading && <div className="pl-12 -mt-8"><TypingIndicator /></div>}
        
        {showConversationStarters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 px-2">
            {CONVERSATION_STARTERS.map((starter) => (
              <Button 
                key={starter} 
                variant="outline" 
                size="sm"
                className="text-left justify-start h-auto py-2"
                onClick={() => handleSendMessage(starter)}
              >
                {starter}
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
