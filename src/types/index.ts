
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

export interface TreatmentPlan {
  id: string;
  title: string;
  price: string;
  features: string[];
  description: string;
  isPopular?: boolean;
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
  classification: 'Temporary' | 'Permanent Non-Scarring' | 'Permanent Scarring' | 'Unknown';
  severity: 'Mild' | 'Mild to Moderate' | 'Moderate' | 'Moderate to Severe' | 'Severe' | 'Unknown';
  selectedImageSummary: SummaryByCategory;
  contributingFactorsSummary: SummaryByCategory;
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
  selectedTreatmentPlan?: TreatmentPlan;
}
