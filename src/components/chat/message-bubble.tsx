
import type { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={cn('flex items-end space-x-2', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-lg">
            🧬
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xs lg:max-w-md xl:max-w-lg rounded-lg px-4 py-2.5 shadow-sm',
          isUser 
            ? 'bg-primary text-primary-foreground rounded-br-none' 
            : 'bg-card text-card-foreground rounded-bl-none border border-border' 
        )}
      >
        {message.text === '' && message.id === 'typing' ? (
          null // Actual typing indicator handled separately, this bubble is for avatar
        ) : (
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        )}
        {message.id !== 'typing' && (
            <p className={cn(
                "text-xs mt-1",
                isUser ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"
              )}>
              {format(new Date(message.timestamp), 'p')}
            </p>
        )}
      </div>
      {isUser && (
         <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            👤
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
