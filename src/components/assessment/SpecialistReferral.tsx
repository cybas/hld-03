
'use client';

import type { AssessmentData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, ExternalLink, AlertTriangle } from 'lucide-react';

interface SpecialistReferralProps {
  data: AssessmentData;
  reason: string;
}

const getReferralMessage = (reason: string): string => {
  const messages: Record<string, string> = {
    "scarring_condition": "Your results indicate a potential scarring condition. These benefit from early specialist intervention to prevent further irreversible follicle damage. A dermatologist can provide an accurate diagnosis and prescribe potent anti-inflammatory treatments.",
    "advanced_severity": "Advanced hair loss often requires medical-grade treatments beyond our standard programs, such as prescription medications or procedures, which are best managed under a specialist's care.",
    "requires_specialized_treatment": "Your condition requires a specialized medical evaluation to determine the best course of action. A dermatologist can perform diagnostic tests to confirm the cause and recommend effective medical treatments.",
    "incomplete_assessment": "Your assessment is incomplete. A specialist can help provide a definitive diagnosis and guide you on the next steps.",
  };
  return messages[reason] || messages["requires_specialized_treatment"];
};

export function SpecialistReferral({ data, reason }: SpecialistReferralProps) {
  const explanation = getReferralMessage(reason);
  
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="bg-yellow-50 border-yellow-200 text-center">
        <CardContent className="p-6">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-yellow-800 font-medium">{explanation}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Your Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Hair Loss Type:</span>
            <span className="font-bold text-lg text-destructive">{data.assessmentResults?.conditionName}</span>
          </div>
           <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Severity Level:</span>
            <span className="font-bold text-lg text-destructive">{data.assessmentResults?.severity}</span>
          </div>
           <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Scarring Potential:</span>
            <span className="font-bold text-destructive">{data.assessmentResults?.scarring}</span>
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>What You Can Expect From a Specialist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5" /><span>Comprehensive hair and scalp evaluation (trichoscopy).</span></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5" /><span>Review of your medical history and potential lab work.</span></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5" /><span>Discussion of prescription and procedural treatment options.</span></li>
            <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5" /><span>A personalized medical treatment plan tailored to you.</span></li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <Button size="lg" className="w-full max-w-sm" asChild>
            <Link href="https://placeholder-specialist-booking.com" target="_blank" rel="noopener noreferrer">
                Book a Specialist Consultation <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
        </Button>
        <p className="text-sm text-muted-foreground">Our team will help connect you with a qualified specialist.</p>
      </div>
      
    </div>
  );
}
