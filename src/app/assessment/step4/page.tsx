
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AssessmentData, TreatmentPlan } from '@/types';
import { ArrowLeft, CheckCircle, Shield, Gem, Rocket, Bot } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ClientTreatmentPlan extends TreatmentPlan {
  icon: React.ReactNode;
}

const treatmentPlans: ClientTreatmentPlan[] = [
  {
    id: 'essential',
    title: 'Essential Care',
    price: '$150/month',
    icon: <Shield className="h-10 w-10 text-primary mb-4" />,
    features: [
      'Topical Minoxidil 5%',
      'DHT Blocking Shampoo',
      'Biotin & Vitamin D Supplements',
      'Quarterly AI Progress Tracking',
    ],
    description: 'A foundational plan to address common hair loss factors and support regrowth.',
  },
  {
    id: 'advanced',
    title: 'Advanced Therapy',
    price: '$250/month',
    icon: <Gem className="h-10 w-10 text-primary mb-4" />,
    features: [
      'Everything in Essential Care',
      'Oral Finasteride (1mg/day)',
      'Customized Nutrient Blend',
      'Personalized Diet Plan',
      'Monthly AI Progress Tracking',
    ],
    description: 'A comprehensive approach combining medication and lifestyle for enhanced results.',
    isPopular: true,
  },
  {
    id: 'comprehensive',
    title: 'Comprehensive Program',
    price: '$450/month',
    icon: <Rocket className="h-10 w-10 text-primary mb-4" />,
    features: [
      'Everything in Advanced Therapy',
      'Low-Level Laser Therapy (LLLT) Cap',
      'Quarterly Dermatologist Consultation',
      'Priority Support',
    ],
    description: 'Our most powerful plan for those seeking maximum intervention and expert guidance.',
  },
];


const LoadingSkeleton = () => (
  <div className="space-y-8">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card><CardContent className="p-6 pt-16"><Skeleton className="h-48 w-full" /></CardContent></Card>
      <Card><CardContent className="p-6 pt-16"><Skeleton className="h-48 w-full" /></CardContent></Card>
      <Card><CardContent className="p-6 pt-16"><Skeleton className="h-48 w-full" /></CardContent></Card>
    </div>
  </div>
);


export default function AssessmentStep4Page() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'HairlossDoctor.AI Treatment Path - Step 4/5';
    const storedDataString = sessionStorage.getItem('assessmentData');
    if (storedDataString) {
      try {
        const data: AssessmentData = JSON.parse(storedDataString);
        setAssessmentData(data);
        if (data.selectedTreatmentPlan) {
          setSelectedPlan(data.selectedTreatmentPlan);
        }
      } catch (error) {
        console.error("Failed to parse assessmentData:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleSelectPlan = (plan: TreatmentPlan) => {
    const planToSave: TreatmentPlan = {
      id: plan.id,
      title: plan.title,
      price: plan.price,
      features: plan.features,
      description: plan.description,
      isPopular: plan.isPopular,
    };
    setSelectedPlan(planToSave);
    const updatedData: AssessmentData = { ...assessmentData, selectedTreatmentPlan: planToSave, currentStep: 4 };
    sessionStorage.setItem('assessmentData', JSON.stringify(updatedData));
  };
  
  const results = assessmentData?.assessmentResults;

  return (
    <>
      <div className="container mx-auto px-4 py-8 pb-28">
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
           <div>
            <Link href="/" className="text-primary hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/assessment/step1" className="hover:underline">Assessment</Link>
            <span className="mx-2">/</span>
            <span>Step 4 of 5</span>
          </div>
        </div>
        <Progress value={80} className="w-full mb-6" />

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-2 text-foreground">Step 4: Choose Your Recommended Treatment Path</h1>
          <p className="text-muted-foreground">Based on your assessment, here are some suitable options.</p>
        </div>

        {isLoading && <LoadingSkeleton />}

        {!isLoading && !results && (
          <Card className="bg-destructive/10 border-destructive text-center">
            <CardContent className="p-6 text-destructive-foreground font-medium">
              <p>Could not load assessment results.</p>
              <Button variant="outline" asChild className="mt-4">
                <Link href="/assessment/step3">Go back to results</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {results && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Bot size={20} /> Your AI Assessment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Classification</p>
                      <p className="text-lg font-semibold text-primary">{results.classification}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Severity</p>
                      <p className="text-lg font-semibold text-primary">{results.severity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {treatmentPlans.map((plan) => {
                const isSelected = selectedPlan?.id === plan.id;
                return (
                  <Card
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan)}
                    className={cn(
                      'cursor-pointer transition-all duration-300 flex flex-col',
                      isSelected ? 'border-primary ring-2 ring-primary shadow-xl' : 'hover:shadow-lg hover:-translate-y-1',
                      plan.isPopular ? 'border-secondary' : ''
                    )}
                  >
                    <CardHeader className="items-center text-center relative">
                      {plan.isPopular && (
                         <Badge variant="secondary" className="absolute top-4 right-4">Most Popular</Badge>
                      )}
                      {plan.icon}
                      <CardTitle>{plan.title}</CardTitle>
                      <CardDescription className="text-2xl font-bold text-foreground">{plan.price}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                      <p className="text-sm text-muted-foreground text-center mb-6">{plan.description}</p>
                      <ul className="space-y-3 text-sm flex-grow">
                        {plan.features.map((feature, i) => (
                           <li key={i} className="flex items-start">
                            <CheckCircle className="h-4 w-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button variant={isSelected ? 'default' : 'outline'} className="w-full mt-6">
                        {isSelected ? 'Selected' : 'Select Plan'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-up-md z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/assessment/step3">Back to Results</Link>
            </Button>
            <Button
              size="lg"
              disabled={!selectedPlan}
              asChild
            >
              <Link href="/assessment/step5">Next: Final Review</Link>
            </Button>
          </div>
          {!selectedPlan && <p className="text-xs text-muted-foreground mt-1 text-center">Please select a treatment plan to continue.</p>}
        </div>
      </div>
    </>
  );
}
