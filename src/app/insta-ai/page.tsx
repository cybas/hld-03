
'use client';

import { useState, useRef, useEffect, type FC } from 'react';
import Link from 'next/link'; // Added for Link component
import { Pill, ShoppingBag, CalendarDays, Sparkles, ClipboardList, FileText, BookOpen, ShieldCheck } from 'lucide-react';
import { ChatShell } from '@/components/chat/chat-shell'; // Ensure this path is correct

// Helper for chip background colors (if still needed for chips, otherwise can be removed if chips are gone or styled differently)
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
  action: string; // Can be a chat prompt or a URL
  isLink?: boolean;
}

const featureChipsData: FeatureChipData[] = [
  { name: 'Treatment Plans', IconComponent: Pill, color: '#F6A34B', action: "Tell me about treatment plans" },
  { name: 'Product Finder', IconComponent: ShoppingBag, color: '#F56C6C', action: "Help me find hair products" },
  { name: 'Book Consultation', IconComponent: CalendarDays, color: '#F6C14B', action: "/assessment/step1", isLink: true },
  { name: 'Ingredient Checker', IconComponent: Sparkles, color: '#F64BC1', action: "Check this ingredient: " },
  { name: 'Hair-Care Tips', IconComponent: ClipboardList, color: '#4BB7F6', action: "Give me hair care tips" },
  { name: 'Diagnosis History', IconComponent: FileText, color: '#9A6AF6', action: "Show my diagnosis history" },
  { name: 'FAQs', IconComponent: BookOpen, color: '#F6B94B', action: "Show me FAQs" },
  { name: 'Scalp Care Guide', IconComponent: ShieldCheck, color: '#4BE0A0', action: "Tell me about scalp care" },
];

// Minimalist hair follicle SVG
const HairFollicleSVG = () => (
  <svg width="100" height="100" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
    <path d="M10 19C12.2091 19 14 17.2091 14 15V12H12V15C12 16.1046 11.1046 17 10 17C8.89543 17 8 16.1046 8 15V12H6V15C6 17.2091 7.79086 19 10 19Z" fill="currentColor"/>
    <path d="M11 1H9V12H11V1Z" fill="currentColor"/>
    <rect x="7" y="11" width="6" height="2" rx="1" fill="currentColor"/>
  </svg>
);


export default function HairLossLandingPage() {
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
    // Note: Chat will start when "Start Hair-Loss Assessment" is clicked after role selection
  };

  const handleStartChatting = () => {
    if (!userType) {
        // Optionally, add some user feedback here like a toast
        alert("Please select your role first (Doctor, Patient, or Other).");
        return;
    }
    setChatStarted(true);
  };
  
  // This function is for the feature chips to directly start a chat with a predefined message
  // It requires the ChatShell to be able to accept an initial user message.
  // For now, feature chips will be disabled once chat starts.
  const sendQuickAction = (actionText: string) => {
    if (!userType) {
      alert("Please select your role first to use quick actions.");
      return;
    }
    if (!chatStarted) {
      setInitialGreeting(greet[userType] + `\n\nUser: ${actionText}`); // Prepend user action to greeting
      setChatStarted(true);
    } else {
      // If chat is already started, this functionality would need to be passed down to ChatShell
      // For simplicity now, we'll assume ChatShell handles new messages post-initialization.
      // This might require ChatShell to expose a method or prop to inject a message.
      // As a temporary measure, this alert shows it would need more complex state management.
      alert(`This action ('${actionText}') would be sent to the active chat. This needs further implementation if chat is already active.`);
    }
  };


  if (chatStarted && userType) {
    return <ChatShell userType={userType} initialGreeting={initialGreeting} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-indigo-50/20 bg-[radial-gradient(ellipse_120%_90%_at_50%_0%,_white_0%,_rgba(250,250,255,0.7)_100%)]">
      {/* Global SiteHeader will be rendered by layout.tsx */}

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
        
        {/* Primary CTA */}
        <button
          onClick={handleStartChatting}
          disabled={!userType}
          className={`mb-8 px-8 py-3.5 rounded-xl font-semibold text-lg shadow-md
                      transition-all duration-150 ease-out hover:scale-105 active:scale-95
                      ${userType ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                 : 'bg-indigo-300 text-indigo-100 cursor-not-allowed opacity-80'}`}
        >
          Start Chatting with AI
        </button>

        {/* Role-selection row */}
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
        
        {/* Feature chips grid (visible only if chat hasn't started) */}
        {!chatStarted && (
           <div className="w-full max-w-3xl">
             <p className="text-center text-indigo-700/80 font-medium mb-5 text-sm">Or explore common topics:</p>
             <div className="sm:grid sm:grid-cols-[repeat(auto-fit,minmax(170px,1fr))] sm:gap-3 md:gap-4 
                             block space-y-3 sm:space-y-0 
                             sm:max-h-none max-h-[260px] overflow-y-auto sm:overflow-visible no-scrollbar pb-2">
              {featureChipsData.map((chip) => {
                  const chipStyle = {
                    borderColor: chip.color,
                    color: chip.color, 
                    backgroundColor: hexToRgba(chip.color, 0.04),
                  };
                  // Use a darker text for better contrast on the very light chip backgrounds.
                  const textStyle = { color: '#4B5563' }; // slate-700 from Tailwind
                  const hoverStyle = {
                    backgroundColor: hexToRgba(chip.color, 0.1),
                    transform: 'scale(1.05)',
                  };
                  
                  const chipClasses = "flex items-center justify-center h-11 px-3 py-2 rounded-full border transition-all duration-150 ease-out cursor-pointer w-full sm:w-auto";

                  const ChipContent = () => (
                    <>
                      <chip.IconComponent className="w-5 h-5 mr-1.5 sm:mr-2 flex-shrink-0" style={{ color: chip.color }} />
                      <span className="font-medium text-xs sm:text-sm leading-tight opacity-90" style={textStyle}>{chip.name}</span>
                    </>
                  );
                  
                  if (chip.isLink) {
                    return (
                      <Link href={chip.action} key={chip.name} legacyBehavior>
                        <a 
                          className={chipClasses}
                          style={chipStyle}
                          onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = chipStyle.backgroundColor} // Reset only background on leave
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
                      className={chipClasses}
                      style={chipStyle}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = chipStyle.backgroundColor}
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
