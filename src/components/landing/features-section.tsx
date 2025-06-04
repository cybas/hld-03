import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Sparkles, TestTubeDiagonal, Target } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-accent" />, // Updated icon color
    title: "Understand what's happening to your hair",
    description: "Gain clarity on your current hair situation with AI-powered insights.",
  },
  {
    icon: <TestTubeDiagonal className="h-8 w-8 text-accent" />, // Updated icon color
    title: "Identify the real causes of your hair loss",
    description: "Our AI helps pinpoint contributing factors to your hair loss effectively.",
  },
  {
    icon: <Target className="h-8 w-8 text-accent" />, // Updated icon color
    title: "Find the best treatment path for you",
    description: "Receive personalized guidance on suitable treatment options.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="text-center">
          <h2 className="font-headline text-3xl leading-[1.1] sm:text-4xl md:text-5xl text-foreground">
            How Derma.AI Helps You
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Our platform leverages advanced AI to provide comprehensive hair loss support.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="flex flex-col h-full bg-card border-border hover:shadow-lg hover:shadow-border/50 transition-shadow duration-300"
            >
              <CardHeader className="items-center pt-6">
                {feature.icon}
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center space-y-2 text-center p-6">
                <CardTitle className="font-headline text-xl text-foreground">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
