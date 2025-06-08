
'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message } from '@/types';
import { 
  Mic, 
  Paperclip, 
  SendHorizontal, 
  Search, 
  Lightbulb,
  ListOrdered,    
  Archive,       
  CalendarDays,
  NotebookText,  
  MessageCircleQuestion, 
  History,
  ShieldCheck // Added ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useChatScroll from '@/hooks/use-chat-scroll';
import { MessageBubble } from '@/components/chat/message-bubble';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { formatAIResponse } from '@/utils/responseFormatter';

// Custom SVG Icon for the header
const AiTrichologistIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6A4BF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8"/>
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <path d="M12 12h.01M16 12h.01M8 12h.01M12 16h.01M16 16h.01M8 16h.01"/>
    <path d="M9 20v-2h6v2"/>
    <circle cx="9" cy="10" r="0.5" fill="#6A4BF6"/>
    <circle cx="15" cy="10" r="0.5" fill="#6A4BF6"/>
    <path d="M12 6.5V9.5M10.5 8H13.5"/>
  </svg>
);

const HairFollicleBgIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 text-gray-500 opacity-[0.03] -z-10 pointer-events-none">
    <path d="M12 2C9.23858 2 7 4.23858 7 7V13C7 14.1046 7.89543 15 9 15H15C16.1046 15 17 14.1046 17 13V7C17 4.23858 14.7614 2 12 2Z" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 15V20C10 21.1046 10.8954 22 12 22C13.1046 22 14 21.1046 14 20V15" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="9" r="2" stroke="currentColor" strokeWidth="0.5"/>
  </svg>
);


interface FeatureChip {
  id: string;
  icon: React.ElementType;
  text: string;
  color: string; 
  actionType: 'link' | 'chat';
  actionValue: string; 
}

const featureChipsData: FeatureChip[] = [
  { id: 'plans', icon: ListOrdered, text: 'Treatment Plans', color: '#F6A34B', actionType: 'chat', actionValue: 'Tell me about common treatment plans for hair loss.' },
  { id: 'finder', icon: Archive, text: 'Product Finder', color: '#F56C6C', actionType: 'chat', actionValue: 'Help me find products for my hair type.' },
  { id: 'consult', icon: CalendarDays, text: 'Book Consultation', color: '#F6C14B', actionType: 'chat', actionValue: 'How can I book a consultation?' },
  { id: 'ingredient', icon: NotebookText, text: 'Ingredient Checker', color: '#F64BC1', actionType: 'chat', actionValue: 'Can you help me check some hair product ingredients?' },
  { id: 'tips', icon: Lightbulb, text: 'Hair-Care Tips', color: '#4BB7F6', actionType: 'chat', actionValue: 'Give me some general hair care tips.' },
  { id: 'history', icon: History, text: 'Diagnosis History', color: '#9A6AF6', actionType: 'chat', actionValue: 'Where can I find my diagnosis history?' },
  { id: 'faq', icon: MessageCircleQuestion, text: 'FAQs', color: '#F6B94B', actionType: 'chat', actionValue: 'What are some frequently asked questions about hair loss?' },
  { id: 'scalp-care', icon: ShieldCheck, text: 'Scalp Care Guide', color: '#4BE0A0', actionType: 'chat', actionValue: 'Tell me about scalp care routines.' },
];

const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
    console.warn(`Invalid hex color: ${hex}. Using default fallback.`);
    return `rgba(106,75,246,${alpha})`; // Default to primary accent with alpha
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    console.warn(`Error parsing hex color: ${hex}. Using default fallback.`);
    return `rgba(106,75,246,${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function InstaAIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInputValue, setChatInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);

  const chatViewportRef = useChatScroll(messages);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isChatActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatActive]);
  
  useEffect(() => {
    document.title = 'Chat with HairlossDoctor.AI';
  }, []);

  const handleSendMessage = async (text: string, fromQuickActionOrChip = false) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    if (!fromQuickActionOrChip) {
      setChatInputValue('');
    }
    setIsLoading(true);
    if (!isChatActive) setIsChatActive(true);

    try {
      const response = await fetch('/api/bedrock-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context: { currentStep: 'insta-ai-chat' } }),
      });

      if (response.ok) {
        const data = await response.json();
        const cleanResponse = formatAIResponse(data.response);
        const aiMessage: Message = {
          id: `${Date.now()}-ai`,
          text: cleanResponse,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorData = await response.text();
        console.error('API Error response:', errorData);
        setMessages((prev) => [...prev, { id: `${Date.now()}-error`, text: 'Sorry, I encountered an issue. Please try again.', sender: 'ai', timestamp: new Date() }]);
      }
    } catch (error) {
      console.error('Chat fetch error:', error);
      setMessages((prev) => [...prev, { id: `${Date.now()}-catch-error`, text: 'An error occurred. Please check your connection or try again.', sender: 'ai', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(chatInputValue);
  };
  
  const handleChipClick = (chip: FeatureChip) => {
    if (chip.actionType === 'chat') {
      handleSendMessage(chip.actionValue, true);
    }
  };

  const chipBaseClasses = "h-11 w-full rounded-full text-sm font-medium flex items-center justify-center gap-2 px-3 border transition-all duration-150 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring hover:scale-105";
  const chipDisabledClasses = "opacity-70 cursor-not-allowed pointer-events-none";

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[radial-gradient(ellipse_120%_90%_at_50%_0%,_white_0%,_rgba(250,250,255,0.7)_100%)] p-4 sm:p-6 font-body">
      <div className={cn("flex flex-col w-full transition-all duration-300 ease-out", isChatActive ? "max-w-screen-md" : "max-w-screen-md items-center text-center sm:space-y-10 space-y-8 pt-8 sm:pt-12")}>
        
        <header className={cn("relative flex flex-col items-center gap-3", isChatActive ? "py-4 border-b w-full mb-4" : "")}>
          {!isChatActive && <HairFollicleBgIcon />}
          <AiTrichologistIcon />
          <h1 className={cn("font-bold text-gray-900", isChatActive ? "text-2xl" : "text-3xl")}>
            Hello, I&apos;m HairlossDoctor.AI
          </h1>
          {!isChatActive && (
            <p className="text-base text-gray-600 max-w-md">
              Your personal AI trichologist—how can I help you today?
            </p>
          )}
        </header>

        {isChatActive ? (
          <div className="flex flex-col w-full h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <ScrollArea viewportRef={chatViewportRef} className="flex-grow p-4 md:p-6 space-y-3 md:space-y-4 chat-scroll-area">
              {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
              {isLoading && (
                <div className="flex justify-start">
                  <MessageBubble message={{id: 'typing', text: '', sender: 'ai', timestamp: new Date()}} />
                </div>
              )}
              {isLoading && <div className="pl-12 -mt-8"><TypingIndicator /></div>}
            </ScrollArea>
            <div className="p-2 md:p-3 border-t bg-gray-50">
               <form onSubmit={handleFormSubmit} className="w-full bg-white rounded-xl border border-gray-300 shadow-sm p-1.5">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={chatInputValue}
                    onChange={(e) => setChatInputValue(e.target.value)}
                    placeholder="Ask anything..."
                    className="flex-1 border-none focus:ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 bg-transparent h-10 placeholder-gray-500"
                    disabled={isLoading}
                  />
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:bg-gray-100 rounded-full" aria-label="Use microphone" disabled={isLoading}>
                      <Mic className="h-5 w-5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:bg-gray-100 rounded-full" aria-label="Attach file" disabled={isLoading}>
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button type="submit" size="icon" className="h-9 w-9 bg-[#6A4BF6] text-white hover:bg-[#583DE0] rounded-full transition-all duration-150 ease-out active:scale-95" aria-label="Send message" disabled={isLoading || !chatInputValue.trim()}>
                      <SendHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full max-w-lg rounded-[14px] border border-[#E5E7EB] bg-white/90 backdrop-blur-sm shadow-md p-3 sm:p-4">
              <form onSubmit={handleFormSubmit} className="w-full">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={chatInputValue}
                    onChange={(e) => setChatInputValue(e.target.value)}
                    placeholder="Ask me anything about hair-loss care…"
                    className="flex-1 border-none focus:ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 bg-transparent h-10 placeholder-gray-500"
                    disabled={isLoading}
                  />
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:bg-gray-100 rounded-full" aria-label="Use microphone" disabled={isLoading}>
                      <Mic className="h-5 w-5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:bg-gray-100 rounded-full" aria-label="Attach file" disabled={isLoading}>
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button type="submit" size="icon" className="h-9 w-9 bg-[#6A4BF6] text-white hover:bg-[#583DE0] rounded-full transition-all duration-150 ease-out active:scale-95" aria-label="Send message" disabled={isLoading || !chatInputValue.trim()}>
                      <SendHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </form>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mt-3 sm:mt-4 pl-1">
                {[
                  { text: "Hair Scan", icon: Search, action: "Tell me about hair scanning" },
                  { text: "Routine Ideas", icon: Lightbulb, action: "Suggest some hair care routine ideas" }
                ].map(pill => (
                  <Button
                    key={pill.text}
                    variant="outline"
                    onClick={() => !isLoading && handleSendMessage(pill.action, true)}
                    className="h-7 text-sm rounded-full border-[rgba(106,75,246,0.4)] px-3 py-1 text-gray-700 hover:bg-[rgba(106,75,246,0.04)] hover:border-[#6A4BF6]/80 hover:text-[#6A4BF6] transition-all duration-150 ease-out active:scale-95 hover:scale-105 flex items-center gap-1.5 w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    <pill.icon className="h-3.5 w-3.5" />
                    {pill.text}
                  </Button>
                ))}
              </div>
            </div>

            <Button asChild size="lg" className="w-full sm:w-auto max-w-xs bg-[#6A4BF6] text-white hover:bg-[#583DE0] active:scale-95 transition-all">
              <Link href="/assessment/step1">Start Hair-Loss Assessment</Link>
            </Button>
            
            <div className="w-full max-w-3xl">
              <div className="sm:grid sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] sm:gap-4 hidden">
                {featureChipsData.map((chip) => {
                  const chipContent = (
                    <>
                      <chip.icon className="h-4 w-4" />
                      <span className="text-slate-700 opacity-70">{chip.text}</span>
                    </>
                  );
                  
                  const chipStyle: React.CSSProperties = {
                    borderColor: chip.color,
                    backgroundColor: hexToRgba(chip.color, 0.04),
                    color: chip.color, // Icon color
                  };
                  
                  if (chip.actionType === 'link') {
                    return (
                      <Link key={chip.id} href={chip.actionValue} passHref legacyBehavior>
                        <a 
                          className={cn(chipBaseClasses, isLoading && chipDisabledClasses)}
                          style={chipStyle}
                          onClick={(e) => { if (isLoading) e.preventDefault(); }}
                          aria-disabled={isLoading}
                        >
                          {chipContent}
                        </a>
                      </Link>
                    );
                  }
                  
                  return (
                    <div
                      key={chip.id}
                      role="button"
                      tabIndex={isLoading ? -1 : 0}
                      className={cn(chipBaseClasses, isLoading && chipDisabledClasses, "cursor-pointer")}
                      style={chipStyle}
                      onClick={() => !isLoading && handleChipClick(chip)}
                      onKeyDown={(e) => {
                        if (!isLoading && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault(); 
                          handleChipClick(chip);
                        }
                      }}
                      aria-disabled={isLoading}
                    >
                      {chipContent}
                    </div>
                  );
                })}
              </div>
              {/* Horizontally scrollable container for small screens */}
              <div className="sm:hidden w-full overflow-hidden">
                <div className="grid grid-rows-2 grid-flow-col gap-3 auto-cols-[160px] overflow-x-auto py-1 snap-x snap-mandatory no-scrollbar pr-4">
                   {featureChipsData.map((chip) => {
                    const chipContent = (
                      <>
                        <chip.icon className="h-4 w-4" />
                        <span className="text-slate-700 opacity-70">{chip.text}</span>
                      </>
                    );
                    
                    const chipStyle: React.CSSProperties = {
                      borderColor: chip.color,
                      backgroundColor: hexToRgba(chip.color, 0.04),
                      color: chip.color, // Icon color
                      width: '160px', 
                    };
                    
                    if (chip.actionType === 'link') {
                      return (
                        <Link key={chip.id} href={chip.actionValue} passHref legacyBehavior>
                          <a 
                            className={cn(chipBaseClasses, isLoading && chipDisabledClasses, "snap-start")}
                            style={chipStyle}
                            onClick={(e) => { if (isLoading) e.preventDefault(); }}
                            aria-disabled={isLoading}
                          >
                            {chipContent}
                          </a>
                        </Link>
                      );
                    }
                    
                    return (
                      <div
                        key={chip.id}
                        role="button"
                        tabIndex={isLoading ? -1 : 0}
                        className={cn(chipBaseClasses, isLoading && chipDisabledClasses, "cursor-pointer snap-start")}
                        style={chipStyle}
                        onClick={() => !isLoading && handleChipClick(chip)}
                        onKeyDown={(e) => {
                          if (!isLoading && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault(); 
                            handleChipClick(chip);
                          }
                        }}
                        aria-disabled={isLoading}
                      >
                        {chipContent}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
      `}</style>
    </div>
  );
}
