
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { AssessmentData, TreatmentPreferences } from '@/types';
import { SpecialistReferral } from '@/components/assessment/SpecialistReferral';
import { PackageRecommendations } from '@/components/assessment/PackageRecommendations';
import { getStep5Recommendations } from './data';

const LoadingSkeleton = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
    </div>
);

export default function AssessmentStep5Page() {
  const [data, setData] = useState<AssessmentData | null>(null);
  const [recommendationResult, setRecommendationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Your Hair Loss Plan - Step 5/5';
    try {
      const storedDataString = sessionStorage.getItem('assessmentData');
      if (!storedDataString) {
        throw new Error("No assessment data found in session. Please start over.");
      }
      
      const assessmentData: AssessmentData = JSON.parse(storedDataString);
      
      if (!assessmentData.assessmentResults || !assessmentData.treatmentPreferences) {
          throw new Error("Assessment data is incomplete. Please return to a previous step.");
      }
      
      setData(assessmentData);
      
      const result = getStep5Recommendations(assessmentData.assessmentResults, assessmentData.treatmentPreferences);
      setRecommendationResult(result);

    } catch (e: any) {
      setError(e.message || "An unknown error occurred while loading your data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (error) {
      return <div className="text-center text-destructive bg-destructive/10 p-4 rounded-md">{error}</div>;
    }

    if (!data || !recommendationResult) {
       return <div className="text-center text-muted-foreground">Could not generate recommendations. Please try again.</div>;
    }

    if (recommendationResult.type === 'specialist_referral' || recommendationResult.type === 'medical_consultation') {
      return <SpecialistReferral data={data} reason={recommendationResult.reason} />;
    }

    if (recommendationResult.type === 'package_recommendations') {
      return <PackageRecommendations data={data} recommendations={recommendationResult} />;
    }

    return <div className="text-center text-muted-foreground">There was an issue generating your plan.</div>;
  };
  
  const getTitle = () => {
      if (!recommendationResult) return "Generating Your Plan";
      if (recommendationResult.type === 'specialist_referral' || recommendationResult.type === 'medical_consultation') {
        return "Specialist Consultation Recommended";
      }
      return "Your Personalized Treatment Plan";
  };
  
  const getSubtitle = () => {
      if (!recommendationResult) return "Please wait while we analyze your results.";
      if (recommendationResult.type === 'specialist_referral' || recommendationResult.type === 'medical_consultation') {
        return "Based on your assessment, we recommend connecting with a hair loss specialist.";
      }
      return "Based on your assessment and preferences, here is our recommendation.";
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 pb-28">
         <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <div>
            <Link href="/" className="text-primary hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/assessment/step1" className="hover:underline">Assessment</Link>
            <span className="mx-2">/</span>
            <span>Step 5 of 5</span>
          </div>
        </div>
        <Progress value={100} className="w-full mb-6" />

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-2 text-foreground">{getTitle()}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{getSubtitle()}</p>
        </div>
        
        {renderContent()}
      </div>

       <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-up-md z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/assessment/step4">Back to Preferences</Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/">Finish & Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
