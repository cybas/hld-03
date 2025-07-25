
import { Shield, Gem, Hospital, Star } from 'lucide-react';
import type { TreatmentPackage, TreatmentPreferences } from '@/types';

export const treatmentPackages: Record<string, TreatmentPackage> = {
  starter: {
    id: 'starter',
    icon: Shield,
    badge: 'Best Value',
    title: 'Starter Package • 100-Day Home Care',
    price: '€150/month',
    programPrice: '€449 for complete 100-day program',
    features: [
      'SP55 Daily Lotion (2 units)',
      'Scalp Detox Scrub (2 units)',
      'Medical-Grade Rosemary Oil (2 units)',
      'Photo tracking guidance',
      'Progress monitoring',
    ],
    expectedResults: 'Less breakage by week 4; first density change from month 3',
    detailsUrl: 'https://placeholder-starter-package.com',
  },
  essential: {
    id: 'essential',
    icon: Gem,
    badge: 'Most Popular',
    title: 'Essential Package • 100-Day Home Boost',
    price: '€300/month',
    programPrice: '€932 for complete 100-day program',
    features: [
      'SP55 Daily Lotion (3 units)',
      'SP55 Peptide Ampoules (3 units)',
      'Scalp Detox Scrub (2 units)',
      'Medical-Grade Rosemary Oil (2 units)',
      'Enhanced monitoring protocols',
    ],
    expectedResults: 'Shedding reduced by week 3; vellus hair visible by week 10',
    detailsUrl: 'https://placeholder-essential-package.com',
  },
  home_clinic_360: {
    id: 'home_clinic_360',
    icon: Hospital,
    badge: 'Balanced Approach',
    title: 'Home-Clinic 360° • 100-Day',
    price: '€550/month',
    programPrice: '€1599 for complete 100-day program',
    features: [
      'Hairox Anti-Hair-Loss Shampoo (3 units)',
      'SP55 Daily Lotion (3 units)',
      'SP55 Peptide Ampoules (3 units)',
      'Scalp Detox Scrub (2 units)',
      'Medical-Grade Rosemary Oil (2 units)',
      'Lab Test Consultation (1 session)',
      'Exo-Ox Hair Exosome Serum (2 treatments)',
      'TrichoScan Consultation (3 sessions)',
    ],
    expectedResults: 'TrichoScan density gain by day 90 (+8-12 hairs/cm²)',
    detailsUrl: 'https://placeholder-360-package.com',
  },
  intensive: {
    id: 'intensive',
    icon: Star,
    badge: 'Maximum Results',
    title: 'Intensive 360° • 100-Day Clinic + Home',
    price: '€1000/month',
    programPrice: '€2675 for complete 100-day program',
    features: [
      'Hairox Anti-Hair-Loss Shampoo (3 units)',
      'SP55 Daily Lotion (3 units)',
      'SP55 Peptide Ampoules (3 units)',
      'Scalp Detox Scrub (2 units)',
      'Medical-Grade Rosemary Oil (2 units)',
      'Lab Test Consultation (1 session)',
      'Exo-Ox Hair Exosome Serum (3 treatments)',
      'SP55 Hair Regeneration Vials (5 sessions)',
      'TrichoScan Consultation (5 sessions)',
    ],
    expectedResults: 'Ponytail circumference up by day 90; scalp inflammation down in 4 weeks',
    detailsUrl: 'https://placeholder-intensive-package.com',
  },
};

export const filterPackages = (preferences: TreatmentPreferences): { recommendedId: string | null; alternativeIds: string[] } => {
  let budgetFiltered: string[];
  switch(preferences.monthlyBudget) {
    case 'Under €200/month':
      budgetFiltered = ['starter'];
      break;
    case '€200-€400/month':
      budgetFiltered = ['essential', 'starter'];
      break;
    case '€400-€700/month':
      budgetFiltered = ['home_clinic_360', 'essential', 'starter'];
      break;
    case '€700+ per month':
      budgetFiltered = ['intensive', 'home_clinic_360', 'essential'];
      break;
    case 'Budget is not a primary concern':
      budgetFiltered = ['intensive', 'home_clinic_360', 'essential', 'starter'];
      break;
    default:
      budgetFiltered = ['starter', 'essential', 'home_clinic_360', 'intensive'];
  }

  let clinicFiltered = budgetFiltered;
  if (preferences.clinicVisits === 'No clinic visits - home treatment only') {
    clinicFiltered = budgetFiltered.filter(pkgId => !['home_clinic_360', 'intensive'].includes(pkgId));
  }
  
  let locationFiltered = clinicFiltered;
  if (preferences.location !== 'UAE (Dubai, Abu Dhabi, Al Ain)') {
    locationFiltered = clinicFiltered.filter(pkgId => !['home_clinic_360', 'intensive'].includes(pkgId));
  }

  // If no packages match (e.g., low budget but wants clinic), default to best available home care
  if (locationFiltered.length === 0) {
      if (budgetFiltered.includes('essential')) locationFiltered = ['essential', 'starter'];
      else locationFiltered = ['starter'];
  }

  const recommendedId = locationFiltered.length > 0 ? locationFiltered[0] : null;
  const alternativeIds = locationFiltered.slice(1, 3); // up to 2 alternatives

  return {
    recommendedId,
    alternativeIds,
  };
};
