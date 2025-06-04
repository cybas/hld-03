import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-white to-[#F0F6FF]">
      <div className="container mx-auto px-6 lg:px-8 text-center max-w-4xl">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline text-foreground">
          Welcome to Derma.AI
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl sm:leading-8">
          Your AI assistant for hair loss assessment and treatment guidance. Understand the causes of your hair loss and find personalized solutions.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg" className="px-8 py-3 text-base md:text-lg bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/chat">Start Hair Loss Assessment</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="px-8 py-3 text-base md:text-lg border-primary text-primary hover:bg-primary/5 hover:text-primary">
            <Link href="/chat">Chat with Hair Loss AI</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
