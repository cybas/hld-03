
'use client';

import { useState, useEffect, useRef } from 'react';
import type { Message } from '@/types';
import useLocalStorage from '@/hooks/use-local-storage';
import useChatScroll from '@/hooks/use-chat-scroll';
import { MessageBubble } from './message-bubble';
import { ChatInput } from './chat-input';
import { TypingIndicator } from './typing-indicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const CHAT_STORAGE_KEY = 'hairlossdoctor-ai-chat-messages';

const actionCards = [
  {
    emoji: '🔬',
    title: 'Assess Hair Loss Pattern',
    description: 'Get AI analysis of your condition',
    action: 'What type of hair loss do I have?',
  },
  {
    emoji: '💊',
    title: 'Explore Treatment Options',
    description: 'Discover personalized solutions',
    action: 'Tell me about treatment options',
  },
  {
    emoji: '🩸',
    title: 'Should I Get Blood Tests?',
    description: 'Learn about diagnostic testing',
    action: 'Should I get blood tests?',
  },
  {
    emoji: '📋',
    title: 'Start Complete Assessment',
    description: 'Full 4-step hair loss evaluation',
    action: 'Start hair loss assessment',
  },
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

  useEffect(() => {
    if (displayMode === 'page' || (displayMode === 'modal' && messages.length > 0)) {
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
      setTimeout(() => inputRef.current?.focus(), 0);
    }, 1000 + Math.random() * 1000);
  };
  
  const showWelcomeScreen = messages.length === 0;

  return (
    <div className={cn("flex flex-col h-full", 
                       displayMode === 'modal' ? 'rounded-xl overflow-hidden bg-background' : 'h-screen'
    )}>
      <header className={cn(
        "sticky top-0 z-10 flex items-center justify-between p-4 shadow-md border-b backdrop-blur-sm",
        displayMode === 'modal' ? "bg-gradient-to-br from-primary to-primary-dark text-primary-foreground border-primary-dark/50" : "bg-transparent border-transparent text-foreground"
      )}>
        {displayMode === 'page' ? (
          <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 rounded-full">
            <Link href="/" aria-label="Back to homepage">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chat" className="hover:bg-primary/80 rounded-full text-primary-foreground">
            <X className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center">
          <h1 className={cn("text-lg font-semibold", displayMode === 'modal' ? 'text-white' : 'text-foreground')}>HairlossDoctor.AI Assistant</h1>
          <span className={cn("ml-2 h-2.5 w-2.5 rounded-full bg-green-400", displayMode === 'modal' && 'animate-subtle-glow-pulse')} title="Online"></span>
        </div>
        <div className="w-8"> {/* Placeholder for right alignment */} </div>
      </header>

      {showWelcomeScreen && displayMode === 'page' ? (
        <main className="flex-grow flex flex-col items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-welcome-card p-10 text-center mb-8">
            <h1 className="text-4xl font-semibold bg-gradient-to-r from-welcome-gradient-from to-welcome-gradient-to bg-clip-text text-transparent mb-3 tracking-tight leading-tight">
              Hey there! 👋
            </h1>
            <p className="text-2xl font-semibold bg-gradient-to-r from-welcome-gradient-from to-welcome-gradient-to bg-clip-text text-transparent tracking-tight leading-tight">
              What can I help you with?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
            {actionCards.map((card) => (
              <button
                key={card.title}
                onClick={() => {
                  handleSendMessage(card.action);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
                className="bg-white rounded-xl p-5 text-left shadow-action-card hover:shadow-action-card-hover hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">{card.emoji}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{card.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
           <div className="w-full max-w-2xl mt-auto sticky bottom-0 pb-4">
            <div className="bg-white rounded-2xl shadow-xl p-1 md:p-2">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} inputRef={inputRef} />
            </div>
          </div>
        </main>
      ) : (
        <ScrollArea viewportRef={chatViewportRef} className="flex-grow p-6 space-y-3 chat-scroll-area bg-transparent">
          {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
          {isLoading && (
            <div className="flex justify-start">
               <MessageBubble message={{id: 'typing', text: '', sender: 'ai', timestamp: new Date()}} />
            </div>
          )}
           {isLoading && <div className="pl-12 -mt-8"><TypingIndicator /></div>}
        </ScrollArea>
      )}
      
      {!showWelcomeScreen && displayMode === 'page' && (
         <div className="bg-white rounded-t-2xl shadow-xl p-1 md:p-2 border-t border-gray-200">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} inputRef={inputRef} />
        </div>
      )}

      {displayMode === 'modal' && (
         <div className="bg-white rounded-b-xl p-1 md:p-2 border-t border-gray-200">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} inputRef={inputRef} />
        </div>
      )}
    </div>
  );
}
