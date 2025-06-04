
'use client';

import { useState, useRef, useEffect, type FormEvent, type RefObject } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, SendHorizontal } from 'lucide-react'; // Added SendHorizontal
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  inputRef?: RefObject<HTMLTextAreaElement>;
}

export function ChatInput({ onSendMessage, isLoading, inputRef }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef || internalTextareaRef;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 128; // Corresponds to max-h-32 (8rem)
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      if (scrollHeight > maxHeight) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }
  }, [inputValue, textareaRef]);
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as FormEvent);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="border-t bg-background p-4 shadow-up-md">
      <div className="relative flex items-end gap-3">
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about hair loss, treatments, or get an assessment..."
          className="flex-grow resize-none rounded-full border-2 border-slate-200 bg-input px-5 py-4 text-base focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 max-h-32 overflow-y-auto pr-14"
          rows={1}
          disabled={isLoading}
          aria-label="Chat message input"
        />
        <Button
          type="submit"
          size="icon"
          className={cn(
            "absolute right-2 bottom-2 h-10 w-10 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-transform duration-150 ease-in-out",
            isLoading ? "opacity-50 cursor-not-allowed" : "opacity-100"
            )}
          disabled={isLoading || !inputValue.trim()}
          aria-label="Send message"
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
