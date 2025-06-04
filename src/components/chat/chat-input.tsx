'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
    }
  }, [inputValue]);
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as FormEvent);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="border-t bg-background p-4">
      <div className="relative flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me about hair loss, treatments, or assessment..."
          className="flex-grow resize-none rounded-xl border-border bg-input p-3 pr-12 text-sm focus-visible:ring-1 focus-visible:ring-ring max-h-32 overflow-y-auto"
          rows={1}
          disabled={isLoading}
          aria-label="Chat message input"
        />
        <Button
          type="submit"
          size="icon"
          className={cn(
            "absolute right-2 bottom-2 h-8 w-8 rounded-lg",
            isLoading ? "opacity-50 cursor-not-allowed" : "opacity-100"
            )}
          disabled={isLoading || !inputValue.trim()}
          aria-label="Send message"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
