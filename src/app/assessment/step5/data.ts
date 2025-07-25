
import { Shield, Gem, Hospital, Star } from 'lucide-react';
import type { TreatmentPackage, TreatmentPreferences } from '@/types';

export const treatmentPackages: Record<string, TreatmentPackage> = {
  starter: {
    id: 'starter',
    icon: Shield,
    badge: 'Best Value',
    title: 'Essential Care',
    price: '€150/month',
    programPrice: '€449 for complete 100-day program',
    features: [
      'SP55 Daily Lotion (2 units)',
      'Scalp Detox Scrub (2 units)',
      'Medical-Grade Rosemary Oil (2 units)',
      'Photo tracking guidance',
      'Progress monitoring',
    ],
    expectedResults: 'Less breakage by week 4; density changes from month 3',
    detailsUrl: 'https://placeholder-starter-package.com',
  },
  essential: {
    id: 'essential',
    icon: Gem,
    badge: 'Most Popular',
    title: 'Enhanced Home Care',
    price: '€300/month',
    programPrice: '€932 for complete 100-day program',
    features: [
      'Everything in Essential Care',
      'SP55 Peptide Ampoules (3 units)',
      'Enhanced monitoring protocols',
    ],
    expectedResults: 'Reduced shedding by week 3; new growth visible by week 10',
    detailsUrl: 'https://placeholder-essential-package.com',
  },
  home_clinic_360: {
    id: 'home_clinic_360',
    icon: Hospital,
    title: 'Home + Clinic Care',
    price: '€550/month',
    programPrice: '€1599 for complete 100-day program',
    features: [
      'Everything in Enhanced Care',
      '2× In-clinic exosome treatments',
      'Professional lab testing',
      'TrichoScan monitoring (3 sessions)',
    ],
    expectedResults: 'Measurable density gain by day 90 (+8-12 hairs/cm²)',
    detailsUrl: 'https://placeholder-360-package.com',
  },
  intensive: {
    id: 'intensive',
    icon: Star,
    badge: 'Maximum Results',
    title: 'Maximum Intervention',
    price: '€1000/month',
    programPrice: '€2675 for complete 100-day program',
    features: [
      'Everything in 360° Care',
      '5× Peptide microneedling sessions',
      'Priority specialist support',
      'Comprehensive monitoring',
    ],
    expectedResults: 'Maximum early gains; inflammation reduction in 4 weeks',
    detailsUrl: 'https://placeholder-intensive-package.com',
  },
};

export const filterPackages = (preferences: TreatmentPreferences) => {
  let availablePackageIds: string[] = ['starter', 'essential', 'home_clinic_360', 'intensive'];

  // Budget filtering
  if (preferences.monthlyBudget === 'Under €200/month') {
    availablePackageIds = availablePackageIds.filter(pkgId => ['starter'].includes(pkgId));
  } else if (preferences.monthlyBudget === '€200-€400/month') {
     availablePackageIds = availablePackageIds.filter(pkgId => ['starter', 'essential'].includes(pkgId));
  } else if (preferences.monthlyBudget === '€400-€700/month') {
     availablePackageIds = availablePackageIds.filter(pkgId => ['starter', 'essential', 'home_clinic_360'].includes(pkgId));
  }
  
  // Clinic access filtering  
  if (preferences.clinicVisits === 'No clinic visits - home treatment only') {
    availablePackageIds = availablePackageIds.filter(pkgId => 
      !['home_clinic_360', 'intensive'].includes(pkgId)
    );
  }
  
  // Location filtering for clinic-based packages
  if (preferences.location !== 'UAE (Dubai, Abu Dhabi, Al Ain)') {
    availablePackageIds = availablePackageIds.filter(pkgId => 
      !['home_clinic_360', 'intensive'].includes(pkgId)
    );
  }

  // Determine the single "recommended" package
  // This logic prioritizes the most intensive package that fits the criteria
  const recommendedId = availablePackageIds.length > 0 ? availablePackageIds[availablePackageIds.length - 1] : 'starter';
  
  const alternativeIds = availablePackageIds.filter(id => id !== recommendedId).slice(-2); // Max 2 alternatives

  return {
    recommendedId,
    alternativeIds,
  };
};
