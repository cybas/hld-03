
'use client';

import { useState, useRef, useEffect, type FC } from 'react';
import { SendHorizontal } from 'lucide-react';
import { ChatBubble } from './chat-bubble';
import { formatAIResponse } from '@/utils/responseFormatter';

interface ChatShellProps {
  userType: 'doctor' | 'patient' | 'other' | null;
  initialGreeting: string;
}

interface Message {
  who: 'user' | 'ai';
  text: string;
}

export const ChatShell: FC<ChatShellProps> = ({ userType, initialGreeting }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialGreeting) {
      setMessages([{ who: 'ai', text: formatAIResponse(initialGreeting) }]);
    }
  }, [initialGreeting]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!draft.trim() || !userType) return;
    const text = draft.trim();
    setMessages((m) => [...m, { who: 'user', text }]);
    setDraft('');

    try {
      const r = await fetch('/api/general-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, userType })
      });
      const { response } = await r.json();
      const formattedResponse = formatAIResponse(response);
      setMessages((m) => [...m, { who: 'ai', text: formattedResponse }]);
    } catch (err) {
      console.error('Chat API error:', err);
      setMessages((m) => [...m, { who: 'ai', text: 'Sorry, something went wrong.' }]);
    }
  };

  return (
    <section className="flex h-[calc(100dvh-4rem)] w-full flex-col"> {/* 1.1 Full-height column */}
      {/* message stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pb-4 pt-6 sm:px-6" /* 1.2 Message stream styling */
      >
        <div className="mx-auto flex flex-col gap-6 max-w-2xl"> {/* 1.4 Message bubbles container */}
          {messages.map((m, i) => (
            <ChatBubble key={i} who={m.who} text={m.text} />
          ))}
        </div>
      </div>

      {/* input row */}
      <div className="sticky bottom-0 w-full border-t border-gray-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60"> {/* 1.3 Input bar styling */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mx-auto flex w-full max-w-2xl items-end gap-3 px-4 py-3 sm:px-6" // Updated py-3, items-end
        >
          <textarea
            rows={1}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value)
              // Auto-resize textarea
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 144)}px`; // max-h-36 (144px)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask me anything about hair-loss care…"
            className="flex-1 resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm placeholder-gray-400 focus:border-[#6A4BF6] focus:outline-none min-h-[2.75rem] max-h-36" // 3.2 Textarea styling
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#6A4BF6] text-white transition hover:opacity-90 disabled:opacity-40 flex-shrink-0" // Added flex-shrink-0
            aria-label="Send message"
          >
            <SendHorizontal className="h-5 w-5" /> {/* Using SendHorizontal from lucide-react */}
          </button>
        </form>
      </div>
    </section>
  );
};
