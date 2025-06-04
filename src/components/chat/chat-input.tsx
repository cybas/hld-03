
'use client';

import { useState, useRef, useEffect, type FormEvent, type RefObject } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react';
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
      // Max height for textarea, e.g., 5 lines. Adjust as needed.
      // Assuming line height of 24px (1.5rem for text-base) and p-4 (1rem) padding on textarea gives around 120px for 3 lines visible
      const maxHeight = 128; // Approx 8rem or 3-4 lines before scroll
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      if (scrollHeight > maxHeight) {
        // Enable scroll if content exceeds max height
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.overflowY = 'hidden';
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
    // Removed form-specific background/padding here as parent will provide it.
    <form onSubmit={handleSubmit} className="w-full"> 
      <div className="relative flex items-end gap-2 p-2 sm:p-3"> {/* Reduced gap for tighter layout */}
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about hair loss, treatments, or get an assessment..."
          className="flex-grow resize-none rounded-full border-2 border-slate-200 bg-slate-100 px-5 py-3 text-base focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 max-h-32 pr-12 text-gray-800 placeholder-gray-500"
          rows={1}
          disabled={isLoading}
          aria-label="Chat message input"
        />
        <Button
          type="submit"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-transform duration-150 ease-in-out flex-shrink-0",
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
