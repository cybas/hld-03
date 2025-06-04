// src/app/chat/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat Page',
  description: 'This page is intentionally minimal.',
};

export default function ChatPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-background">
      {/* The content for the /chat page route has been intentionally made minimal. */}
      {/* The ChatInterface component can be added here if a full-page chat is desired, */}
      {/* or this page can be used for other purposes. */}
      <p className="text-muted-foreground">This chat page is currently minimal.</p>
    </div>
  );
}
