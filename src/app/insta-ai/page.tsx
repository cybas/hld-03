
'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';
import Link from 'next/link';
// Image import is not used, so it can be removed or kept for future.
// import Image from 'next/image'; 
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
  UserCheck,
  ListChecks,
  ShoppingBag,
  CalendarDays,
  LineChart,
  FlaskConical,
  History,
  HelpCircle,
  FileUp,
  BriefcaseMedical, // Changed from UserCheck for better visual
  ListOrdered,    // Changed from ListChecks
  Archive,       // Changed from ShoppingBag
  NotebookText,   // Changed for Ingredient Checker
  MessageCircleQuestion, // Changed for FAQs
  UploadCloud     // Changed for Document Upload
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

interface FeatureChip {
  id: string;
  icon: React.ElementType;
  text: string;
  color: string; // Hex color e.g., #6A4BF6
  actionType: 'link' | 'chat';
  actionValue: string; // URL for link, chat message for chat
}

const featureChipsData: FeatureChip[] = [
  { id: 'assessment', icon: BriefcaseMedical, text: 'Hair-Loss Assessment', color: '#6A4BF6', actionType: 'link', actionValue: '/assessment/step1' },
  { id: 'plans', icon: ListOrdered, text: 'Treatment Plans', color: '#F6A34B', actionType: 'chat', actionValue: 'Tell me about common treatment plans for hair loss.' },
  { id: 'finder', icon: Archive, text: 'Product Finder', color: '#F56C6C', actionType: 'chat', actionValue: 'Help me find products for my hair type.' },
  { id: 'consult', icon: CalendarDays, text: 'Book Consultation', color: '#F6C14B', actionType: 'chat', actionValue: 'How can I book a consultation?' },
  { id: 'progress', icon: LineChart, text: 'Track Progress', color: '#4BCB6A', actionType: 'chat', actionValue: 'How can I track my hair growth progress?' },
  { id: 'ingredient', icon: NotebookText, text: 'Ingredient Checker', color: '#F64BC1', actionType: 'chat', actionValue: 'Can you help me check some hair product ingredients?' },
  { id: 'tips', icon: Lightbulb, text: 'Hair-Care Tips', color: '#4BB7F6', actionType: 'chat', actionValue: 'Give me some general hair care tips.' },
  { id: 'history', icon: History, text: 'Diagnosis History', color: '#9A6AF6', actionType: 'chat', actionValue: 'Where can I find my diagnosis history?' },
  { id: 'faq', icon: MessageCircleQuestion, text: 'FAQs', color: '#F6B94B', actionType: 'chat', actionValue: 'What are some frequently asked questions about hair loss?' },
  { id: 'upload', icon: UploadCloud, text: 'Document Upload', color: '#4B6AF6', actionType: 'chat', actionValue: 'How can I upload documents?' },
];

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
    // Return a default or transparent color if hex is invalid to prevent errors
    return `rgba(0, 0, 0, ${alpha})`; 
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return `rgba(0, 0, 0, ${alpha})`; // Fallback for parsing errors
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
    document.title = 'Chat with HairLossDoctor.AI';
  }, []);

  const handleSendMessage = async (text: string, fromQuickAction = false) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    if (!fromQuickAction) {
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

  const handleQuickActionClick = (message: string) => {
    setChatInputValue(message); 
    handleSendMessage(message, true);
  };
  
  const handleChipClick = (chip: FeatureChip) => {
    if (chip.actionType === 'chat') {
      handleSendMessage(chip.actionValue, true);
    }
    // Link actions are handled by the Link component itself
  };

  const chipBaseClasses = "h-11 w-full rounded-full text-sm font-medium flex items-center justify-center gap-2 px-3 border transition-all duration-150 ease-out active:scale-95 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring";
  const chipDisabledClasses = "opacity-70 cursor-not-allowed pointer-events-none";


  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-[#FAFAFF] p-4 sm:p-6 font-body">
      <div className={cn("flex flex-col w-full transition-all duration-300 ease-out", isChatActive ? "max-w-screen-md" : "max-w-screen-md items-center text-center space-y-10 sm:space-y-12 pt-8 sm:pt-12")}>
        
        <header className={cn("flex flex-col items-center gap-3", isChatActive ? "py-4 border-b w-full mb-4" : "")}>
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
            <div className="w-full max-w-2xl rounded-[14px] border border-[#E5E7EB] bg-white/90 backdrop-blur-sm shadow-sm p-3 sm:p-4">
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
              <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 pl-1">
                {[
                  { text: "Hair Scan", icon: Search, action: "Tell me about hair scanning" },
                  { text: "Routine Ideas", icon: Lightbulb, action: "Suggest some hair care routine ideas" }
                ].map(pill => (
                  <Button
                    key={pill.text}
                    variant="outline"
                    onClick={() => handleQuickActionClick(pill.action)}
                    className="h-7 text-sm rounded-full border-[#D9D9FF] px-3 py-1 text-gray-700 hover:bg-[#6A4BF6]/[0.06] hover:border-[#6A4BF6]/50 hover:text-[#6A4BF6] transition-all duration-150 ease-out active:scale-95 hover:scale-105 flex items-center gap-1.5"
                    disabled={isLoading}
                  >
                    <pill.icon className="h-3.5 w-3.5" />
                    {pill.text}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 w-full max-w-3xl">
              {featureChipsData.map((chip) => {
                const chipContent = (
                  <>
                    <chip.icon className="h-4 w-4" />
                    <span>{chip.text}</span>
                  </>
                );
                
                const chipStyle: React.CSSProperties = {
                  borderColor: chip.color,
                  color: chip.color,
                  backgroundColor: hexToRgba(chip.color, 0.04),
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
                        e.preventDefault(); // Prevent page scroll on space
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
          </>
        )}
      </div>
    </div>
  );
}

