
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type {
  Message,
  HairLossImage,
  SelectedTag,
  AssessmentData,
  AssessmentResults,
  RecommendationDetail,
  SummaryByCategory
} from '@/types';
import { ArrowLeft, SendHorizontal, MessageSquare, Info, Lightbulb, CheckCircle2 } from 'lucide-react';
import { formatAIResponse } from '@/utils/responseFormatter';

const recommendationMap: Record<string, Omit<RecommendationDetail, 'tag' | 'category'>> = {
  'High stress': {
    issue: 'Chronic stress elevates cortisol levels, potentially impacting hair follicle cycling.',
    impact: 'May contribute to increased hair shedding (telogen effluvium) by pushing more hair follicles into the resting/shedding phase prematurely.',
    recommendation: 'Incorporate stress-management techniques: mindfulness, meditation, yoga, or regular physical activity. Ensure adequate sleep. Consider discussing with a healthcare provider if stress is chronic or severe. Magnesium glycinate (e.g., 200-400mg daily) might support relaxation for some, but consult a doctor first.'
  },
  'Crash dieting/Calorie restriction': {
    issue: 'Rapid weight loss or severe calorie restriction can lead to acute nutrient deficiencies (e.g., protein, iron, zinc, biotin).',
    impact: 'Often results in significant, diffuse hair shedding (telogen effluvium) a few months after the restrictive period begins.',
    recommendation: 'Resume a balanced, nutrient-dense diet with adequate protein (approx. 1-1.2g per kg of ideal body weight), iron, zinc, and essential fatty acids. Avoid extreme calorie deficits. Consult a nutritionist or doctor for guidance on healthy eating patterns.'
  },
   'Crash dieting': { 
    issue: 'Rapid weight loss or severe calorie restriction can lead to acute nutrient deficiencies (e.g., protein, iron, zinc, biotin).',
    impact: 'Often results in significant, diffuse hair shedding (telogen effluvium) a few months after the restrictive period begins.',
    recommendation: 'Resume a balanced, nutrient-dense diet with adequate protein (approx. 1-1.2g per kg of ideal body weight), iron, zinc, and essential fatty acids. Avoid extreme calorie deficits. Consult a nutritionist or doctor for guidance on healthy eating patterns.'
  },
  'Frequent tight hairstyles': {
    issue: 'Prolonged, excessive tension on hair follicles from styles like tight ponytails, braids, weaves, or extensions.',
    impact: 'Can lead to traction alopecia, a type of hair loss that may become permanent if the tension persists over a long period, especially along the hairline.',
    recommendation: 'Vary hairstyles, opting for looser styles whenever possible. Avoid pulling hair too tightly. Give hair breaks from extensions or tight braids. Use soft hair ties.'
  },
  'Vegan diet': {
    issue: 'Potential for lower intake or absorption of certain nutrients crucial for hair health if not carefully planned.',
    impact: 'Possible deficiencies in iron, zinc, vitamin B12, vitamin D, and omega-3 fatty acids, which can contribute to hair thinning or shedding.',
    recommendation: 'Ensure adequate intake of plant-based protein (legumes, tofu, tempeh), iron (lentils, spinach, fortified foods - consume with vitamin C for better absorption), zinc (nuts, seeds, whole grains). Supplement vitamin B12. Consider vitamin D and vegan omega-3 (e.g., algal oil) supplements. Consult a nutritionist specializing in vegan diets.'
  },
  'Birth control pills': {
    issue: 'Hormonal fluctuations associated with starting, stopping, or changing birth control pills.',
    impact: 'Some individuals may experience temporary hair shedding due to hormonal shifts. Pills with higher androgenic activity could potentially exacerbate androgenetic alopecia in susceptible individuals.',
    recommendation: 'If hair loss is noticed after changes in birth control, discuss with your prescribing doctor. They may suggest a pill with a different hormonal profile. Hair shedding is often temporary and resolves within a few months.'
  },
  'Dandruff': {
    issue: 'Common scalp condition often related to Malassezia yeast overgrowth, leading to flaking and sometimes inflammation (seborrheic dermatitis).',
    impact: 'While not a direct cause of permanent hair loss, severe or chronic inflammation associated with dandruff can potentially disrupt healthy hair follicle function and exacerbate shedding.',
    recommendation: 'Use over-the-counter anti-dandruff shampoos containing ingredients like ketoconazole, zinc pyrithione, selenium sulfide, or coal tar. If severe or persistent, consult a dermatologist.'
  },
  '__DEFAULT__': {
    issue: 'This factor has been identified as potentially contributing to your hair health.',
    impact: 'The specific impact can vary depending on individual circumstances and other combined factors.',
    recommendation: 'Consider discussing this factor with a healthcare provider or dermatologist for personalized advice and to understand its relevance to your specific situation.'
  }
};

const generateRecommendations = (selectedTags: SelectedTag[]): RecommendationDetail[] => {
  if (!selectedTags || selectedTags.length === 0) return [];
  return selectedTags.map(tagObj => {
    const recData = recommendationMap[tagObj.tag] || recommendationMap['__DEFAULT__'];
    return {
      tag: tagObj.tag,
      category: tagObj.category,
      issue: recData.issue,
      impact: recData.impact,
      recommendation: recData.recommendation
    };
  });
};

const summarizeSelections = (selections: (HairLossImage[] | SelectedTag[]), type: 'images' | 'tags'): SummaryByCategory => {
  const summary: SummaryByCategory = {};
  if (!selections) return summary;

  selections.forEach(item => {
    if (item && typeof item === 'object' && 'category' in item) {
      const category = item.category as string; 
      const description = type === 'images' ? (item as HairLossImage).description : (item as SelectedTag).tag;
      if (!summary[category]) {
        summary[category] = [];
      }
      summary[category].push(description);
    }
  });
  return summary;
};


export default function AssessmentStep3Page() {
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResults | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const generateAssessment = (): AssessmentResults | null => {
    const storedDataString = sessionStorage.getItem('assessmentData');
    if (!storedDataString) return null;

    try {
      const sessionData: AssessmentData = JSON.parse(storedDataString);
      const { selectedImages = [], selectedTags = [] } = sessionData;

      const imageCategories = selectedImages.map(img => img.category);
      const tagNames = selectedTags.map(tag => tag.tag);

      let classification: AssessmentResults['classification'] = 'Temporary';
      let severity: AssessmentResults['severity'] = 'Mild';

      const scarringImageCategories = ['other'];
      const scarringTags = ['Scalp wounds/sores', 'Scalp infection/fungus', 'Crusty patches', 'Scalp psoriasis', 'Lichen Planopilaris - Scarring alopecia', 'Dissecting Cellulitis - Inflammatory condition', 'Central Centrifugal Cicatricial Alopecia', 'Central Centrifugal Cicatricial Alopecia (advanced)'];

      const agaImageCategories = ['male-pattern', 'female-pattern'];
      const agaTags = ['Thinning hair on crown', 'Thinning hair at temples', 'Acne or oily skin', 'More facial or body hair'];

      const temporaryTags = ['High stress', 'Crash dieting/Calorie restriction', 'Crash dieting', 'Pregnancy/postpartum', 'Major life events', 'Chemotherapy (Cancer treatment)', 'Telogen Effluvium - Stress-related shedding', 'Telogen Effluvium - Diffuse shedding', 'Telogen Effluvium - Pattern variation'];


      if (scarringTags.some(tag => tagNames.includes(tag)) ||
          selectedImages.some(img => scarringTags.includes(img.description)) ||
          imageCategories.some(cat => scarringImageCategories.includes(cat) &&
            selectedImages.filter(img => img.category === cat).some(img =>
              img.description.toLowerCase().includes('scarring') ||
              img.description.toLowerCase().includes('fibrosing') ||
              img.description.toLowerCase().includes('cicatricial') ||
              img.description.toLowerCase().includes('lichen') ||
              img.description.toLowerCase().includes('cellulitis')
            )
          )
      ) {
        classification = 'Permanent Scarring';
        severity = 'Severe';
      } else if (agaImageCategories.some(cat => imageCategories.includes(cat)) || agaTags.some(tag => tagNames.includes(tag))) {
        classification = 'Permanent Non-Scarring';
        const moderateSeverityIndicators = selectedImages.filter(img => agaImageCategories.includes(img.category)).length;
        const tagSeverityIndicators = selectedTags.filter(tag => agaTags.includes(tag.tag)).length;
        if (moderateSeverityIndicators > 2 || tagSeverityIndicators > 1 || (moderateSeverityIndicators > 0 && selectedImages.some(img => parseInt(img.description.split('Stage ')[1]) >=3)) ) {
            severity = 'Moderate to Severe';
        } else if (moderateSeverityIndicators > 0 || tagSeverityIndicators > 0) {
            severity = 'Moderate';
        } else {
            severity = 'Mild'; 
        }

      } else if (temporaryTags.some(tag => tagNames.includes(tag)) || selectedImages.some(img => temporaryTags.includes(img.description))) {
        classification = 'Temporary';
        const tempTagCount = selectedTags.filter(tag => temporaryTags.includes(tag.tag)).length;
        const tempImageMatch = selectedImages.some(img => temporaryTags.some(tTag => img.description.includes(tTag)));
        if (tempTagCount > 1 || (tempTagCount > 0 && tempImageMatch)) {
            severity = 'Moderate';
        } else if (tempTagCount > 0 || tempImageMatch) {
            severity = 'Mild to Moderate';
        } else {
             severity = 'Mild';
        }
      } else if (selectedImages.length > 0 || selectedTags.length > 0) {
        classification = 'Temporary'; 
        severity = 'Mild';
      }


      const recommendations = generateRecommendations(selectedTags);

      const results: AssessmentResults = {
        classification,
        severity,
        selectedImageSummary: summarizeSelections(selectedImages, 'images'),
        contributingFactorsSummary: summarizeSelections(selectedTags, 'tags'),
        recommendations,
        generatedAt: new Date().toISOString()
      };

      const updatedSessionData: AssessmentData = {
        ...sessionData,
        assessmentResults: results,
        currentStep: 3
      };
      sessionStorage.setItem('assessmentData', JSON.stringify(updatedSessionData));

      return results;

    } catch (error) {
      console.error("Error processing assessment:", error);
      return null;
    }
  };

  useEffect(() => {
    const results = generateAssessment();
    if (results) {
      setAssessmentResults(results);

      const numImageSelections = Object.values(results.selectedImageSummary || {}).reduce((acc, arr) => acc + arr.length, 0);
      const numTagSelections = Object.values(results.contributingFactorsSummary || {}).reduce((acc, arr) => acc + arr.length, 0);

      const initialAiMessageText = `Based on your assessment, your hair loss appears to be primarily classified as **${results.classification}** with a **${results.severity}** severity. I've analyzed your ${numImageSelections} selected image pattern(s) and ${numTagSelections} contributing factor(s). Would you like me to explain these results in more detail or discuss specific recommendations?`;
      
      const aiMessage: Message = {
        id: 'initial-assessment-msg',
        sender: 'ai',
        timestamp: new Date(),
        text: formatAIResponse(initialAiMessageText)
      };
      setChatMessages([aiMessage]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const getChatContext = () => {
    const storedDataString = sessionStorage.getItem('assessmentData');
    if (!storedDataString) return { currentStep: 3 };
    try {
      const sessionData: AssessmentData = JSON.parse(storedDataString);
      return {
        currentStep: 3,
        selectedImages: (sessionData.selectedImages || []).map(img => ({id: img.id, description: img.description, category: img.category})),
        selectedTags: sessionData.selectedTags || [],
        assessmentResults: sessionData.assessmentResults || null
      };
    } catch {
      return { currentStep: 3 };
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !assessmentResults) return;

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
        setChatMessages(prev => [...prev, { id: `${Date.now()}-error`, text: 'Sorry, I had trouble. Please try again.', sender: 'ai', timestamp: new Date() }]);
      }
    } catch (error) {
      console.error('Chat fetch error:', error);
      setChatMessages(prev => [...prev, { id: `${Date.now()}-catch-error`, text: 'Sorry, an error occurred.', sender: 'ai', timestamp: new Date() }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const classificationBadgeColor = useMemo(() => {
    if (!assessmentResults) return 'default';
    switch (assessmentResults.classification) {
      case 'Temporary': return 'bg-green-500 hover:bg-green-600';
      case 'Permanent Non-Scarring': return 'bg-orange-500 hover:bg-orange-600';
      case 'Permanent Scarring': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  }, [assessmentResults]);

  if (!assessmentResults) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="flex items-center justify-between w-full max-w-4xl mb-4">
            <Link href="/assessment/step2" className="flex items-center text-primary hover:underline">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
            </Link>
            <span className="text-sm font-medium text-muted-foreground">Step 3 of 4</span>
        </div>
        <Progress value={75} className="w-full max-w-4xl mb-6" />
        <h1 className="text-2xl font-semibold mb-2 text-foreground">Step 3: Your Brief Assessment</h1>
        <p className="text-muted-foreground mb-8">Generating your assessment results...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalSelectedImages = Object.values(assessmentResults.selectedImageSummary || {}).reduce((sum, arr) => sum + arr.length, 0);
  const totalSelectedTags = Object.values(assessmentResults.contributingFactorsSummary || {}).reduce((sum, arr) => sum + arr.length, 0);
  const totalTagCategories = Object.keys(assessmentResults.contributingFactorsSummary || {}).length;


  return (
    <>
      <div className="container mx-auto px-4 py-8 pb-28">
        <div className="flex items-center justify-between mb-4">
          <Link href="/assessment/step2" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Link>
          <span className="text-sm font-medium text-muted-foreground">Step 3 of 4</span>
        </div>
        <Progress value={75} className="w-full mb-6" />

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-2 text-foreground">Step 3: Your Brief Assessment</h1>
          <p className="text-muted-foreground">Based on your image selections and contributing factors.</p>
        </div>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <Info className="mr-2 h-6 w-6" />
              Your Hair Loss Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-foreground">Classification:</span>
              <Badge className={`${classificationBadgeColor} text-white text-sm px-3 py-1`}>
                {assessmentResults.classification}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-foreground">Severity:</span>
              <Badge variant="secondary" className="text-sm px-3 py-1">{assessmentResults.severity}</Badge>
            </div>

            {totalSelectedImages > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mt-3 mb-1">Based on your selected image patterns:</h4>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-0.5">
                  {Object.entries(assessmentResults.selectedImageSummary).map(([category, descriptions]) =>
                    descriptions.map(desc => <li key={desc}>{desc} (Category: {category})</li>)
                  )}
                </ul>
              </div>
            )}
            {totalSelectedTags > 0 && (
                 <p className="text-sm text-muted-foreground pt-2">
                    We also considered <span className="font-semibold text-foreground">{totalSelectedTags}</span> contributing factor(s) across <span className="font-semibold text-foreground">{totalTagCategories}</span> categories you selected.
                </p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <Lightbulb className="mr-2 h-6 w-6" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>Based on the contributing factors you selected.</CardDescription>
          </CardHeader>
          <CardContent>
            {assessmentResults.recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessmentResults.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-background shadow-sm flex flex-col h-full">
                    <h4 className="font-semibold text-md text-foreground mb-1 flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-green-600 flex-shrink-0" />
                      {rec.tag}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">({rec.category})</span>
                    </h4>
                    <p className="text-sm text-muted-foreground mb-1"><span className="font-medium text-foreground/80">Potential Issue:</span> {rec.issue}</p>
                    <p className="text-sm text-muted-foreground mb-2"><span className="font-medium text-foreground/80">Possible Impact:</span> {rec.impact}</p>
                    <p className="text-sm text-foreground bg-primary/5 p-2 rounded-md mt-auto"><span className="font-medium text-primary">Suggestion:</span> {rec.recommendation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No specific contributing factors selected that map to direct recommendations. Please consult with a healthcare provider for general advice.</p>
            )}
          </CardContent>
        </Card>

        <div className="bg-card p-4 md:p-6 rounded-xl shadow-xl mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <MessageSquare className="mr-2 h-6 w-6 text-primary"/>
            Chat About Your Assessment Results
          </h3>
          <ScrollArea className="h-60 mb-4 border rounded-lg p-3 bg-background chat-scroll-area">
            {chatMessages.map(msg => (
              <div key={msg.id} className="mb-2 last:mb-0">
                <div className={`p-2.5 rounded-xl text-sm w-fit max-w-[80%]
                  ${msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm ml-auto'
                    : 'bg-muted text-foreground rounded-tl-sm mr-auto'}`}>
                  <p className="font-semibold mb-0.5">{msg.sender === 'user' ? 'You' : 'AI Assistant'}</p>
                  {msg.sender === 'user' 
                    ? <p className="whitespace-pre-wrap">{msg.text}</p>
                    : <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text }}></p>
                  }
                  <span className="text-xs text-primary-foreground mt-1 block text-right">
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
              placeholder="Ask about your results or recommendations..."
              onKeyPress={(e) => e.key === 'Enter' && !isChatLoading && handleChatSend()}
              className="flex-grow bg-muted border-transparent rounded-full px-4 py-2.5 text-sm placeholder:text-muted-foreground/80 focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isChatLoading || !assessmentResults}
            />
            <Button
              onClick={handleChatSend}
              disabled={isChatLoading || !chatInput.trim() || !assessmentResults}
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
            <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
              <Link href="/assessment/step2">Previous</Link>
            </Button>
            <Button
              size="lg"
              asChild
              disabled 
            >
              <Link href="/assessment/step4">Next: Treatment Options</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
    
