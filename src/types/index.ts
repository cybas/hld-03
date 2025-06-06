
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

export interface AssessmentData {
  selectedImages?: HairLossImage[];
  selectedTags?: SelectedTag[];
  currentStep?: number;
}
