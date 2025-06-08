
'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message } from '@/types';
import { 
  Mic, 
  Paperclip, 
  SendHorizontal,
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

// const HairFollicleBgIcon = () => ( ... ) // Can be added if needed for initial view

export default function InstaAIPage() {
  const [userType, setUserType] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatViewportRef = useChatScroll(chatHistory);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userType && inputRef.current) {
      inputRef.current.focus();
    }
  }, [userType]);
  
  useEffect(() => {
    document.title = 'Chat with HairlossDoctor.AI';
  }, []);

  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
    const welcomeMessages: { [key: string]: string } = {
      doctor: "Hello colleague! I'm ready to discuss hair loss cases, treatment protocols, and clinical considerations. How can I assist with your professional inquiry?",
      patient: "Hello! I'm here to help you understand hair loss in simple terms and explore your options. What questions do you have about your hair health?",
      other: "Hello! I'm here to help with hair loss questions. What would you like to know?"
    };
    setChatHistory([{ 
      id: `welcome-${Date.now()}`, 
      text: welcomeMessages[type], 
      sender: 'ai', 
      timestamp: new Date() 
    }]);
  };

  const handleSendMessageInternal = async (textToSend: string) => {
    if (!textToSend.trim() || !userType) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, userMsg]);
    setInputMessage(''); 
    setIsLoading(true);

    try {
      const response = await fetch('/api/general-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg.text, 
          userType: userType 
        }),
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
        setChatHistory((prev) => [...prev, aiMessage]);
      } else {
        const errorData = await response.text();
        console.error('API Error response:', errorData);
        const errorAiMsg: Message = { 
          id: `${Date.now()}-error`, 
          text: 'Sorry, I encountered an issue processing your request. Please try again.', 
          sender: 'ai', 
          timestamp: new Date() 
        };
        setChatHistory((prev) => [...prev, errorAiMsg]);
      }
    } catch (error) {
      console.error('Chat fetch error:', error);
      const catchErrorAiMsg: Message = { 
        id: `${Date.now()}-catch-error`, 
        text: 'An error occurred. Please check your connection or try again later.', 
        sender: 'ai', 
        timestamp: new Date() 
      };
      setChatHistory((prev) => [...prev, catchErrorAiMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };
  
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessageInternal(inputMessage);
  };

  const UserTypeSelectionComponent = () => (
    <div className="user-type-selection text-center my-8 sm:my-12 w-full max-w-lg mx-auto">
      <h3 className="mb-6 text-xl font-semibold text-primary">Tell me if you are:</h3>
      <div className="user-type-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button 
          onClick={() => handleUserTypeSelection('doctor')}
          size="lg"
          className="bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white rounded-xl text-lg font-semibold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4" // Adjusted padding
        >
          👨‍⚕️ Doctor
        </Button>
        <Button 
          onClick={() => handleUserTypeSelection('patient')}
          size="lg"
          className="bg-[#10B981] hover:bg-[#10B981]/90 text-white rounded-xl text-lg font-semibold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4" // Adjusted padding
        >
          🧑‍🦱 Patient
        </Button>
        <Button 
          onClick={() => handleUserTypeSelection('other')}
          size="lg"
          className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white rounded-xl text-lg font-semibold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4" // Adjusted padding
        >
          👤 Other
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[radial-gradient(ellipse_120%_90%_at_50%_0%,_white_0%,_rgba(250,250,255,0.7)_100%)] p-4 sm:p-6 font-body">
      <div className={cn("flex flex-col w-full transition-all duration-300 ease-out max-w-screen-md items-center pt-8 sm:pt-12")}>
        
        <header className={cn("relative flex flex-col items-center gap-3 text-center", userType ? "mb-4" : "sm:space-y-10 space-y-8")}>
          <AiTrichologistIcon />
          <h1 className={cn("font-bold text-gray-900 text-3xl")}>
            Hello, I&apos;m HairlossDoctor.AI
          </h1>
          {!userType && (
            <p className="text-base text-gray-600 max-w-md">
              Your personal AI trichologist—how can I help you today?
            </p>
          )}
        </header>

        {!userType ? (
          <UserTypeSelectionComponent />
        ) : (
          <div className="flex flex-col w-full h-[calc(100vh-230px)] sm:h-[calc(100vh-270px)] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-4">
            <ScrollArea viewportRef={chatViewportRef} className="flex-grow p-4 md:p-6 space-y-3 md:space-y-4 chat-scroll-area">
              {chatHistory.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
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
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me about hair loss..."
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
                    <Button type="submit" size="icon" className="h-9 w-9 bg-[#6A4BF6] text-white hover:bg-[#583DE0] rounded-full transition-all duration-150 ease-out active:scale-95" aria-label="Send message" disabled={isLoading || !inputMessage.trim()}>
                      <SendHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
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
