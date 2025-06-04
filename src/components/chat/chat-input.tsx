
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
      const maxHeight = 128; 
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      if (scrollHeight > maxHeight) {
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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-end gap-2"> {/* Removed p-1 */}
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about hair loss, treatments, or get an assessment..."
          className="flex-grow resize-none bg-transparent border-2 border-transparent focus:border-primary focus:ring-0 focus:outline-none placeholder-muted-foreground text-base px-4 py-3 max-h-32 pr-14 text-foreground"
          rows={1}
          disabled={isLoading}
          aria-label="Chat message input"
        />
        <Button
          type="submit"
          size="icon"
          className={cn(
            "absolute right-2 bottom-2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90 transition-all duration-150 ease-premium-ease flex-shrink-0 active:scale-95",
            isLoading ? "opacity-50 cursor-not-allowed" : "opacity-100"
          )}
          disabled={isLoading || !inputValue.trim()}
          aria-label="Send message"
        >
          <SendHorizontal className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>
    </form>
  );
}
