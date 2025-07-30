
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { AssessmentData, RecommendationDetail, SummaryByCategory } from '@/types';
import { ArrowLeft, Lightbulb, CheckCircle2, ShieldAlert, BookOpen, Crown, Pilcrow, Mail, FileText, Loader, CheckCircle, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CONDITION_MAPPING, SEVERITY_MAPPING } from './data';
import { recommendationMap } from './recommendation-data';


const LoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  </div>
);

export default function AssessmentStep3Page() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for PDF generation
  const [emailAddress, setEmailAddress] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    document.title = 'HairlossDoctor.AI Assessment Results - Step 3/5';
    const storedDataString = sessionStorage.getItem('assessmentData');
    if (!storedDataString) {
      setError("No assessment data found. Please start from Step 1.");
      setIsLoading(false);
      return;
    }

    try {
      const data: AssessmentData = JSON.parse(storedDataString);
      
      if (data.assessmentResults && data.assessmentResults.conditionName) {
        setAssessmentData(data);
        setIsLoading(false);
        return;
      }
      
      const { selectedImages, selectedTags } = data;

      const unspecifiedResults = {
        conditionId: "unspecified",
        conditionName: "Unspecified Hair Loss",
        commonName: "Pattern needs further evaluation",
        scarring: "Unknown" as const,
        severity: "Assessment incomplete" as const,
        duration: "variable" as const,
        treatmentSuitability: "maybe (need consultation)" as const,
        recommendations: [],
        generatedAt: new Date().toISOString(),
      };

      if (!selectedImages || selectedImages.length === 0) {
        const finalData = { ...data, assessmentResults: unspecifiedResults, currentStep: 3 };
        setAssessmentData(finalData);
        sessionStorage.setItem('assessmentData', JSON.stringify(finalData));
        setIsLoading(false);
        return;
      }

      const identifiedConditions = selectedImages
        .map(image => CONDITION_MAPPING[image.description])
        .filter(Boolean);
      
      const primaryCondition = identifiedConditions.length > 0 ? identifiedConditions.reduce((primary, current) => {
        if (!primary) return current;
        if (current.scarring && !primary.scarring) return current;
        if (!current.scarring && primary.scarring) return primary;
        if (current.duration === 'permanent' && primary.duration !== 'permanent') return current;
        if (current.duration !== 'permanent' && primary.duration === 'permanent') return primary;
        return primary;
      }) : null;

      if (!primaryCondition) {
        const finalData = { ...data, assessmentResults: unspecifiedResults, currentStep: 3 };
        setAssessmentData(finalData);
        sessionStorage.setItem('assessmentData', JSON.stringify(finalData));
        setIsLoading(false);
        return;
      }

      if (identifiedConditions.length > 3) {
        const results = {
          conditionId: "multiple",
          conditionName: "Multiple Hair Loss Types",
          commonName: "Complex presentation",
          scarring: "Mixed" as const,
          severity: "Variable" as const,
          duration: "variable" as const,
          treatmentSuitability: "maybe (need consultation)" as const,
          recommendations: [],
          generatedAt: new Date().toISOString(),
        };
        const finalData = { ...data, assessmentResults: results, currentStep: 3 };
        setAssessmentData(finalData);
        sessionStorage.setItem('assessmentData', JSON.stringify(finalData));
        setIsLoading(false);
        return;
      }
      
      const severities = selectedImages
        .map(image => SEVERITY_MAPPING[image.description])
        .filter(Boolean);
      
      const primarySeverity = severities.length > 0
        ? severities.reduce((max, current) => (current.stage > max.stage ? current : max), severities[0])
        : { severity: "Mild", stage: 1, scale: "N/A" };
      

      const getTreatmentSuitability = (condition: any, severity: any) => {
        if (condition.scarring) return "maybe (need consultation)";
        if (condition.id === "trichotillomania") return "maybe (need consultation)";
        if (["anagen_effluvium", "radiation_induced_alopecia"].includes(condition.id)) return "maybe (need consultation)";
        if (severity.stage >= 4) return "maybe (need consultation)";
        return "yes";
      };

      const treatmentSuitability = getTreatmentSuitability(primaryCondition, primarySeverity);

      const recommendations = data.selectedTags?.map(tag => {
          const details = recommendationMap[tag.tag] || recommendationMap['__DEFAULT__'];
          return { ...details, tag: tag.tag, category: tag.category };
      }) || [];

      const finalResults = {
        conditionId: primaryCondition.id,
        conditionName: primaryCondition.name,
        commonName: primaryCondition.commonName,
        scarring: (primaryCondition.scarring ? 'Yes' : 'No') as 'Yes' | 'No',
        severity: primarySeverity.severity as any,
        duration: primaryCondition.duration,
        treatmentSuitability: treatmentSuitability,
        selectedImageSummary: data.selectedImages.reduce((acc, img) => {
            acc[img.category] = [...(acc[img.category] || []), img.description];
            return acc;
        }, {} as SummaryByCategory),
        contributingFactorsSummary: data.selectedTags?.reduce((acc, tag) => {
            acc[tag.category] = [...(acc[tag.category] || []), tag.tag];
            return acc;
        }, {} as SummaryByCategory),
        recommendations,
        generatedAt: new Date().toISOString(),
      };

      const finalData = { ...data, assessmentResults: finalResults, currentStep: 3 };
      sessionStorage.setItem('assessmentData', JSON.stringify(finalData));
      setAssessmentData(finalData);

    } catch (e) {
      console.error("Failed to process assessment data:", e);
      setError("Failed to load or process assessment data. Please start over.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGeneratePDF = async () => {
    if (!assessmentData) return;
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    setIsGeneratingPDF(true);
    setEmailSent(false);
    
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentData,
          email: emailAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send report');
      }

      await response.json();
      
      setEmailSent(true);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setEmailError('Failed to send report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };


  const results = assessmentData?.assessmentResults;

  const renderSummary = (summary?: SummaryByCategory | string) => {
    let summaryObj: SummaryByCategory | undefined;
    
    if (typeof summary === 'string') {
        try {
            summaryObj = JSON.parse(summary);
        } catch (error) {
            console.error("Failed to parse summary JSON string:", error);
            return <p className="text-destructive-foreground">Could not display summary.</p>;
        }
    } else if (typeof summary === 'object' && summary !== null) {
        summaryObj = summary;
    }

    if (!summaryObj || Object.keys(summaryObj).length === 0) {
      return <p className="text-muted-foreground">No items selected.</p>;
    }

    return (
      <ul className="space-y-2">
        {Object.entries(summaryObj).map(([category, items]) => (
          <li key={category}>
            <p className="font-semibold text-foreground capitalize">{category.replace('-', ' ')}:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {items.map(item => <Badge key={item} variant="secondary" className="font-normal">{item}</Badge>)}
            </div>
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <>
      <div className="container mx-auto px-4 py-8 pb-28">
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
           <div>
            <Link href="/" className="text-primary hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/assessment/step1" className="hover:underline">Assessment</Link>
            <span className="mx-2">/</span>
            <span>Step 3 of 5</span>
          </div>
        </div>
        <Progress value={60} className="w-full mb-6" />

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-2 text-foreground">Step 3: Your Assessment Results</h1>
          <p className="text-muted-foreground">Here is a summary based on your selections.</p>
        </div>

        {isLoading && <LoadingSkeleton />}
        {error && <Card className="bg-destructive/10 border-destructive"><CardContent className="p-6 text-destructive-foreground font-medium">{error}</CardContent></Card>}
        
        {results && !isLoading && !error && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="flex flex-col">
                 <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
                    <Crown className="w-6 h-6 text-primary" />
                    <CardTitle className="text-xl">Your Classification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <span className="text-sm text-muted-foreground">Possible type of alopecia:</span>
                        <p className="font-medium text-foreground">{results.conditionName}</p>
                        {results.commonName && <p className="text-sm text-muted-foreground">({results.commonName})</p>}
                    </div>
                    
                    <div className="flex items-center">
                        <span className="text-sm text-muted-foreground">Scarring:</span>
                        <Badge variant="outline" className={cn('ml-2', 
                            results.scarring === "Yes" ? "bg-red-100 text-red-800 border-red-200" : "bg-green-100 text-green-800 border-green-200"
                        )}>
                            {results.scarring}
                        </Badge>
                    </div>
                    
                    <div>
                        <span className="text-sm text-muted-foreground">Severity:</span>
                        <span className="ml-2 font-medium text-foreground">{results.severity}</span>
                    </div>
                    
                    <div>
                        <span className="text-sm text-muted-foreground">Condition duration:</span>
                        <span className="ml-2 font-medium text-foreground capitalize">{results.duration}</span>
                    </div>
                    
                    <div className="flex items-center">
                        <span className="text-sm text-muted-foreground">Non-surgical treatment suitability:</span>
                        <Badge variant="outline" className={cn('ml-2 capitalize',
                            results.treatmentSuitability === "yes" ? "bg-green-100 text-green-800 border-green-200"
                            : results.treatmentSuitability === "no" ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        )}>
                            {results.treatmentSuitability}
                        </Badge>
                    </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Pilcrow size={20} /> Your Selections</CardTitle>
                  <CardDescription>A breakdown of your chosen images and factors.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Selected Hair Patterns</h4>
                    {renderSummary(results.selectedImageSummary)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Selected Contributing Factors</h4>
                    {renderSummary(results.contributingFactorsSummary)}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <Mail className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Get Your Complete Assessment Report
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Receive a detailed PDF summary of your hair loss assessment, including personalized recommendations and action steps you can share with your doctor or refer to later.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    <div className="flex-1 w-full sm:w-auto">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                      {emailError && (
                        <p className="text-red-500 text-sm mt-1">{emailError}</p>
                      )}
                    </div>
                    
                    <Button
                      onClick={handleGeneratePDF}
                      disabled={isGeneratingPDF || !emailAddress}
                      className="px-6 py-3 font-medium rounded-lg flex items-center gap-2 whitespace-nowrap"
                    >
                      {isGeneratingPDF ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          Email My Report
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {emailSent && (
                    <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Assessment report sent to {emailAddress}! Check your inbox.
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>Your email is secure and will only be used to send your report and helpful hair care tips.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen size={20} /> Detailed Recommendations</CardTitle>
                    <CardDescription>Based on your selected factors, here are some insights and recommendations. This is for educational purposes and is not a substitute for medical advice.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {results.recommendations.map((rec, index) => (
                           <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="font-semibold text-base hover:no-underline">{rec.tag}</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <h4 className="font-semibold flex items-center gap-2 text-foreground"><ShieldAlert size={16} /> The Issue</h4>
                                        <p className="text-muted-foreground mt-1">{rec.issue}</p>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <h4 className="font-semibold flex items-center gap-2 text-foreground"><Lightbulb size={16} /> The Impact</h4>
                                        <p className="text-muted-foreground mt-1">{rec.impact}</p>
                                    </div>
                                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                                        <h4 className="font-semibold flex items-center gap-2 text-primary"><CheckCircle2 size={16} /> Recommendation</h4>
                                        <p className="text-primary/90 mt-1">{rec.recommendation}</p>
                                    </div>
                                </AccordionContent>
                           </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

          </div>
        )}

      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-up-md z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/assessment/step2">Back to Factors</Link>
            </Button>
            <Button 
              size="lg" 
              disabled={isLoading || !!error}
              asChild
            >
              <Link href="/assessment/step4">Next: Choose Treatment Path</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
