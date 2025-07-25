
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
  const { recommendedId, alternativeIds } = useMemo(
    () => filterPackages(data.treatmentPreferences!),
    [data.treatmentPreferences]
  );
  
  const recommendedPackage = treatmentPackages[recommendedId];
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
      
      {/* Recommended Package */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-4 text-foreground">Our Recommendation For You</h2>
        <div className="max-w-md mx-auto">
            {recommendedPackage && <PackageCard pkg={recommendedPackage} isRecommended={true} />}
        </div>
      </div>
      
      {/* Alternative Packages */}
      {alternativePackages.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-center mb-4 text-foreground">Also Consider</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {alternativePackages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} isRecommended={false} />
            ))}
          </div>
        </div>
      )}

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
            <Button size="lg">Start with {recommendedPackage.title}</Button>
            <Button size="lg" variant="outline">Compare All Packages</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
