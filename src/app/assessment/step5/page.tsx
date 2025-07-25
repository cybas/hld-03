
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { AssessmentData } from '@/types';
import { SpecialistReferral } from '@/components/assessment/SpecialistReferral';
import { PackageRecommendations } from '@/components/assessment/PackageRecommendations';

const LoadingSkeleton = () => (
    <div className="space-y-8 max-w-3xl mx-auto">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
    </div>
);

// Keywords for conditions that ALWAYS require a specialist
const specialistKeywords = [
    'Frontal Fibrosing', 
    'Lichen Planopilaris', 
    'Dissecting Cellulitis', 
    'CCCA', // Central Centrifugal Cicatricial Alopecia
    'Trichotillomania', 
    'Anagen Effluvium', 
    'Chemotherapy-Induced Alopecia'
];

export default function AssessmentStep5Page() {
  const [data, setData] = useState<AssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsSpecialist, setNeedsSpecialist] = useState(false);

  useEffect(() => {
    document.title = 'Your Hair Loss Plan - Step 5/5';
    try {
      const storedDataString = sessionStorage.getItem('assessmentData');
      if (!storedDataString) {
        throw new Error("No assessment data found in session. Please start over.");
      }
      
      const assessmentData: AssessmentData = JSON.parse(storedDataString);
      
      if (!assessmentData.assessmentResults || !assessmentData.selectedImages || !assessmentData.treatmentPreferences) {
          throw new Error("Assessment data is incomplete. Please return to a previous step.");
      }
      
      setData(assessmentData);

      const classification = assessmentData.assessmentResults.classification || '';
      const selectedImages = assessmentData.selectedImages;

      // Check 1: AI classification is 'Permanent Scarring'.
      const hasScarringClassification = classification === 'Permanent Scarring';
      
      // Check 2: User selected an image description that contains a keyword for a specialist-only condition.
      const hasSpecialistImage = selectedImages.some(img => 
        specialistKeywords.some(keyword => img.description.includes(keyword))
      );

      // Check 3: User selected an image representing advanced AGA (Stage 4 or higher).
      // This logic correctly identifies "Stage 4", "Stage 5", "Stage 5 or 6" etc.
      const hasAdvancedAGA = selectedImages.some(img => 
          img.description.includes('AGA') &&
          (img.description.includes('Stage 4') || 
           img.description.includes('Stage 5') ||
           img.description.includes('Stage 5 or 6'))
      );

      if (hasScarringClassification || hasSpecialistImage || hasAdvancedAGA) {
        setNeedsSpecialist(true);
      } else {
        setNeedsSpecialist(false);
      }

    } catch (e: any) {
      setError(e.message || "An unknown error occurred while loading your data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const title = needsSpecialist ? "Specialist Consultation Recommended" : "Your Personalized Treatment Plan";
  const subtitle = needsSpecialist 
    ? "Based on your assessment, we recommend connecting with a hair loss specialist."
    : "Based on your assessment and preferences, here is our recommendation.";

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
          <h1 className="text-2xl font-semibold mb-2 text-foreground">{title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        {isLoading && <LoadingSkeleton />}
        {error && <div className="text-center text-destructive bg-destructive/10 p-4 rounded-md">{error}</div>}
        
        {!isLoading && !error && data && (
            needsSpecialist 
                ? <SpecialistReferral data={data} /> 
                : <PackageRecommendations data={data} />
        )}
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
