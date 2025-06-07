
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message, HairLossImage, SelectedTag, AssessmentData } from '@/types';
import { 
  ArrowLeft, 
  SendHorizontal, 
  MessageSquare,
  ClipboardList, 
  Pill, 
  Globe, 
  Scissors, 
  Dna, 
  Brain, 
  Bike, 
  Microscope
} from 'lucide-react';
import { cn } from '@/lib/utils';

const dietNutritionTags = [
  'Zero red meat diet', 'Pescatarian diet', 'Vegetarian diet', 'Vegan diet', 
  'Egg-based diet', 'Keto/Low-carb diet', 'High-carb/Low-fat diet', 
  'Intermittent fasting', 'Gluten-free diet', 'Dairy-free diet', 
  'Grain-free/Paleo diet', 'Raw food diet', 'Juice cleanse/Detox diet', 
  'High-protein/Bodybuilding diet', 'Mediterranean diet', 'Macrobiotic diet', 
  'Nut-based/Plant fats diet', 'Crash dieting/Calorie restriction', 
  'Sports-focused/Athletic diet', 'Region-specific diet'
];
const medicationTags = [
  'Chemotherapy (Cancer treatment)', 'Beta-blockers (Heart medications)', 
  'Antidepressants (SSRIs, Tricyclics)', 'Blood thinners (Anticoagulants)', 
  'Acne treatment (Retinoids like Isotretinoin)', 'Birth control pills', 
  'Hormone replacement therapy', 'Anticonvulsants (Epilepsy medications)', 
  'Mood stabilizers/Antipsychotics', 'NSAIDs (Long-term use)', 
  'Statins (Cholesterol medications)'
];
const externalFactorTags = [
  'Hard water exposure', 'Pollution & dust exposure', 'Excessive UV & heat exposure', 
  'High humidity & sweat', 'Windy conditions', 'Seasonal weather changes', 
  'Chlorine & salt water exposure', 'Indoor heating & cooling', 
  'Smoking/Secondhand smoke', 'Stressful city life'
];
const haircareHabitTags = [
  'Frequent tight hairstyles', 'Braids/Dreadlocks/Weaves', 'Hair extensions', 
  'Frequent ponytails/buns', 'Heavy hair accessories', 'Excessive heat styling', 
  'Frequent blow-drying', 'Chemical treatments (relaxing, perms)', 
  'Hair coloring/bleaching', 'Excessive brushing/combing', 'Aggressive scalp scrubbing', 
  'Not using shower filter', 'Daily shampooing/overwashing', 'Using harsh shampoos', 
  'Too many styling products', 'Wearing tight hats/helmets', 
  'Sleeping on rough pillowcases', 'Poor scalp hygiene'
];
const hormonalFactorTags = [
  'Pregnancy/postpartum', 'Irregular periods', 'Acne or oily skin', 
  'More facial or body hair', 'Thinning hair on crown', 'Thinning hair at temples', 
  'Hot flashes', 'Night sweats', 'Tired/low energy', 'Easy weight gain', 
  'Easy weight loss', 'Cold or heat sensitivity', 'Currently taking birth control', 
  'Currently taking hormones', 'Using muscle-building steroids', 'Poor libido', 
  'Big stress/trauma lately', 'Other hormone issues'
];
const mentalHealthTags = [
  'High stress', 'Chronic stress', 'Mood swings', 'Depression', 'Anxiety', 
  'Burnout/Exhaustion', 'Insomnia/Poor sleep', 'Major life events', 
  'Taking mental health medications', 'Other mental health concerns'
];
const physicalActivityTags = [
  'Intense workouts/Overtraining', 'Wearing tight headgear/helmets', 
  'Excessive sweating', 'Hot yoga/High-heat activities', 
  'Swimming in chlorinated pools', 'Outdoor sports/Sun exposure', 
  'Wearing sweatbands/caps', 'Using hair ties during workouts', 
  'Lack of rest/sleep after workouts'
];
const scalpConditionTags = [
  'Dandruff', 'Itchy scalp', 'Oily scalp', 'Dry scalp', 'Red/irritated scalp', 
  'Flaky scalp', 'Scalp bumps/pimples', 'Painful scalp', 'Burning/stinging scalp', 
  'Scalp wounds/sores', 'Crusty patches', 'Scalp infection/fungus', 
  'Scalp psoriasis', 'Scalp eczema', 'Sensitive to combing', 
  'Sensitive to massaging', 'Sensitive to hot water', 'Sensitive to cold water', 
  'Other scalp issues'
];

const tagCategories = [
  { title: 'DIET & NUTRITION', tags: dietNutritionTags, icon: ClipboardList, id: 'diet' },
  { title: 'MEDICATIONS & DRUGS', tags: medicationTags, icon: Pill, id: 'medications' },
  { title: 'EXTERNAL FACTORS', tags: externalFactorTags, icon: Globe, id: 'external' },
  { title: 'HAIRCARE HABITS', tags: haircareHabitTags, icon: Scissors, id: 'haircare' },
  { title: 'HORMONAL FACTORS', tags: hormonalFactorTags, icon: Dna, id: 'hormonal' },
  { title: 'MENTAL HEALTH', tags: mentalHealthTags, icon: Brain, id: 'mental' },
  { title: 'PHYSICAL ACTIVITY', tags: physicalActivityTags, icon: Bike, id: 'physical' },
  { title: 'SCALP CONDITIONS', tags: scalpConditionTags, icon: Microscope, id: 'scalp' },
];

const formatAIResponse = (text: string): string => {
  let formatted = text
    .replace(/\*+/g, '') 
    .replace(/\s+/g, ' ') 
    .trim();
  
  if (formatted.includes('based on') || formatted.includes('selected')) {
    const sentences = formatted.split(/[.!?]+/).filter(s => s.trim());
    
    if (sentences.length >= 2) {
      let result = `**Based on Your Assessment**: ${sentences[0].trim()}\n\n`;
      result += `**Key Points**:\n`;
      
      for (let i = 1; i < Math.min(sentences.length, 4); i++) {
        if (sentences[i].trim().length > 10) {
          result += `• ${sentences[i].trim()}\n`;
        }
      }
      
      return result;
    }
  }
  
  return formatted;
};

export default function AssessmentStep2Page() {
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedImagesFromSession, setSelectedImagesFromSession] = useState<HairLossImage[]>([]);

  useEffect(() => {
    const storedDataString = sessionStorage.getItem('assessmentData');
    if (storedDataString) {
      try {
        const storedData: AssessmentData = JSON.parse(storedDataString);
        if (storedData.selectedTags && Array.isArray(storedData.selectedTags)) {
          setSelectedTags(storedData.selectedTags);
        }
        if (storedData.selectedImages && Array.isArray(storedData.selectedImages)) {
          setSelectedImagesFromSession(storedData.selectedImages);
        }
      } catch (error) {
        console.error("Failed to parse assessmentData from sessionStorage on Step 2:", error);
        sessionStorage.removeItem('assessmentData');
      }
    }
  }, []);

  const toggleTagSelection = (tag: string, category: string) => {
    setSelectedTags(prev => {
      const isSelected = prev.some(t => t.tag === tag && t.category === category);
      let newSelection;
      
      if (isSelected) {
        newSelection = prev.filter(t => !(t.tag === tag && t.category === category));
      } else {
        newSelection = [...prev, { tag, category }];
      }
      
      const currentAssessmentDataString = sessionStorage.getItem('assessmentData');
      let currentAssessmentData: Partial<AssessmentData> = {};
      if (currentAssessmentDataString) {
        try {
          currentAssessmentData = JSON.parse(currentAssessmentDataString);
        } catch (e) { console.error("Error parsing assessmentData during tag toggle", e)}
      }

      const assessmentUpdate: AssessmentData = {
        selectedImages: currentAssessmentData.selectedImages || [],
        selectedTags: newSelection,
        currentStep: 2,
        assessmentResults: currentAssessmentData.assessmentResults // Preserve results if they exist
      };
      sessionStorage.setItem('assessmentData', JSON.stringify(assessmentUpdate));
      
      return newSelection;
    });
  };

  const getChatContext = () => {
    const storedDataString = sessionStorage.getItem('assessmentData');
    let imagesForContext: HairLossImage[] = selectedImagesFromSession; 
    let currentAssessmentData: Partial<AssessmentData> = {};
    
    if (storedDataString) {
        try {
            currentAssessmentData = JSON.parse(storedDataString);
            if(currentAssessmentData.selectedImages) {
                imagesForContext = currentAssessmentData.selectedImages;
            }
        } catch (e) { console.error("Error parsing assessmentData for chat context", e); }
    }

    return {
      currentStep: 2,
      selectedImages: imagesForContext.map(img => ({id: img.id, description: img.description, category: img.category})),
      selectedTags: selectedTags,
      assessmentResults: currentAssessmentData.assessmentResults || null
    };
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    const context = getChatContext();

    try {
      const response = await fetch('/api/bedrock-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, context }),
      });

      if (response.ok) {
        const data = await response.json();
        const cleanResponse = formatAIResponse(data.response);
        const aiMessage: Message = {
          id: `${Date.now()}-ai`,
          text: cleanResponse,
          sender: 'ai',
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, aiMessage]);
      } else {
        const errorData = await response.text();
        console.error('API Error response:', errorData);
        const aiMessage: Message = {
          id: `${Date.now()}-error`,
          text: 'Sorry, I had trouble processing that. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Chat fetch error:', error);
      const aiMessage: Message = {
        id: `${Date.now()}-catch-error`,
        text: 'Sorry, an error occurred. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 pb-28"> 
        <div className="flex items-center justify-between mb-4">
          <Link href="/assessment/step1" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Link>
          <span className="text-sm font-medium text-muted-foreground">Step 2 of 4</span>
        </div>
        <Progress value={50} className="w-full mb-6" />

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-2 text-foreground">Step 2: Select Contributing Factors</h1>
          <p className="text-muted-foreground">Select all factors that might be affecting your hair health.</p>
        </div>

        <div className="space-y-8 mb-10">
          {tagCategories.map(category => (
            <div key={category.id}>
              <h2 className="text-xl font-semibold mb-3 flex items-center text-foreground">
                <category.icon className="mr-2 h-5 w-5 text-primary" />
                {category.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {category.tags.map(tag => {
                  const isSelected = selectedTags.some(t => t.tag === tag && t.category === category.title);
                  return (
                    <Button
                      key={tag}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTagSelection(tag, category.title)}
                      className={cn(
                        "rounded-full py-1.5 px-4 text-sm transition-colors h-auto",
                        isSelected 
                          ? 'border-primary hover:bg-primary/90' 
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-700'
                      )}
                    >
                      {tag}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-card p-4 md:p-6 rounded-xl shadow-xl mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <MessageSquare className="mr-2 h-6 w-6 text-primary"/>
            Chat About Your Selections
          </h3>
          <ScrollArea className="h-60 mb-4 border rounded-lg p-3 bg-background chat-scroll-area">
            {chatMessages.length === 0 && !isChatLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <MessageSquare className="w-12 h-12 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Select factors above and then ask questions here.
                </p>
              </div>
            )}
            {chatMessages.map(msg => (
              <div key={msg.id} className="mb-2 last:mb-0">
                <div className={`p-2.5 rounded-xl text-sm w-fit max-w-[80%]
                  ${msg.sender === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm ml-auto' 
                    : 'bg-muted text-foreground rounded-tl-sm mr-auto'}`}>
                  <p className="font-semibold mb-0.5">{msg.sender === 'user' ? 'You' : 'AI Assistant'}</p>
                  {msg.sender === 'user' 
                    ? <p className="whitespace-pre-wrap">{msg.text}</p>
                    : <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                  }
                  <span className="text-xs text-muted-foreground/70 mt-1 block text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex items-center p-2.5">
                  <div className="h-2 w-2 animate-dot-pulse-before rounded-full bg-muted-foreground [animation-delay:-0.3s] mr-1"></div>
                  <div className="h-2 w-2 animate-dot-pulse rounded-full bg-muted-foreground [animation-delay:-0.15s] mr-1"></div>
                  <div className="h-2 w-2 animate-dot-pulse-after rounded-full bg-muted-foreground"></div>
                  <span className="ml-2 text-sm text-muted-foreground">AI is thinking...</span>
              </div>
            )}
          </ScrollArea>
          <div className="flex items-center gap-2 mt-4">
            <Input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your selected factors..."
              onKeyPress={(e) => e.key === 'Enter' && !isChatLoading && handleChatSend()}
              className="flex-grow bg-muted border-transparent rounded-full px-4 py-2.5 text-sm placeholder:text-muted-foreground/80 focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isChatLoading}
            />
            <Button 
              onClick={handleChatSend} 
              disabled={isChatLoading || !chatInput.trim()} 
              size="icon"
              className="bg-primary text-primary-foreground rounded-full p-2.5 w-10 h-10 hover:bg-primary/90 active:scale-95 transition-transform flex-shrink-0"
              aria-label="Send message"
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-up-md z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/assessment/step1">Previous</Link>
            </Button>
            <Button 
              size="lg" 
              disabled={selectedTags.length === 0}
              asChild
            >
              <Link href="/assessment/step3">Next Step</Link>
            </Button>
          </div>
           {selectedTags.length === 0 && <p className="text-xs text-muted-foreground mt-1 text-center">Please select at least one factor to proceed.</p>}
        </div>
      </div>
    </>
  );
}
    
