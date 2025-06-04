import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ActionSection() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-[#F8FAFC]"> {/* Subtle Background */}
      <div className="container mx-auto px-6 lg:px-8 text-center max-w-4xl">
        <h2 className="font-headline text-3xl leading-[1.1] sm:text-4xl md:text-5xl text-foreground">
          Ready to Take Control?
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-lg leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Start your journey towards healthier hair today. Our AI is ready to assist you.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
          <Button asChild size="lg" className="w-full sm:w-auto px-8 py-3 text-base md:text-lg bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/chat">Start Hair Loss Assessment</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto px-8 py-3 text-base md:text-lg border-primary text-primary hover:bg-primary/5 hover:text-primary">
            <Link href="/chat">Chat with Hair Loss AI</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
