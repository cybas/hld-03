
'use client';

import { useState, useRef, useEffect, type FC } from 'react';
import { SendHorizontal } from 'lucide-react';
import { ChatBubble } from './chat-bubble'; // Ensure this path is correct
import { cn } from '@/lib/utils';

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
      setMessages([{ who: 'ai', text: initialGreeting }]);
    }
  }, [initialGreeting]);

  /* auto-scroll */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  /* send handler */
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
      // Basic formatting for Bedrock response if needed, or assume Bedrock sends good HTML/Markdown
      const formattedResponse = response
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^- /gm, '• ')
        .replace(/\n/g, '<br />');
      setMessages((m) => [...m, { who: 'ai', text: formattedResponse }]);
    } catch {
      setMessages((m) => [...m, { who: 'ai', text: 'Sorry, something went wrong.' }]);
    }
  };

  return (
    <section className="flex h-[calc(100dvh-4rem)] w-full flex-col items-center">
      {/* message stream */}
      <div
        ref={scrollRef}
        className="flex-1 w-full overflow-y-auto px-4 pb-4 pt-6 sm:px-6"
      >
        <div className="mx-auto flex flex-col gap-4 max-w-2xl"> {/* Increased gap for better bubble separation */}
          {messages.map((m, i) => (
            <ChatBubble key={i} who={m.who} text={m.text} />
          ))}
        </div>
      </div>

      {/* input row */}
      <div className="w-full border-t border-gray-200 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sticky bottom-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mx-auto flex w-full max-w-2xl items-end gap-3 px-4 py-3 sm:px-6" // items-end for better textarea alignment
        >
          <textarea
            rows={1}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              // Auto-resize textarea
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`; // Max height ~5 rows
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask me anything about hair-loss care…"
            className="flex-1 resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm placeholder-gray-500 focus:border-[#6A4BF6] focus:outline-none focus:ring-1 focus:ring-[#6A4BF6] max-h-32" // Max height, py-2.5 for comfort
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#6A4BF6] text-white transition hover:opacity-90 disabled:opacity-50 flex-shrink-0"
            aria-label="Send message"
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </form>
      </div>
    </section>
  );
};
