
'use client';

import { treatmentPackages, filterPackages } from '@/app/assessment/step5/data';
import type { AssessmentData } from '@/types';
import { PackageCard } from './PackageCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useMemo } from 'react';

interface PackageRecommendationsProps {
  data: AssessmentData;
}

export function PackageRecommendations({ data }: PackageRecommendationsProps) {
  const { recommendedId, alternativeIds } = useMemo(() => {
    if (!data.treatmentPreferences) {
      // Return default if preferences are missing
      return { recommendedId: 'essential', alternativeIds: ['starter', 'home_clinic_360'] };
    }
    return filterPackages(data.treatmentPreferences);
  }, [data.treatmentPreferences]);
  
  const recommendedPackage = recommendedId ? treatmentPackages[recommendedId] : null;
  const alternativePackages = alternativeIds.map(id => treatmentPackages[id]);

  const topFactors = useMemo(() => {
    if (!data.selectedTags) return [];
    return data.selectedTags.slice(0, 3).map(tag => tag.tag);
  }, [data.selectedTags]);

  return (
    <div className="space-y-8">
      {/* Assessment Summary */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Your Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-muted-foreground">Hair Loss Type:</p>
            <p className="font-bold text-lg text-primary">{data.assessmentResults?.classification}</p>
          </div>
          <div>
            <p className="font-semibold text-muted-foreground">Severity Level:</p>
            <p className="font-bold text-lg text-primary">{data.assessmentResults?.severity}</p>
          </div>
          <div className="md:col-span-2">
            <p className="font-semibold text-muted-foreground">Key Contributing Factors:</p>
            <p className="text-foreground">{topFactors.join(', ') || 'None specified'}</p>
          </div>
           <div>
            <p className="font-semibold text-muted-foreground">Treatment Approach:</p>
            <p className="text-foreground">Non-surgical, evidence-based protocol</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Packages Section */}
      <div className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {recommendedPackage && (
              <div className="lg:col-span-1">
                <PackageCard pkg={recommendedPackage} recommendationType="primary"/>
              </div>
            )}
            {alternativePackages.map(pkg => (
              <div key={pkg.id} className="lg:col-span-1">
                <PackageCard pkg={pkg} recommendationType="alternative" />
              </div>
            ))}
        </div>

        {!recommendedPackage && (
           <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No packages match your specific criteria. Please adjust your preferences or contact us for a custom plan.</p>
           </div>
        )}
      </div>

      {/* Philosophy Section */}
       <Card className="text-center bg-transparent border-none shadow-none">
        <CardContent className="space-y-4 pt-6">
          <div>
            <h4 className="font-semibold text-foreground">Our Treatment Philosophy</h4>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">Any package you choose is a significant step towards progress. You can always upgrade your plan later as you start to see results and better understand your needs.</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">The 100-Day Approach</h4>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">Our programs are structured around a 100-day cycle. This is because hair growth cycles require at least 3 months to show visible, measurable changes.</p>
          </div>
          <div className="flex gap-4 justify-center pt-4">
            {recommendedPackage && <Button size="lg" asChild><Link href={recommendedPackage.detailsUrl} target="_blank">Start with {recommendedPackage.title.split('•')[0].trim()}</Link></Button>}
            <Button size="lg" variant="outline" asChild><Link href="#">Compare All Packages</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
