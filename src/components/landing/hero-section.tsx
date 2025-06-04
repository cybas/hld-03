import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-4">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-6xl lg:text-7xl font-headline">
          Welcome to Derma.AI
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Your AI assistant for hair loss assessment and treatment guidance. Understand the causes of your hair loss and find personalized solutions.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/chat">Start Hair Loss Assessment</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/chat">Chat with Hair Loss AI</Link>
        </Button>
      </div>
    </section>
  );
}
