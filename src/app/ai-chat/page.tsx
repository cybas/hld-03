
import type { Metadata } from 'next';
import { ChatInterface } from '@/components/chat/chat-interface';

export const metadata: Metadata = {
  title: 'AI Chat - HairlossDoctor.AI',
  description: 'Engage with the HairlossDoctor.AI assistant.',
};

export default function AIChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <ChatInterface displayMode="page" />
    </div>
  );
}
