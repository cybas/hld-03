
// src/app/chat/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat - HairlossDoctor.AI',
  description: 'Chat with the HairlossDoctor.AI assistant.',
};

export default function ChatPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <h1 className="text-2xl font-semibold text-foreground mb-4">
        Chat Page - New Start
      </h1>
      <p className="text-muted-foreground">
        This is a fresh start for the chat page.
      </p>
      {/* You can start building your new chat interface here */}
    </div>
  );
}
