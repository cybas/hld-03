
import type { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

function convertToHtml(markdownText: string): string {
  let html = markdownText;
  // **bold** to <strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Markdown list items (- item or * item) to • item (visual cue)
  html = html.replace(/^- /gm, '• ');
  html = html.replace(/^\* /gm, '• ');
  // Newlines to <br>
  html = html.replace(/\n/g, '<br>');
  return html;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  let displayText = '';
  if (message.id !== 'typing') {
    if (isUser) {
      displayText = message.text;
    } else {
      // AI messages are processed for basic markdown
      displayText = convertToHtml(message.text);
    }
  }

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
          isUser 
            ? <p className="whitespace-pre-wrap">{displayText}</p>
            // For AI messages, use dangerouslySetInnerHTML after converting markdown to basic HTML
            : <p className="whitespace-normal text-card-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: displayText }}></p>
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
