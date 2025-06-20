
'use client';

import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  who: 'user' | 'ai';
  text: string;
}

export const ChatBubble: FC<ChatBubbleProps> = ({ who, text }) => {
  const isUser = who === 'user';
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'whitespace-pre-wrap rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-md break-words', /* 3.1 break-words */
          isUser
            ? 'bg-gray-100 text-gray-900' /* 1.4 User bubble color */
            : 'bg-[#6A4BF6] text-white' /* 1.4 AI bubble color */
        )}
        dangerouslySetInnerHTML={{ __html: text }} // Assuming text might contain basic HTML like <br> or <strong> from formatter
      >
      </div>
    </div>
  );
};
