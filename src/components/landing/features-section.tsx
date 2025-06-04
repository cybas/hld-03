import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Sparkles, TestTubeDiagonal, Target } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "Understand what's happening to your hair",
    description: "Gain clarity on your current hair situation with AI-powered insights.",
  },
  {
    icon: <TestTubeDiagonal className="h-8 w-8 text-primary" />,
    title: "Identify the real causes of your hair loss",
    description: "Our AI helps pinpoint contributing factors to your hair loss effectively.",
  },
  {
    icon: <Target className="h-8 w-8 text-primary" />,
    title: "Find the best treatment path for you",
    description: "Receive personalized guidance on suitable treatment options.",
  },
];

export function FeaturesSection() {
  return (
    <section className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-headline text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
          How Derma.AI Helps You
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Our platform leverages advanced AI to provide comprehensive hair loss support.
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="items-center">
              {feature.icon}
            </CardHeader>
            <CardContent className="space-y-2 text-center">
              <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
