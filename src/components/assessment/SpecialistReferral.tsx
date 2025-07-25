
'use client';

import type { AssessmentData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { useMemo } from 'react';

interface SpecialistReferralProps {
  data: AssessmentData;
}

const getConditionSpecificExplanation = (data: AssessmentData): string => {
  const { selectedImages = [], assessmentResults } = data;
  
  if (assessmentResults?.classification.includes('Scarring')) {
    return "Your results indicate a potential scarring condition. These benefit from early specialist intervention to prevent further irreversible follicle damage. A dermatologist can provide an accurate diagnosis and prescribe potent anti-inflammatory treatments.";
  }
  
  if (selectedImages.some(img => img.description.includes('AGA - Stage 4') || img.description.includes('AGA - Stage 5') || img.description.includes('AGA - Stage 5 or 6'))) {
      return "Advanced androgenetic alopecia often requires medical-grade treatments like prescription medications (e.g., Finasteride, Dutasteride) or procedures that are best managed under a specialist's care to achieve significant results.";
  }
  
  if (selectedImages.some(img => img.description.includes('Trichotillomania'))) {
      return "Hair pulling behaviors (Trichotillomania) are best addressed with a dual approach, involving specialized psychological support and medical guidance from a dermatologist to manage any resulting hair and scalp issues.";
  }

  if (selectedImages.some(img => img.description.includes('Anagen Effluvium') || img.description.includes('Chemotherapy'))) {
      return "Sudden, widespread hair loss like Anagen Effluvium, often associated with medical treatments, requires specialist guidance to manage scalp health and support healthy regrowth post-treatment.";
  }
  
  if (selectedImages.some(img => img.description.includes('Lichen Planopilaris') || img.description.includes('Frontal Fibrosing'))) {
    return "Conditions like Lichen Planopilaris or Frontal Fibrosing Alopecia are forms of scarring alopecia. It is highly recommended to see a specialist for an accurate diagnosis and to start treatment that can help preserve your hair follicles.";
  }

  return "Your selections indicate a condition that requires a more in-depth medical evaluation. A specialist can perform diagnostic tests (like a trichoscopy or biopsy) to confirm the cause and recommend the most effective medical treatments.";
};


export function SpecialistReferral({ data }: SpecialistReferralProps) {
  const explanation = useMemo(() => getConditionSpecificExplanation(data), [data]);
  
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Summary Box */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Your Assessment Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Hair Loss Type:</span>
            <span className="font-bold text-lg text-destructive">{data.assessmentResults?.classification}</span>
          </div>
           <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Severity Level:</span>
            <span className="font-bold text-lg text-destructive">{data.assessmentResults?.severity}</span>
          </div>
           <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Contributing Factors:</span>
            <span className="font-bold text-foreground">{data.selectedTags?.length || 0} factors identified</span>
          </div>
        </CardContent>
      </Card>

      {/* Explanation Section */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-foreground">{explanation}</p>
        </CardContent>
      </Card>

      {/* What to Expect Card */}
       <Card>
        <CardHeader>
          <CardTitle>What You Can Expect From a Specialist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5" />Comprehensive hair and scalp evaluation (trichoscopy).</li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5" />Review of your medical history and potential lab work.</li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5" />Discussion of prescription and procedural treatment options.</li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5" />A personalized medical treatment plan tailored to you.</li>
          </ul>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center space-y-4">
        <Button size="lg" className="w-full max-w-sm" asChild>
            <Link href="https://placeholder-specialist-booking.com" target="_blank" rel="noopener noreferrer">
                Book a Specialist Consultation <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
        </Button>
        <p className="text-sm text-muted-foreground">Our team will help connect you with a qualified specialist in your area.</p>
      </div>
      
      {/* Alternative Options */}
      <div className="text-center space-y-2 pt-4">
        <p className="font-semibold">Not ready yet? No problem.</p>
         <div className="flex gap-4 justify-center">
             <Button variant="outline" asChild>
                <Link href="#">Subscribe to Newsletter</Link>
             </Button>
             <Button variant="outline" asChild>
                <Link href="#">Browse Resources</Link>
             </Button>
         </div>
      </div>
    </div>
  );
}
