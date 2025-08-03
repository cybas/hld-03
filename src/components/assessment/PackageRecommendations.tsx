
'use client';

import { PACKAGES } from '@/app/assessment/step5/data';
import type { AssessmentData } from '@/types';
import { PackageCard } from './PackageCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PackageRecommendationsProps {
  data: AssessmentData;
  recommendations: {
    type: string;
    recommendedId: string | null;
    alternativeIds: string[];
  }
}

export function PackageRecommendations({ data, recommendations }: PackageRecommendationsProps) {
  const recommendedPackage = recommendations.recommendedId ? PACKAGES[recommendations.recommendedId] : null;
  const alternativePackages = recommendations.alternativeIds.map(id => PACKAGES[id]);
  const allPackages = [recommendedPackage, ...alternativePackages].filter(Boolean);


  if (!data.assessmentResults || !data.treatmentPreferences) {
    return <div>Loading preferences...</div>;
  }

  return (
    <div className="space-y-12">
      <Card className="bg-blue-50 rounded-lg p-6 mb-8 border-blue-200">
        <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-semibold">Your Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm p-0">
          <div>
            <span className="text-gray-600">Hair Loss Type:</span>
            <p className="font-medium text-foreground">{data.assessmentResults.conditionName}</p>
          </div>
          <div>
            <span className="text-gray-600">Severity:</span>
            <p className="font-medium text-foreground">{data.assessmentResults.severity}</p>
          </div>
          <div>
            <span className="text-gray-600">Budget:</span>
            <p className="font-medium text-foreground">{data.treatmentPreferences.monthlyBudget}</p>
          </div>
          <div>
            <span className="text-gray-600">Treatment Approach:</span>
            <p className="font-medium text-foreground">{data.treatmentPreferences.treatmentIntensity}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className={cn(
        "flex flex-wrap items-start gap-8",
        allPackages.length < 3 ? "justify-center" : "justify-center lg:justify-between"
      )}>
        {recommendedPackage && (
            <div className="w-full max-w-sm shrink-0">
                <PackageCard pkg={recommendedPackage} recommendationType="primary"/>
            </div>
        )}
        
        {alternativePackages.map(pkg => (
            pkg && (
                <div key={pkg.id} className="w-full max-w-sm shrink-0">
                    <PackageCard pkg={pkg} recommendationType="alternative" />
                </div>
            )
        ))}
      </div>

      <Card className="text-center bg-gray-50 rounded-lg p-6 border border-gray-200">
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
            <Button size="lg" variant="outline" asChild><Link href="/packages">Compare All Packages</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
