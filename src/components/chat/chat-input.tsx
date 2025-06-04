
'use client';

import { useState, useRef, useEffect, type FormEvent, type RefObject } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  inputRef?: RefObject<HTMLTextAreaElement>; // Make inputRef optional for now or pass it down
}

export function ChatInput({ onSendMessage, isLoading, inputRef }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  // Use the passed ref if available, otherwise create an internal one
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
      textareaRef.current.style.height = 'auto'; // Reset height
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 128; // Corresponds to max-h-32 (8rem)
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      // Ensure scroll to bottom of textarea if content exceeds max height
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
    <form onSubmit={handleSubmit} className="border-t bg-background p-4">
      <div className="relative flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about hair loss, treatments, or get an assessment..."
          className="flex-grow resize-none rounded-xl border-border bg-input p-3 pr-12 text-sm focus-visible:ring-1 focus-visible:ring-ring max-h-32 overflow-y-auto"
          rows={1}
          disabled={isLoading}
          aria-label="Chat message input"
          // autoFocus // Adding autoFocus here
        />
        <Button
          type="submit"
          size="icon"
          className={cn(
            "absolute right-2 bottom-2 h-8 w-8 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90",
            isLoading ? "opacity-50 cursor-not-allowed" : "opacity-100"
            )}
          disabled={isLoading || !inputValue.trim()}
          aria-label="Send message"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
