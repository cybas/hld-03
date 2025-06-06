
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message, HairLossImage, AssessmentData } from '@/types';
import { ArrowLeft, SendHorizontal, MessageSquare } from 'lucide-react';

// Image Data
const malePatternImages: HairLossImage[] = [
  {
    id: 'aga-male-1-2',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Male-stages-1or2.jpeg',
    description: 'Male AGA - Early stages (1-2)',
    category: 'male-pattern'
  },
  {
    id: 'aga-male-3',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Male-stages-3.jpeg',
    description: 'Male AGA - Stage 3',
    category: 'male-pattern'
  },
  {
    id: 'aga-male-3vertex-4',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Male-stages-3vertex%20or%204.jpeg',
    description: 'Male AGA - Stage 3 vertex or 4',
    category: 'male-pattern'
  },
  {
    id: 'aga-male-3vertex-4-pic2',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Male-stages-3vertexor4-pic2.jpeg',
    description: 'Male AGA - Stage 3 vertex or 4 (variation)',
    category: 'male-pattern'
  },
  {
    id: 'aga-male-5',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Male-stages-5.jpeg',
    description: 'Male AGA - Stage 5',
    category: 'male-pattern'
  },
  {
    id: 'aga-male-5-6',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Male-stages-5or6.jpeg',
    description: 'Male AGA - Stage 5 or 6',
    category: 'male-pattern'
  }
];

const femalePatternImages: HairLossImage[] = [
  {
    id: 'aga-female-1',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Female-stages-1.jpg',
    description: 'Female AGA - Stage 1',
    category: 'female-pattern'
  },
  {
    id: 'aga-female-2',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Female-stages-2.jpg',
    description: 'Female AGA - Stage 2',
    category: 'female-pattern'
  },
  {
    id: 'aga-female-2-3',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Female-stages-2or3.jpg',
    description: 'Female AGA - Stage 2 or 3',
    category: 'female-pattern'
  },
  {
    id: 'aga-female-3',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Female-stages-3.jpg',
    description: 'Female AGA - Stage 3',
    category: 'female-pattern'
  },
  {
    id: 'aga-female-3-pic2',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Female-stages-3-pic2.jpg',
    description: 'Female AGA - Stage 3 (variation 2)',
    category: 'female-pattern'
  },
  {
    id: 'aga-female-3-pic3',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Female-stages-3-pic3.jpg',
    description: 'Female AGA - Stage 3 (variation 3)',
    category: 'female-pattern'
  },
  {
    id: 'aga-female-3-pic4',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Female-stages-3-pic4.jpg',
    description: 'Female AGA - Stage 3 (variation 4)',
    category: 'female-pattern'
  },
  {
    id: 'aga-female-4-pic1',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Female-stages-4-pic1.jpg',
    description: 'Female AGA - Stage 4 (variation 1)',
    category: 'female-pattern'
  },
  {
    id: 'aga-female-4-pic2',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Female-stages-4-pic2.jpg',
    description: 'Female AGA - Stage 4 (variation 2)',
    category: 'female-pattern'
  },
  {
    id: 'aga-female-5',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/AGA-Female-stage-5.jpg',
    description: 'Female AGA - Stage 5',
    category: 'female-pattern'
  }
];

const patchyImages: HairLossImage[] = [
  {
    id: 'alopecia-barbae',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/alopecia-barbae1.jpg',
    description: 'Alopecia Barbae - Patchy beard loss',
    category: 'patchy'
  },
  {
    id: 'alopecia-areata',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/alopecia-areata.jpg',
    description: 'Alopecia Areata - Round patches',
    category: 'patchy'
  },
  {
    id: 'alopecia-ophiasis-1',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/alopecia-ophiasis1.jpg',
    description: 'Alopecia Ophiasis - Band pattern',
    category: 'patchy'
  },
  {
    id: 'alopecia-ophiasis-2',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/alopecia-ophiasis2.jpg',
    description: 'Alopecia Ophiasis - Band pattern (variation)',
    category: 'patchy'
  },
  {
    id: 'alopecia-totalis',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/alopecia-totalis.jpg',
    description: 'Alopecia Totalis - Complete scalp loss',
    category: 'patchy'
  },
  {
    id: 'alopecia-universalis',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/alopecia-universalis.jpg',
    description: 'Alopecia Universalis - Total body hair loss',
    category: 'patchy'
  },
  {
    id: 'trichotillomania',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/Trichotillomania.jpeg',
    description: 'Trichotillomania - Hair pulling disorder',
    category: 'patchy'
  },
  {
    id: 'diffuse-alopecia',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/Diffuse-alopecia.jpg',
    description: 'Diffuse Alopecia - Overall thinning',
    category: 'patchy'
  }
];

const otherConditionsImages: HairLossImage[] = [
  {
    id: 'frontal-fibrosing-1',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/Frontal%20fibrosing%20alopecia-female-1.jpg',
    description: 'Frontal Fibrosing Alopecia - Hairline recession',
    category: 'other'
  },
  {
    id: 'frontal-fibrosing-2',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/Frontal%20fibrosing%20alopecia-female-2.jpg',
    description: 'Frontal Fibrosing Alopecia - Advanced',
    category: 'other'
  },
  {
    id: 'telogen-effluvium',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/telogen-effluvium.jpg',
    description: 'Telogen Effluvium - Stress-related shedding',
    category: 'other'
  },
  {
    id: 'telogen-effluvium-1',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/Telogen-efflivium1.jpg',
    description: 'Telogen Effluvium - Diffuse shedding',
    category: 'other'
  },
  {
    id: 'telogen-effluvium-2',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/Telogen-efflivium2.jpg',
    description: 'Telogen Effluvium - Pattern variation',
    category: 'other'
  },
  {
    id: 'chemo-alopecia-1',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/chemotherapy-induced-alopecia1.jpg',
    description: 'Chemotherapy-Induced Alopecia',
    category: 'other'
  },
  {
    id: 'chemo-alopecia-2',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/chemotherapy-induced-alopecia2.jpg',
    description: 'Chemotherapy-Induced Alopecia (variation)',
    category: 'other'
  },
  {
    id: 'chemo-alopecia-3',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/chemotherapy-induced-alopecia3.jpg',
    description: 'Chemotherapy-Induced Alopecia (progression)',
    category: 'other'
  },
  {
    id: 'ccca-1',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/Central%20centrifugal%20cicatricial%20alopecia.jpg',
    description: 'Central Centrifugal Cicatricial Alopecia',
    category: 'other'
  },
  {
    id: 'ccca-2',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/Central%20centrifugal%20cicatricial%20alopecia2.jpg',
    description: 'Central Centrifugal Cicatricial Alopecia (advanced)',
    category: 'other'
  },
  {
    id: 'lichen-planopilaris',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/Lichen-planopilaris.jpg',
    description: 'Lichen Planopilaris - Scarring alopecia',
    category: 'other'
  },
  {
    id: 'dissecting-cellulitis',
    url: 'https://hld-img.s3.me-central-1.amazonaws.com/alopecia-types-updated/Dissecting%20cellulitis%20alopecia.jpg',
    description: 'Dissecting Cellulitis - Inflammatory condition',
    category: 'other'
  }
];

const imageSections = [
  { title: 'Male Pattern Hair Loss', images: malePatternImages },
  { title: 'Female Pattern Hair Loss', images: femalePatternImages },
  { title: 'Patchy Hair Loss (Alopecia Areata and others)', images: patchyImages },
  { title: 'Other Conditions (Scarring Alopecias, Telogen Effluvium, etc.)', images: otherConditionsImages },
];


export default function AssessmentStep1Page() {
  const [selectedImages, setSelectedImages] = useState<HairLossImage[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    const storedAssessmentDataString = sessionStorage.getItem('assessmentData');
    if (storedAssessmentDataString) {
      try {
        const parsedData: AssessmentData = JSON.parse(storedAssessmentDataString);
        if (parsedData.selectedImages && Array.isArray(parsedData.selectedImages)) {
          const validImages = parsedData.selectedImages.filter(img => 
            typeof img === 'object' && img !== null && 
            'id' in img && 'url' in img && 'description' in img && 'category' in img
          );
          setSelectedImages(validImages);
        }
      } catch (error) {
        console.error("Failed to parse assessmentData from sessionStorage:", error);
        sessionStorage.removeItem('assessmentData'); 
      }
    }
  }, []);

  const toggleImageSelection = (image: HairLossImage) => {
    setSelectedImages(prev => {
      const isSelected = prev.some(img => img.id === image.id);
      let newSelection;
      
      if (isSelected) {
        newSelection = prev.filter(img => img.id !== image.id);
      } else {
        newSelection = [...prev, image];
      }
      
      const assessmentUpdate: AssessmentData = {
        selectedImages: newSelection,
        currentStep: 1,
        // Preserve other assessment data (like selectedTags) if it exists from navigating back
        selectedTags: JSON.parse(sessionStorage.getItem('assessmentData') || '{}').selectedTags || []
      };
      sessionStorage.setItem('assessmentData', JSON.stringify(assessmentUpdate));
      return newSelection;
    });
  };

  const getChatContext = () => {
    return {
      currentStep: 1,
      selectedImages: selectedImages.map(img => ({id: img.id, description: img.description, category: img.category})),
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
        const aiMessage: Message = {
          id: `${Date.now()}-ai`,
          text: data.response,
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
          <Link href="/" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <span className="text-sm font-medium text-muted-foreground">Step 1 of 4</span>
        </div>
        <Progress value={25} className="w-full mb-6" />

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-2 text-foreground">Step 1: Select Images That Match Your Hair Loss Pattern</h1>
          <p className="text-muted-foreground">Select all images that look similar to your condition.</p>
        </div>

        <div className="space-y-10 mb-10">
          {imageSections.map(section => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-foreground">{section.title}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {section.images.map(image => (
                  <div
                    key={image.id}
                    onClick={() => toggleImageSelection(image)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ease-in-out group
                      ${selectedImages.some(selImg => selImg.id === image.id) ? 'border-primary ring-2 ring-primary shadow-lg' : 'border-transparent hover:border-primary/50 hover:shadow-md'}`}
                  >
                    <div className="relative w-full aspect-[3/4] bg-muted overflow-hidden rounded-t-md">
                      <Image
                        src={image.url}
                        alt={image.description}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="p-2 text-xs text-center bg-card text-card-foreground rounded-b-md">{image.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-card p-4 md:p-6 rounded-xl shadow-xl mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <MessageSquare className="mr-2 h-6 w-6 text-primary"/>
            Chat About Your Image Selections
          </h3>
          <ScrollArea className="h-60 mb-4 border rounded-lg p-3 bg-background chat-scroll-area">
            {chatMessages.length === 0 && !isChatLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <MessageSquare className="w-12 h-12 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Select images above and then ask questions here.
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
                  <p className="whitespace-pre-wrap">{msg.text}</p>
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
              placeholder="Ask about your selected patterns..."
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
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <Button 
              size="lg" 
              disabled={selectedImages.length === 0}
              asChild
            >
              <Link href="/assessment/step2">Next Step</Link>
            </Button>
            {selectedImages.length === 0 && <p className="text-sm text-muted-foreground mt-2">Please select at least one image to proceed.</p>}
          </div>
        </div>
      </div>
    </>
  );
}

    