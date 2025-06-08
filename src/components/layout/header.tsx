
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Re-using the icon from insta-ai page for consistency
const AiTrichologistIconHeader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8"/>
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <path d="M12 12h.01M16 12h.01M8 12h.01M12 16h.01M16 16h.01M8 16h.01"/>
    <path d="M9 20v-2h6v2"/>
    <circle cx="9" cy="10" r="0.5" fill="hsl(var(--primary))"/>
    <circle cx="15" cy="10" r="0.5" fill="hsl(var(--primary))"/>
    <path d="M12 6.5V9.5M10.5 8H13.5"/>
  </svg>
);

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 max-w-7xl mx-auto px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <AiTrichologistIconHeader />
          <span className="text-xl font-bold text-primary">HairlossDoctor.AI</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-accent-foreground">
              <Link href="#">Login</Link>
            </Button>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="#">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
