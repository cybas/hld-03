
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface HairLossImage {
  id:string;
  url: string;
  description: string;
  category: string;
}

export interface SelectedTag {
  tag: string;
  category: string;
}

export interface TreatmentPackage {
  id: string;
  icon: 'shield' | 'gem' | 'hospital' | 'star';
  badge?: 'Most Popular' | 'Best Value' | 'Maximum Results' | 'Balanced Approach';
  title: string;
  price: string;
  programPrice: string;
  features: string[];
  expectedResults: string;
  detailsUrl: string;
}

export type SummaryByCategory = Record<string, string[]>;

export interface RecommendationDetail {
  tag: string;
  category: string;
  issue: string;
  impact: string;
  recommendation: string;
}

export interface AssessmentResults {
  // Old fields, will be phased out or used as fallback
  classification?: 'Temporary' | 'Permanent Non-Scarring' | 'Permanent Scarring' | 'Unknown';
  
  // New detailed fields
  conditionName?: string;
  commonName?: string;
  scarring?: 'Yes' | 'No' | 'Unknown' | 'Mixed';
  severity?: 'Mild' | 'Mild to Moderate' | 'Moderate' | 'Moderate to Severe' | 'Severe' | 'Unknown' | 'Normal' | 'Advanced' | 'Complete' | 'Early' | 'Assessment incomplete' | 'Variable';
  duration?: 'temporary' | 'permanent' | 'variable';
  treatmentSuitability?: 'yes' | 'no' | 'maybe (need consultation)';

  // Maintained fields
  selectedImageSummary?: SummaryByCategory | string;
  contributingFactorsSummary?: SummaryByCategory | string;
  recommendations: RecommendationDetail[];
  generatedAt: string;
}

export interface TreatmentPreferences {
  timeCommitment: string;
  clinicVisits: string;
  monthlyBudget: string;
  location: string;
  treatmentIntensity: string;
  habitReadiness: string;
}

export interface AssessmentData {
  selectedImages?: HairLossImage[];
  selectedTags?: SelectedTag[];
  currentStep?: number;
  assessmentResults?: AssessmentResults;
  treatmentPreferences?: TreatmentPreferences;
  selectedTreatmentPlanId?: string;
}
