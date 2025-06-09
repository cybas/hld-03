
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
          'whitespace-pre-wrap rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-md',
          isUser
            ? 'bg-gray-100 text-gray-900'
            : 'bg-[#6A4BF6] text-white'
        )}
        dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }}
      >
      </div>
    </div>
  );
};
