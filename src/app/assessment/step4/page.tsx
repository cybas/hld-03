
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AssessmentData, TreatmentPreferences } from '@/types';
import { ArrowLeft, Timer, Hospital, CircleDollarSign, MapPin, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type PreferenceKey = keyof TreatmentPreferences;

const preferenceOptions = {
  timeCommitment: {
    icon: <Timer className="h-6 w-6 text-primary" />,
    title: 'Time Commitment',
    question: 'How much time can you dedicate to daily hair care?',
    options: ['5-10 minutes daily', '15-20 minutes daily', '30+ minutes daily', 'I prefer minimal daily routine'],
  },
  clinicVisits: {
    icon: <Hospital className="h-6 w-6 text-primary" />,
    title: 'Clinic Visits',
    question: 'Are you open to visiting a clinic for treatments?',
    options: ['Yes, I can visit regularly (weekly/bi-weekly)', 'Occasionally (1-2 times per month)', 'Rarely (only for initial consultation)', 'No clinic visits - home treatment only'],
  },
  monthlyBudget: {
    icon: <CircleDollarSign className="h-6 w-6 text-primary" />,
    title: 'Monthly Budget',
    question: 'What\'s your comfortable monthly budget for hair loss treatment?',
    options: ['Under €200/month', '€200-€400/month', '€400-€700/month', '€700+ per month', 'Budget is not a primary concern'],
  },
  location: {
    icon: <MapPin className="h-6 w-6 text-primary" />,
    title: 'Location Access',
    question: 'Where are you located?',
    options: ['UAE (Dubai, Abu Dhabi, Al Ain)', 'Other Middle East region', 'Europe', 'North America', 'Other international location'],
  },
  treatmentIntensity: {
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
    title: 'Treatment Intensity',
    question: 'What\'s your preferred approach to treatment?',
    options: ['Conservative - start gentle and build up', 'Moderate - balanced approach with proven methods', 'Aggressive - maximum intervention for fastest results', 'Guided - help me decide what\'s appropriate'],
  },
  habitReadiness: {
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    title: 'Readiness to Change Habits',
    question: 'How ready are you to modify your current routine?',
    options: ['Very ready - I\'ll change whatever is needed', 'Somewhat ready - minor changes are fine', 'Cautious - prefer minimal lifestyle changes', 'Unsure - need guidance on what changes help'],
  },
};

const initialPreferences: TreatmentPreferences = {
  timeCommitment: '',
  clinicVisits: '',
  monthlyBudget: '',
  location: '',
  treatmentIntensity: '',
  habitReadiness: '',
};

export default function AssessmentStep4Page() {
  const [preferences, setPreferences] = useState<TreatmentPreferences>(initialPreferences);

  useEffect(() => {
    document.title = 'HairlossDoctor.AI Treatment Preferences - Step 4/5';
    const storedDataString = sessionStorage.getItem('assessmentData');
    if (storedDataString) {
      try {
        const data: AssessmentData = JSON.parse(storedDataString);
        if (data.treatmentPreferences) {
          setPreferences(data.treatmentPreferences);
        }
      } catch (error) {
        console.error("Failed to parse assessmentData:", error);
      }
    }
  }, []);

  const handleSelectPreference = (key: PreferenceKey, value: string) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    const storedDataString = sessionStorage.getItem('assessmentData');
    const data: AssessmentData = storedDataString ? JSON.parse(storedDataString) : {};
    const updatedData: AssessmentData = { ...data, treatmentPreferences: newPreferences, currentStep: 4 };
    sessionStorage.setItem('assessmentData', JSON.stringify(updatedData));
  };

  const isComplete = Object.values(preferences).every(value => value !== '');

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
          <h1 className="text-2xl font-semibold mb-2 text-foreground">Step 4: Treatment Preferences</h1>
          <p className="text-muted-foreground">Help us tailor the right treatment plan for your lifestyle and budget.</p>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {Object.entries(preferenceOptions).map(([key, value]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {value.icon}
                  {value.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">{value.question}</p>
                <div className="flex flex-wrap gap-2">
                  {value.options.map(option => {
                    const isSelected = preferences[key as PreferenceKey] === option;
                    return (
                      <Button
                        key={option}
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => handleSelectPreference(key as PreferenceKey, option)}
                        className={cn(
                            'rounded-full h-auto py-2 px-4 transition-all shadow-sm',
                            isSelected
                            ? 'ring-2 ring-offset-2 ring-primary'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-800 hover:border-primary'
                        )}
                      >
                        {option}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-up-md z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/assessment/step3">Back to Results</Link>
            </Button>
            <Button
              size="lg"
              disabled={!isComplete}
              asChild
            >
              <Link href="/assessment/step5">Get My Personalized Treatment Plan</Link>
            </Button>
          </div>
          {!isComplete && (
            <p className="text-xs text-muted-foreground mt-1 text-center">Please complete all sections to continue.</p>
          )}
        </div>
      </div>
    </>
  );
}
