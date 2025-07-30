
import type { TreatmentPackage, TreatmentPreferences, AssessmentResults } from '@/types';

export const PACKAGES: Record<string, any> = {
  "starters_100d": {
    id: "starters_100d",
    icon: 'shield',
    badge: 'Best Value',
    title: "Starter Package • 100-Day Home Care",
    price: "€449", // for 100 days
    monthlyPrice: 150, // roughly €150/month
    programPrice: '€449 for complete 100-day program',
    summary: "Delivers clinical-grade actives in a light protocol that improves scalp balance and stops progression. High-impact, no-clinic protocol ideal for first-timers.",
    indications: ["telogen_effluvium", "androgenetic_alopecia"],
    clinicRequired: false,
    timeCommitment: "5-10 minutes daily",
    intensity: "Conservative",
    products: [
      { id: "sp55_daily_lotion", name: "SP55 Daily Lotion", units: 2, price: 149 },
      { id: "scalp_detox_scrub", name: "Scalp Detox Scrub", units: 2, price: 25 },
      { id: "rosemary_activ_oil", name: "Medical-Grade Rosemary Oil", units: 2, price: 25 }
    ],
    features: [
      'SP55 Daily Lotion (2 units)',
      'Scalp Detox Scrub (2 units)',
      'Medical-Grade Rosemary Oil (2 units)',
      'Photo tracking guidance',
      'Progress monitoring',
    ],
    expectedResults: "Less breakage by week 4; first density change from month 3",
    monitoring: "Photo diary every 30 days",
    detailsUrl: 'https://placeholder.com/starter'
  },
  "essentials_100d": {
    id: "essentials_100d",
    icon: 'gem',
    badge: 'Most Popular',
    title: "Essential Package • 100-Day Home Boost", 
    price: "€932",
    monthlyPrice: 310,
    programPrice: '€932 for complete 100-day program',
    summary: "Adds peptide ampoules for scalp micro-boosts and botanical DHT control, accelerating regrowth without clinic visits.",
    indications: ["androgenetic_alopecia", "telogen_effluvium"],
    clinicRequired: false,
    timeCommitment: "15-20 minutes daily",
    intensity: "Moderate",
    products: [
      { id: "sp55_daily_lotion", name: "SP55 Daily Lotion", units: 3, price: 149 },
      { id: "sp55_ampoules", name: "SP55 Peptide Ampoules", units: 3, price: 149 },
      { id: "scalp_detox_scrub", name: "Scalp Detox Scrub", units: 2, price: 25 },
      { id: "rosemary_activ_oil", name: "Medical-Grade Rosemary Oil", units: 2, price: 25 }
    ],
    features: [
        'SP55 Daily Lotion (3 units)',
        'SP55 Peptide Ampoules (3 units)',
        'Scalp Detox Scrub (2 units)',
        'Medical-Grade Rosemary Oil (2 units)',
        'Enhanced monitoring protocols',
    ],
    expectedResults: "Shedding reduced by week 3; vellus hair visible by week 10",
    monitoring: "Patient shed log + scalp photos",
    detailsUrl: 'https://placeholder.com/essential'
  },
  "home_clinic_360_100d": {
    id: "home_clinic_360_100d",
    icon: 'hospital',
    badge: 'Balanced Approach',
    title: "Home-Clinic 360° • 100-Day",
    price: "€1599",
    monthlyPrice: 533,
    programPrice: '€1599 for complete 100-day program',
    summary: "Balanced mix of home peptides, shampoo and two in-clinic exosome boosts plus diagnostics to fine-tune progress.",
    indications: ["androgenetic_alopecia", "telogen_effluvium"],
    clinicRequired: true,
    timeCommitment: "15-20 minutes daily + clinic visits",
    intensity: "Moderate to Aggressive",
    locationRequired: "UAE (Dubai, Abu Dhabi, Al Ain)",
    products: [
      { id: "hairox_shampoo", name: "Hairox Anti-Hair-Loss Shampoo", units: 3, price: 34 },
      { id: "sp55_daily_lotion", name: "SP55 Daily Lotion", units: 3, price: 149 },
      { id: "sp55_ampoules", name: "SP55 Peptide Ampoules", units: 3, price: 149 },
      { id: "scalp_detox_scrub", name: "Scalp Detox Scrub", units: 2, price: 25 },
      { id: "rosemary_activ_oil", name: "Medical-Grade Rosemary Oil", units: 2, price: 25 },
      { id: "lab_test_consult", name: "Lab Test Consultation", units: 1, price: 280 },
      { id: "exo_ox_hair_exosome", name: "Exo-Ox Hair Exosome Serum", units: 2, price: 350 },
      { id: "trichoscan_consult", name: "TrichoScan Consultation", units: 3, price: 25 }
    ],
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
    expectedResults: "TrichoScan density gain by day 90 (+8-12 hairs/cm²)",
    monitoring: "Lab test baseline; TrichoScan at baseline and day 90",
    detailsUrl: 'https://placeholder.com/home-clinic-360'
  },
  "intensive_360_100d": {
    id: "intensive_360_100d",
    icon: 'star',
    badge: 'Maximum Results',
    title: "Intensive 360° • 100-Day Clinic + Home",
    price: "€2675",
    monthlyPrice: 892,
    programPrice: '€2675 for complete 100-day program',
    summary: "Most comprehensive plan: five in-clinic peptide microneedling sessions, exosomes, labs, imaging and daily home care.",
    indications: ["androgenetic_alopecia", "seborrheic_dermatitis_related_hair_loss"],
    clinicRequired: true,
    timeCommitment: "30+ minutes daily + regular clinic visits",
    intensity: "Aggressive",
    locationRequired: "UAE (Dubai, Abu Dhabi, Al Ain)",
    products: [
      { id: "hairox_shampoo", name: "Hairox Anti-Hair-Loss Shampoo", units: 3, price: 34 },
      { id: "sp55_daily_lotion", name: "SP55 Daily Lotion", units: 3, price: 149 },
      { id: "sp55_ampoules", name: "SP55 Peptide Ampoules", units: 3, price: 149 },
      { id: "scalp_detox_scrub", name: "Scalp Detox Scrub", units: 2, price: 25 },
      { id: "rosemary_activ_oil", name: "Medical-Grade Rosemary Oil", units: 2, price: 25 },
      { id: "lab_test_consult", name: "Lab Test Consultation", units: 1, price: 280 },
      { id: "exo_ox_hair_exosome", name: "Exo-Ox Hair Exosome Serum", units: 3, price: 350 },
      { id: "sp55_hair_regeneration_vials", name: "SP55 Hair Regeneration Vials", units: 5, price: 200 },
      { id: "trichoscan_consult", name: "TrichoScan Consultation", units: 5, price: 25 }
    ],
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
    expectedResults: "Ponytail circumference up by day 90; scalp inflammation down in 4 weeks",
    monitoring: "Clinic visit every 3 weeks; TrichoScan tracking",
    detailsUrl: 'https://placeholder.com/intensive-360'
  }
};


export const getStep5Recommendations = (step3Results: AssessmentResults, step4Preferences: TreatmentPreferences) => {
  // 1. CHECK MEDICAL APPROPRIATENESS FIRST
  if (!step3Results || !step3Results.conditionId || !step3Results.severity) {
    return { type: "specialist_referral", reason: "incomplete_assessment" };
  }
  
  if (step3Results.scarring === "Yes") {
    return { type: "specialist_referral", reason: "scarring_condition" };
  }
  
  const packageSuitableConditions = [
    "androgenetic_alopecia", 
    "telogen_effluvium", 
    "seborrheic_dermatitis_related_hair_loss"
  ];
  
  if (!packageSuitableConditions.includes(step3Results.conditionId)) {
    return { type: "medical_consultation", reason: "requires_specialized_treatment" };
  }
  
  if (step3Results.severity.includes("Advanced") || step3Results.severity.includes("Complete") || step3Results.severity.includes("Severe")) {
    return { type: "specialist_referral", reason: "advanced_severity" };
  }
  
  // 2. FILTER PACKAGES BY STEP 4 PREFERENCES
  let availablePackages = Object.keys(PACKAGES);
  
  // Budget filtering
  const budgetRanges: Record<string, number[]> = {
    "Under €200/month": [150],
    "€200-€400/month": [150, 310], 
    "€400-€700/month": [150, 310, 533],
    "€700+ per month": [150, 310, 533, 892],
    "Budget is not a primary concern": [150, 310, 533, 892]
  };
  
  const allowedPrices = budgetRanges[step4Preferences.monthlyBudget] || [150, 310, 533, 892];
  availablePackages = availablePackages.filter(pkgId => 
    allowedPrices.includes(PACKAGES[pkgId].monthlyPrice)
  );
  
  // Clinic access filtering
  if (step4Preferences.clinicVisits === "No clinic visits - home treatment only") {
    availablePackages = availablePackages.filter(pkgId => 
      !PACKAGES[pkgId].clinicRequired
    );
  }
  
  // Location filtering  
  if (step4Preferences.location !== "UAE (Dubai, Abu Dhabi, Al Ain)") {
    availablePackages = availablePackages.filter(pkgId => 
      !PACKAGES[pkgId].locationRequired
    );
  }
  
  // Time commitment filtering
  const timeFiltering: Record<string, string[]> = {
    "5-10 minutes daily": ["starters_100d"],
    "15-20 minutes daily": ["starters_100d", "essentials_100d", "home_clinic_360_100d"],
    "30+ minutes daily": ["essentials_100d", "home_clinic_360_100d", "intensive_360_100d"],
    "I prefer minimal daily routine": ["starters_100d"]
  };
  
  if (timeFiltering[step4Preferences.timeCommitment]) {
    availablePackages = availablePackages.filter(pkgId => 
      timeFiltering[step4Preferences.timeCommitment].includes(pkgId)
    );
  }
  
  // Treatment intensity filtering
  const intensityFiltering: Record<string, string[]> = {
    "Conservative - start gentle and build up": ["starters_100d"],
    "Moderate - balanced approach with proven methods": ["essentials_100d", "home_clinic_360_100d"],
    "Aggressive - maximum intervention for fastest results": ["home_clinic_360_100d", "intensive_360_100d"],
    "Guided - help me decide what's appropriate": availablePackages // Show all available
  };
  
  if (intensityFiltering[step4Preferences.treatmentIntensity]) {
    availablePackages = availablePackages.filter(pkgId => 
      intensityFiltering[step4Preferences.treatmentIntensity].includes(pkgId)
    );
  }
  
  // 3. CONDITION-SPECIFIC FILTERING
  availablePackages = availablePackages.filter(pkgId => 
    PACKAGES[pkgId].indications.includes(step3Results.conditionId)
  );
  
  // 4. SELECT RECOMMENDED PACKAGE + ALTERNATIVES
  const recommendedPackage = availablePackages[0] || null; // First = most suitable
  const alternativePackages = availablePackages.slice(1, 3); // Max 2 alternatives
  
  return {
    type: "package_recommendations",
    recommendedId: recommendedPackage,
    alternativeIds: alternativePackages
  };
};

// This is the old data structure, kept for reference for other pages that might use it.
// It should be deprecated and removed once all pages use the new PACKAGES structure.
export const treatmentPackages: Record<string, TreatmentPackage> = {
  starter: {
    id: 'starter',
    icon: 'shield',
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
    icon: 'gem',
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
    icon: 'hospital',
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
    icon: 'star',
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
