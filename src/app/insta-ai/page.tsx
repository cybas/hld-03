
'use client';

import { useState, useRef, useEffect, type FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils'; // Ensure cn is imported
import { ChatShell } from '@/components/chat/chat-shell'; // Assuming ChatShell is correctly placed
import { Pill, ShoppingBag, Sparkles, ClipboardList, FileText, BookOpen, ShieldCheck } from 'lucide-react'; // Added ShieldCheck

// Helper for chip background colors
const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#') || (hex.length !== 4 && hex.length !== 7)) {
    return `rgba(0,0,0,${alpha})`; // Fallback color
  }
  let r, g, b;
  if (hex.length === 4) { // #RGB format
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else { // #RRGGBB format
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface FeatureChipData {
  name: string;
  IconComponent: React.ElementType;
  color: string;
  action: string;
  isLink?: boolean;
}

const featureChipsData: FeatureChipData[] = [
  { name: 'Treatment Plans', IconComponent: Pill, color: '#F6A34B', action: "Tell me about treatment plans" },
  { name: 'Product Finder', IconComponent: ShoppingBag, color: '#F56C6C', action: "Help me find hair products" },
  { name: 'Ingredient Checker', IconComponent: Sparkles, color: '#F64BC1', action: "Check this ingredient: " },
  { name: 'Hair-Care Tips', IconComponent: ClipboardList, color: '#4BB7F6', action: "Give me hair care tips" },
  { name: 'Diagnosis History', IconComponent: FileText, color: '#9A6AF6', action: "Show my diagnosis history" },
  { name: 'FAQs', IconComponent: BookOpen, color: '#F6B94B', action: "Show me FAQs" },
  { name: 'Scalp Care Guide', IconComponent: ShieldCheck, color: '#4BE0A0', action: "Tell me about scalp care" },
  { name: 'Book Consultation', IconComponent: Pill /* Placeholder, consider CalendarDays */, color: '#F6C14B', action: "/assessment/step1", isLink: true },
];


// Minimalist hair follicle SVG
const HairFollicleSVG = () => (
  <svg width="100" height="100" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
    <path d="M10 19C12.2091 19 14 17.2091 14 15V12H12V15C12 16.1046 11.1046 17 10 17C8.89543 17 8 16.1046 8 15V12H6V15C6 17.2091 7.79086 19 10 19Z" fill="currentColor"/>
    <path d="M11 1H9V12H11V1Z" fill="currentColor"/>
    <rect x="7" y="11" width="6" height="2" rx="1" fill="currentColor"/>
  </svg>
);

interface Message {
  who: 'user' | 'ai';
  text: string;
}

export default function InstaAIPage() {
  const [userType, setUserType] = useState<'doctor' | 'patient' | 'other' | null>(null);
  const [chatStarted, setChatStarted] = useState(false);
  const [initialGreeting, setInitialGreeting] = useState('');

  const greet = {
    doctor : 'Hello colleague! Ready to discuss hair-loss cases and protocols.',
    patient: 'Hi there! Let’s talk about your hair health and solutions.',
    other  : 'Hello! What would you like to know about hair loss?'
  };

  const selectRole = (role: 'doctor' | 'patient' | 'other') => {
    setUserType(role);
    setInitialGreeting(greet[role]);
    // If chat is already started, this selection might just change context for next message,
    // or we might want to reset chat. For now, it just sets userType for future messages.
  };

  const handleStartChatting = () => {
    if (!userType) {
        alert("Please select your role first (Doctor, Patient, or Other).");
        return;
    }
    setChatStarted(true);
  };
  
  // Function for feature chips/pills to start a chat
  // This will now pass the actionText to ChatShell via initialGreeting if chat hasn't started
  const sendQuickAction = (actionText: string) => {
    if (!userType) {
      alert("Please select your role first to use quick actions.");
      return;
    }
    // If chat is not started, set this as the initial prompt for ChatShell
    // ChatShell's useEffect for initialGreeting will handle sending this first.
    setInitialGreeting(greet[userType] + `\n\nUSER_ACTION: ${actionText}`);
    setChatStarted(true); 
  };


  if (chatStarted && userType) {
    return <ChatShell userType={userType} initialGreeting={initialGreeting} />;
  }
  
  // Base classes for feature chips
  const chipClasses = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 ease-out cursor-pointer hover:scale-105";

  return (
    <div className="min-h-screen flex flex-col items-center bg-indigo-50/20 bg-[radial-gradient(ellipse_120%_90%_at_50%_0%,_white_0%,_rgba(250,250,255,0.7)_100%)]">
      <main className="w-full flex flex-col items-center px-4 pt-12 pb-12 flex-grow">
        <div className="relative">
          <HairFollicleSVG />
          <span className="text-4xl relative z-10">🤖</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-indigo-800 text-center relative z-10">
          Hello, I’m HairlossDoctor.AI
        </h1>
        <p className="mt-2 text-gray-600 text-center relative z-10 mb-10">
          Your personal AI trichologist—how can I help you today?
        </p>
        
        <button
          onClick={handleStartChatting}
          className={`mb-8 px-8 py-3.5 rounded-xl font-semibold text-lg shadow-md
                      transition-all duration-150 ease-out hover:scale-105 active:scale-95
                      ${userType ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                 : 'bg-indigo-300 text-indigo-100 cursor-not-allowed opacity-80'}`}
        >
          Start Chatting with AI
        </button>

        <div className="mb-12 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
          <p className="text-sm font-medium text-indigo-700 mr-2 hidden sm:block">I am a:</p>
          <button
            onClick={() => selectRole('doctor')}
            className={`flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-white font-semibold
                        bg-indigo-600 transition-all duration-150 ease-out hover:scale-[1.03] hover:shadow-lg active:scale-95
                        ${userType === 'doctor' ? 'ring-4 ring-offset-2 ring-indigo-400 ring-offset-indigo-50/20 shadow-xl scale-[1.02]' : 'ring-1 ring-inset ring-white/30'}`}
          >
            <span role="img" aria-label="doctor emoji" className="text-xl">👨‍⚕️</span> Doctor
          </button>

          <button
            onClick={() => selectRole('patient')}
            className={`flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-white font-semibold
                        bg-emerald-500 transition-all duration-150 ease-out hover:scale-[1.03] hover:shadow-lg active:scale-95
                        ${userType === 'patient' ? 'ring-4 ring-offset-2 ring-emerald-300 ring-offset-indigo-50/20 shadow-xl scale-[1.02]' : 'ring-1 ring-inset ring-white/30'}`}
          >
            <span role="img" aria-label="patient emoji" className="text-xl">🧑‍🦱</span> Patient
          </button>

          <button
            onClick={() => selectRole('other')}
            className={`flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-white font-semibold
                        bg-violet-500 transition-all duration-150 ease-out hover:scale-[1.03] hover:shadow-lg active:scale-95
                        ${userType === 'other' ? 'ring-4 ring-offset-2 ring-violet-300 ring-offset-indigo-50/20 shadow-xl scale-[1.02]' : 'ring-1 ring-inset ring-white/30'}`}
          >
            <span role="img" aria-label="other user emoji" className="text-xl">👤</span> Other
          </button>
        </div>
        
         {!chatStarted && (
           <div className="w-full max-w-3xl">
             <p className="text-center text-indigo-700/80 font-medium mb-5 text-sm">Or explore common topics:</p>
             <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 pb-2 sm:grid-rows-2 sm:grid-flow-col sm:auto-cols-[minmax(140px,1fr)] sm:overflow-x-auto no-scrollbar">
              {featureChipsData.map((chip) => {
                  const chipBaseStyle = {
                    borderColor: chip.color,
                    color: chip.color, // For icon
                  };
                  const chipBgStyle = { backgroundColor: hexToRgba(chip.color, 0.04) }; // 4% fill
                  const chipHoverBgStyle = { backgroundColor: hexToRgba(chip.color, 0.1) }; // 10% fill on hover
                                    
                  const textStyle = { color: '#4B5563' }; // slate-700 for text

                  let currentChipClasses = chipClasses;
                  if (chip.name === "Ingredient Checker") {
                    currentChipClasses = cn(chipClasses, "min-w-[9.5rem]");
                  }

                  const ChipContent = () => (
                    <>
                      <chip.IconComponent className="w-5 h-5 mr-1.5 sm:mr-2 flex-shrink-0" style={{ color: chip.color }} />
                      {chip.name === "Ingredient Checker" ? (
                        <span className="block leading-tight text-center" style={textStyle}>
                          Ingredient<br/>Checker
                        </span>
                      ) : (
                        <span className="font-medium text-xs sm:text-sm opacity-90" style={textStyle}>{chip.name}</span>
                      )}
                    </>
                  );
                  
                  if (chip.isLink) {
                    return (
                      <Link href={chip.action} key={chip.name} legacyBehavior>
                        <a 
                          className={currentChipClasses}
                          style={{ ...chipBaseStyle, ...chipBgStyle }}
                          onMouseEnter={(e) => Object.assign(e.currentTarget.style, chipHoverBgStyle)}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = chipBgStyle.backgroundColor}
                        >
                          <ChipContent />
                        </a>
                      </Link>
                    );
                  }
                  return (
                    <div 
                      key={chip.name}
                      onClick={() => sendQuickAction(chip.action)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && sendQuickAction(chip.action)}
                      className={currentChipClasses}
                      style={{ ...chipBaseStyle, ...chipBgStyle }}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, chipHoverBgStyle)}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = chipBgStyle.backgroundColor}
                    >
                      <ChipContent />
                    </div>
                  );
              })}
             </div>
           </div>
        )}
      </main>
    </div>
  );
}
