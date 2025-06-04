import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ActionSection() {
  return (
    <section className="container py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-6 text-center">
        <h2 className="font-headline text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
          Ready to Take Control?
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Start your journey towards healthier hair today. Our AI is ready to assist you.
        </p>
        <div className="flex w-full items-center justify-center space-x-4">
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link href="/chat">Start Hair Loss Assessment</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="px-8 py-6 text-lg">
            <Link href="/chat">Chat with Hair Loss AI</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
