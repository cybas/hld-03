
import type { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  // Function to replace **text** with <strong>text</strong>
  const formatBoldText = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  return (
    <div className={cn('flex items-end space-x-2 group', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-8 w-8 self-start">
          <AvatarFallback className="bg-muted text-muted-foreground text-lg">
            🧬
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xs lg:max-w-md xl:max-w-lg text-15px leading-[1.5]',
          isUser 
            ? 'bg-gradient-to-br from-primary to-primary-light-accent text-primary-foreground rounded-t-2xl rounded-bl-2xl rounded-br-sm px-[18px] py-[14px] shadow-md' 
            : 'bg-card text-card-foreground rounded-2xl px-5 py-4 border-l-[3px] border-l-border shadow-chat-ai' 
        )}
      >
        {message.id === 'typing' ? (
          null 
        ) : (
          // Use dangerouslySetInnerHTML for AI messages to render bold, and simple p for user messages
          isUser 
            ? <p className="whitespace-pre-wrap">{message.text}</p>
            : <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatBoldText(message.text) }}></p>
        )}
        {message.id !== 'typing' && (
            <p className={cn(
                "text-xs mt-1.5 text-right",
                isUser ? "text-primary-foreground" : "text-muted-foreground" 
              )}>
              {format(new Date(message.timestamp), 'p')}
            </p>
        )}
      </div>
      {isUser && (
         <Avatar className="h-8 w-8 self-start">
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            👤
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
