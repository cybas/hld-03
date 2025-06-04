
'use client';

import { useState, useEffect, useRef } from 'react';
import type { Message } from '@/types';
import useLocalStorage from '@/hooks/use-local-storage';
import useChatScroll from '@/hooks/use-chat-scroll';
// Removed Genkit import: import { generateInitialResponse } from '@/ai/flows/generate-initial-response';
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
  const chatViewportRef = useChatScroll(messages);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
      setMessages(prev => [createInitialMessage(), ...prev.slice(1)]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (displayMode === 'page' || (displayMode === 'modal' && messages.length > 0)) {
      // Focus input when chat page loads or modal opens (and is not empty initially)
      // Use a timeout to ensure the input is rendered and visible
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [displayMode, messages.length]);


  const getPlaceholderResponse = (userText: string): string => {
    const lowerUserText = userText.toLowerCase();
    if (lowerUserText.includes("hair loss") || lowerUserText.includes("assessment")) {
      return "Hair loss can have many causes including genetics, hormones, stress, and nutrition. Tell me more about your specific situation. Please remember, this information is for educational purposes. Consider discussing with your healthcare provider or a dermatologist for personalized medical advice and diagnosis.";
    }
    if (lowerUserText.includes("treatment")) {
      return "Treatment options include lifestyle changes, topical treatments, medications, and procedures. What type of treatment interests you most? Please remember, this information is for educational purposes. Consider discussing with your healthcare provider or a dermatologist for personalized medical advice and diagnosis.";
    }
    if (lowerUserText.includes("diet") || lowerUserText.includes("nutrition")) {
      return "Diet plays a crucial role. For example, deficiencies in iron, vitamin D, zinc, or biotin can impact hair. We can discuss specific diets like vegan or keto too. Please remember, this information is for educational purposes. Consider discussing with your healthcare provider or a dermatologist for personalized medical advice and diagnosis.";
    }
    if (lowerUserText.includes("stress")) {
      return "Stress can indeed lead to hair loss, often called telogen effluvium. Managing stress is key. Please remember, this information is for educational purposes. Consider discussing with your healthcare provider or a dermatologist for personalized medical advice and diagnosis.";
    }
    if (lowerUserText.includes("hormones")) {
      return "Hormonal imbalances are a common factor. For men, DHT is often involved, while for women, thyroid issues or PCOS can play a role. Please remember, this information is for educational purposes. Consider discussing with your healthcare provider or a dermatologist for personalized medical advice and diagnosis.";
    }
     if (lowerUserText.includes("blood test")) {
      return "Comprehensive blood tests can help identify underlying issues contributing to hair loss. These might include tests for nutrient deficiencies, hormone levels, and thyroid function. Please remember, this information is for educational purposes. Consider discussing with your healthcare provider or a dermatologist for personalized medical advice and diagnosis.";
    }
    return "I'm here to help with hair loss questions. Could you tell me more about what you'd like to know? Please remember, this information is for educational purposes. Consider discussing with your healthcare provider or a dermatologist for personalized medical advice and diagnosis.";
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    // Simulate AI thinking time and provide placeholder response
    setTimeout(() => {
      const aiResponseText = getPlaceholderResponse(text);
      const aiMessage: Message = {
        id: `${Date.now().toString()}-ai-placeholder`,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setIsLoading(false);
      // Re-focus input after AI responds
      setTimeout(() => inputRef.current?.focus(), 0);
    }, 1000 + Math.random() * 1000); // Simulate 1-2 second delay
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

      <ScrollArea viewportRef={chatViewportRef} className="flex-grow p-4 lg:p-6 space-y-4 chat-scroll-area">
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
                onClick={() => {
                  handleSendMessage(starter);
                   setTimeout(() => inputRef.current?.focus(), 0);
                }}
              >
                {starter}
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} inputRef={inputRef} />
    </div>
  );
}
