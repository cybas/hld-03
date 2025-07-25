
'use client';

import type { TreatmentPackage } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PackageCardProps {
  pkg: TreatmentPackage;
  recommendationType?: 'primary' | 'alternative' | 'none';
}

export function PackageCard({ pkg, recommendationType = 'none' }: PackageCardProps) {
  const isRecommended = recommendationType === 'primary';
  const isAlternative = recommendationType === 'alternative';

  const getHeader = () => {
    if (isRecommended) {
      return (
        <div className="text-center py-2 bg-primary text-primary-foreground font-semibold text-sm rounded-t-xl">
          Recommended for You
        </div>
      )
    }
    if (isAlternative) {
      return (
        <div className="text-center py-2 bg-muted text-muted-foreground font-semibold text-sm rounded-t-xl">
          Also Consider
        </div>
      )
    }
    return null;
  }

  return (
    <Card
      className={cn(
        'flex flex-col h-full rounded-xl transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1',
        isRecommended ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-border bg-card'
      )}
    >
      {getHeader()}
      <CardHeader className="items-center text-center pt-6 pb-4">
        <pkg.icon className={cn('h-10 w-10 mb-3', isRecommended ? 'text-primary' : 'text-muted-foreground')} />
        {pkg.badge && (
            <span className={cn(
                'text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full',
                isRecommended ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            )}>
                {pkg.badge}
            </span>
        )}
        <CardTitle className="text-lg font-bold text-foreground mt-2 leading-tight">{pkg.title}</CardTitle>
        <CardDescription className="text-sm">{pkg.programPrice}</CardDescription>
        <p className="text-2xl font-bold text-foreground">{pkg.price}</p>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-6 pt-0">
        <ul className="space-y-3 text-sm text-foreground flex-grow mb-6">
          {pkg.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto space-y-4">
          <div>
            <p className="font-semibold text-sm text-foreground">Expected Results:</p>
            <p className="text-sm text-muted-foreground">{pkg.expectedResults}</p>
          </div>
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href={pkg.detailsUrl} target="_blank" rel="noopener noreferrer">
              Select This Plan <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
