
'use client';

import { useState, useEffect, useRef } from 'react';
import type { Message } from '@/types';
import useChatScroll from '@/hooks/use-chat-scroll';
import { MessageBubble } from './message-bubble';
import { ChatInput } from './chat-input';
import { TypingIndicator } from './typing-indicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatAIResponse } from '@/utils/responseFormatter';

// SVG Icons for Action Cards
const MicroscopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 mb-3 text-primary transition-transform duration-300 group-hover:scale-110">
    <path d="M18.09 17.322a1.502 1.502 0 0 0 .007-2.122 1.502 1.502 0 0 0-2.122-.007l-2.834 2.834-.159-.159a4.5 4.5 0 1 0-6.364 6.364l.159.159-2.834 2.834a1.5 1.5 0 0 0 2.122 2.122l2.834-2.834.159.159a4.5 4.5 0 0 0 6.364 0l3.516-3.516Zm-5.537 1.925a2.999 2.999 0 1 1 4.241-4.241 2.999 2.999 0 0 1-4.241 4.241Z" /><path d="m14.084 5.723-1.06 1.06a.75.75 0 0 1-1.06 0l-1.062-1.06A3.001 3.001 0 0 0 7.73 4.086a3.001 3.001 0 0 0-1.637 3.167l-.004.028c.693 3.458 3.935 5.914 3.935 5.914s.316.318.316.318a.753.753 0 0 0 1.06-.002l.303-.303s3.215-2.434 3.922-5.924a3.001 3.001 0 0 0-1.54-3.528Z" />
  </svg>
);

const MedicalIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 mb-3 text-secondary transition-transform duration-300 group-hover:scale-110">
    <path fillRule="evenodd" d="M9.34 2.117A4.5 4.5 0 0 0 6.22 4.3l-1.94-.484A1.5 1.5 0 0 0 3 5.286V10.5a.75.75 0 0 0 .75.75h6a.75.75 0 0 0 .75-.75V5.286a1.5 1.5 0 0 0-1.28-.97l-1.94.484A4.503 4.503 0 0 0 9.34 2.117ZM7.5 6a.75.75 0 0 0-.75.75v.75a.75.75 0 0 0 .75.75h3a.75.75 0 0 0 .75-.75V6.75a.75.75 0 0 0-.75-.75h-3Z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12.75 12.75a.75.75 0 0 0-.75-.75h-9a.75.75 0 0 0-.75.75v6a.75.75 0 0 0 .75.75h9a.75.75 0 0 0 .75-.75v-6Zm-1.5 1.5a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-6a.75.75 0 0 1-.75-.75v-.75a.75.75 0 0 1 .75-.75h6Z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M15.75 2.25a.75.75 0 0 1 .75.75v17.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM20.25 6a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-1.5 0V6.75a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

const TestTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 mb-3 text-red-500 transition-transform duration-300 group-hover:scale-110">
    <path fillRule="evenodd" d="M10.763 3.06a3.75 3.75 0 0 1 2.474 0l4.494 2.247a3.75 3.75 0 0 1 2.244 3.413l.313 6.714a3.75 3.75 0 0 1-3.545 3.816a.75.75 0 0 0-.66.748l-.028.17a1.5 1.5 0 0 1-2.918.046l-.028-.17a.75.75 0 0 0-.66-.748A3.75 3.75 0 0 1 8.87 15.434l.314-6.714a3.75 3.75 0 0 1 2.243-3.413l4.494-2.247Zm0 0a3.75 3.75 0 0 1 2.474 0l4.494 2.247a3.75 3.75 0 0 1 2.244 3.413l.313 6.714a3.75 3.75 0 0 1-3.545 3.816.75.75 0 0 0-.66.748l-.028.17a1.5 1.5 0 0 1-2.918.046l-.028-.17a.75.75 0 0 0-.66-.748A3.75 3.75 0 0 1 8.87 15.434l.314-6.714a3.75 3.75 0 0 1 1.575-3.123V3.75A3.75 3.75 0 0 1 8.5 2.25a.75.75 0 0 0 0 1.5c0 .348.046.684.133 1.002L10.763 3.06Z" clipRule="evenodd" />
    <path d="M12 11.25a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM11.25 15a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM12.75 16.5a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 mb-3 text-violet-500 transition-transform duration-300 group-hover:scale-110">
    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a.375.375 0 0 1-.375-.375V6.375A3.75 3.75 0 0 0 10.5 2.625H5.625Z" />
    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-3.204-2.295.75.75 0 0 0-.503.052l-3.278 1.639a.75.75 0 0 1-.94-.677l.087-2.685Zm0 0c.234.04.462.096.682.171a.75.75 0 0 1 .141.868l-.87 2.609a.75.75 0 0 1-.94-.677l.087-2.685A5.23 5.23 0 0 1 12.971 1.816Z" />
  </svg>
);


const actionCards = [
  {
    icon: <MicroscopeIcon />,
    title: 'Assess Hair Loss Pattern',
    description: 'Get AI analysis of your condition',
    action: 'What type of hair loss do I have?',
  },
  {
    icon: <MedicalIcon />,
    title: 'Explore Treatment Options',
    description: 'Discover personalized solutions',
    action: 'Tell me about treatment options',
  },
  {
    icon: <TestTubeIcon />,
    title: 'Should I Get Blood Tests?',
    description: 'Learn about diagnostic testing',
    action: 'Should I get blood tests?',
  },
  {
    icon: <ClipboardIcon />,
    title: 'Start Complete Assessment',
    description: 'Full 4-step hair loss evaluation',
    action: 'Start hair loss assessment', 
  },
];

interface ChatInterfaceProps {
  displayMode?: 'page' | 'modal';
  onClose?: () => void;
  messages: Message[];
  setMessages: (value: Message[] | ((val: Message[]) => Message[])) => void;
}


export function ChatInterface({ displayMode = 'page', onClose, messages, setMessages }: ChatInterfaceProps) {
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

  const prepareAgentContext = (messages: Message[]) => {
    return messages[messages.length - 1]?.text || '';
  };

  const handleSendMessage = async (text: string) => {
    if (text.trim() === 'Start hair loss assessment') {
        window.location.href = '/assessment/step1';
        return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const context = prepareAgentContext([...messages, userMessage]);
      const response = await fetch('/api/bedrock-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: context }), 
      });

      if (response.ok) {
        const data = await response.json();
        const cleanResponse = formatAIResponse(data.response);
        const aiMessage: Message = { id: `${Date.now()}-ai`, text: cleanResponse, sender: 'ai', timestamp: new Date() };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        throw new Error(`API call failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackResponse = getPlaceholderResponse(text);
      const cleanFallbackResponse = formatAIResponse(fallbackResponse);
      const aiMessage: Message = { id: `${Date.now()}-fallback`, text: cleanFallbackResponse, sender: 'ai', timestamp: new Date() };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const showWelcomeScreen = messages.length === 0;

  if (showWelcomeScreen && displayMode === 'page') {
    return (
      <div className="bg-glass-card-bg backdrop-blur-xl border border-glass-card-border shadow-glass-card rounded-3xl max-w-3xl w-full mx-auto p-8 sm:p-12 my-auto flex flex-col">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tighter leading-extra-tight bg-gradient-to-r from-welcome-gradient-from to-welcome-gradient-to bg-clip-text text-transparent mb-2 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
            Hey there! 👋
          </h1>
          <p className="text-22px text-primary/80 font-medium mt-4">
            What can I help you with?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-5 mb-8">
          {actionCards.map((card) => (
            <button
              key={card.title}
              onClick={() => {
                 if (card.action === 'Start hair loss assessment') {
                  window.location.href = '/assessment/step1';
                } else {
                  handleSendMessage(card.action);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }
              }}
              className="bg-white/80 border border-primary/10 hover:border-primary/20 rounded-2xl p-6 shadow-action-card-premium hover:shadow-action-card-premium-hover hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-premium-ease flex flex-col items-start text-left group active:scale-[0.98]"
            >
              {card.icon}
              <h3 className="text-lg font-semibold text-foreground mb-1">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
            </button>
          ))}
        </div>
        <div className="mt-auto bg-glass-input-bg rounded-2xl shadow-input-premium p-1.5">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} inputRef={inputRef} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
        "flex flex-col h-full w-full",
        displayMode === 'modal' ? 'rounded-xl overflow-hidden bg-background shadow-2xl border border-border' : 'bg-transparent'
    )}>
      <header className={cn(
        "sticky top-0 z-10 flex items-center justify-between p-4 shadow-md border-b backdrop-blur-sm",
        displayMode === 'modal' ? "bg-gradient-to-br from-primary to-primary-dark text-primary-foreground border-primary-dark/50" : "bg-background/80 border-border text-foreground"
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

      <ScrollArea viewportRef={chatViewportRef} className="flex-grow p-4 md:p-6 space-y-3 md:space-y-4 chat-scroll-area bg-transparent">
        {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
        {isLoading && (
          <div className="flex justify-start">
             <MessageBubble message={{id: 'typing', text: '', sender: 'ai', timestamp: new Date()}} />
          </div>
        )}
         {isLoading && <div className="pl-12 -mt-8"><TypingIndicator /></div>}
      </ScrollArea>

       <div className={cn(
         "p-2 md:p-3 border-t sticky bottom-0",
         displayMode === 'modal' ? "bg-background rounded-b-xl border-gray-200" : "bg-background/80 backdrop-blur-md rounded-t-xl"
         )}>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} inputRef={inputRef} />
      </div>
    </div>
  );
}
