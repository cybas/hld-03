
'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { Pill, ShoppingBag, CalendarDays, Sparkles, ClipboardList, FileText, BookOpen, ShieldCheck } from 'lucide-react';

// Helper for chip background colors
const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#') || (hex.length !== 4 && hex.length !== 7)) {
    // console.warn('Invalid hex color provided to hexToRgba:', hex);
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


const featureChipsData = [
  // "Hair-Loss Assessment" chip removed as per earlier request.
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


export default function HairLossLanding() {
  /* ─── state additions (top of component) ─── */
  const [userType, setUserType] = useState<string | null>(null);   // 'doctor' | 'patient' | 'other'
  const [chatStarted, setChatStarted] = useState(false);
  const [history, setHistory] = useState<{who: string, text: string}[]>([]);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  /* ─── canned greetings ─── */
  const greet: Record<string, string> = {
    doctor : 'Hello colleague! Ready to discuss hair-loss cases and protocols.',
    patient: 'Hi there! Let’s talk about your hair health and solutions.',
    other  : 'Hello! What would you like to know about hair loss?'
  };

  /* ─── helpers ─── */
  const selectRole = (role: string) => setUserType(role);

  const startAssessment = () => {
    if (!userType || chatStarted) return;          // force role first
    setChatStarted(true);
    setHistory([{ who: 'ai', text: greet[userType as string] }]);
  };

  const send = async () => {
    if (!draft.trim() || !userType) return; // Also ensure userType is selected
    const msg = draft.trim();
    setHistory((h) => [...h, { who: 'user', text: msg }]);
    setDraft('');

    try {
      const r = await fetch('/api/general-chat', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ message: msg, userType })
      });
      const { response } = await r.json();
      // Basic formatting for AI response (mostly handled by Bedrock)
      const formattedResponse = response
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^- /gm, '• ')
        .replace(/\n/g, '<br>');
      setHistory((h) => [...h, { who: 'ai', text: formattedResponse }]);
    } catch {
      setHistory((h) => [...h, { who: 'ai', text: 'Sorry, something went wrong.' }]);
    }
  };
  
  const sendQuickAction = async (actionText: string) => {
    if (!userType) { 
      // Optionally prompt user to select a role first, or auto-select 'patient'
      // For now, let's assume they need to pick a role before quick actions
      alert("Please select your role first (Doctor, Patient, or Other).");
      return;
    }
    if (!chatStarted) {
      setChatStarted(true);
      setHistory([{ who: 'ai', text: greet[userType as string] }]); // Start chat with greeting
    }

    setHistory((h) => [...h, { who: 'user', text: actionText }]);
    try {
      const r = await fetch('/api/general-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: actionText, userType })
      });
      const { response } = await r.json();
      const formattedResponse = response
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^- /gm, '• ')
        .replace(/\n/g, '<br>');
      setHistory((h) => [...h, { who: 'ai', text: formattedResponse }]);
    } catch (err){
      console.error('Quick action chat error:', err);
      setHistory((h) => [
        ...h,
        { who: 'ai', text: 'Sorry, something went wrong processing that action.' }
      ]);
    }
  };


  /* scroll on new message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  /* ───────── UI ──────────── */
  return (
    <div className="min-h-screen flex flex-col items-center bg-indigo-50/20 bg-[radial-gradient(ellipse_120%_90%_at_50%_0%,_white_0%,_rgba(250,250,255,0.7)_100%)]">
      {/* ── NAVBAR (Sticky) ── */}
      <header className="w-full flex items-center justify-between px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <Link href="/insta-ai" className="flex items-center gap-2 font-bold text-indigo-700">
          {/* Replace with AiTrichologistIconHeader if available or similar SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M12 8V4H8"/>
            <rect x="4" y="4" width="16" height="16" rx="2"/>
            <path d="M12 12h.01M16 12h.01M8 12h.01M12 16h.01M16 16h.01M8 16h.01"/>
            <path d="M9 20v-2h6v2"/>
            <circle cx="9" cy="10" r="0.5" fill="currentColor"/>
            <circle cx="15" cy="10" r="0.5" fill="currentColor"/>
            <path d="M12 6.5V9.5M10.5 8H13.5"/>
          </svg>
          HairlossDoctor.AI
        </Link>
        <nav className="space-x-3 sm:space-x-6">
          <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600">Login</a>
          <a href="#" className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm hover:bg-indigo-700 transition-colors">Sign Up</a>
        </nav>
      </header>

      {/* ── HERO SECTION ── */}
      <main className="w-full flex flex-col items-center px-4 pt-12 pb-12 flex-grow">
        <div className="relative">
          <HairFollicleSVG />
          <span className="text-4xl relative z-10">🤖</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-indigo-800 text-center relative z-10">
          Hello, I’m HairlossDoctor.AI
        </h1>
        <p className="mt-2 text-gray-600 text-center relative z-10">
          Your personal AI trichologist—how can I help you today?
        </p>

        {/* ① Chat card */}
        <div className="w-full max-w-xl mt-12 bg-white/70 border border-gray-200 rounded-2xl shadow-md backdrop-blur-sm flex flex-col">
          {/* message list (visible after chat starts) */}
          {chatStarted && (
            <div className="max-h-72 overflow-y-auto flex flex-col gap-3 p-5">
              {history.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] text-sm leading-relaxed px-4 py-2 rounded-2xl
                              ${m.who === 'user'
                                ? 'ml-auto bg-indigo-50 text-gray-900'
                                : 'mr-auto bg-indigo-600 text-white'}`}
                  dangerouslySetInnerHTML={{ __html: m.text }} // Render basic HTML from AI
                >
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}

          {/* input row */}
          <div className={`flex items-center gap-3 p-5 ${chatStarted ? 'pt-3 border-t border-gray-100' : 'pt-5'}`}>
            <input
              className="flex-1 bg-transparent placeholder-gray-400 focus:outline-none"
              placeholder="Ask me anything about hair-loss care…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              disabled={!chatStarted}
            />
            <button
              onClick={send}
              disabled={!chatStarted || !draft.trim()}
              className="p-2 rounded-full bg-indigo-600 text-white disabled:opacity-40"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>

        {/* ② CTA + role pills */}
        {/* primary CTA – goes live once a role is picked */}
        {!chatStarted && (
            <button
            onClick={startAssessment}
            disabled={!userType}
            className={`mt-8 px-8 py-3 rounded-xl font-semibold transition-all duration-150 ease-out
                        hover:scale-105
                        ${userType ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-indigo-200 text-indigo-500 cursor-not-allowed opacity-70'}`}
            >
            Start Chatting with AI
            </button>
        )}

        {/* role-selection row */}
        {!chatStarted && (
            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
            <button
                onClick={() => selectRole('doctor')}
                className={`flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-white font-semibold
                            bg-indigo-600 transition-all duration-150 ease-out hover:scale-105 hover:bg-indigo-700
                            ${userType === 'doctor' ? 'ring-2 ring-offset-2 ring-indigo-400 ring-offset-indigo-50/20' : 'ring-1 ring-inset ring-white/20'}`}
            >
                👨‍⚕️ Doctor
            </button>

            <button
                onClick={() => selectRole('patient')}
                className={`flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-white font-semibold
                            bg-emerald-500 transition-all duration-150 ease-out hover:scale-105 hover:bg-emerald-600
                            ${userType === 'patient' ? 'ring-2 ring-offset-2 ring-emerald-300 ring-offset-indigo-50/20' : 'ring-1 ring-inset ring-white/20'}`}
            >
                🧑‍🦱 Patient
            </button>

            <button
                onClick={() => selectRole('other')}
                className={`flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-white font-semibold
                            bg-violet-500 transition-all duration-150 ease-out hover:scale-105 hover:bg-violet-600
                            ${userType === 'other' ? 'ring-2 ring-offset-2 ring-violet-300 ring-offset-indigo-50/20' : 'ring-1 ring-inset ring-white/20'}`}
            >
                👤 Other
            </button>
            </div>
        )}
        
        {/* Feature chips grid (visible only if chat hasn't started) */}
        {!chatStarted && (
          <div className="mt-10 w-full max-w-3xl">
            <div className="sm:grid sm:grid-cols-[repeat(auto-fit,minmax(170px,1fr))] sm:gap-3 md:gap-4 
                            block space-y-3 sm:space-y-0 
                            sm:max-h-none max-h-[200px] overflow-y-auto sm:overflow-visible no-scrollbar"> {/* Horizontal scroll for mobile, grid for larger */}
              {featureChipsData.map((chip) => {
                const chipStyle = {
                  borderColor: chip.color,
                  color: chip.color, // Icon and border color
                  backgroundColor: hexToRgba(chip.color, 0.04),
                };
                const textStyle = { color: '#4B5563' }; // slate-700 for text for contrast
                const hoverStyle = {
                   backgroundColor: hexToRgba(chip.color, 0.1),
                };
                const ChipContent = () => (
                  <>
                    <chip.IconComponent className="w-5 h-5 mr-1.5 sm:mr-2 flex-shrink-0" style={{ color: chip.color }} />
                    <span className="font-medium text-xs sm:text-sm opacity-90" style={textStyle}>{chip.name}</span>
                  </>
                );

                const chipClasses = "flex items-center justify-center h-11 px-3 rounded-full border transition-all duration-150 ease-out hover:scale-105 cursor-pointer w-full sm:w-auto text-left";
                
                if (chip.isLink) {
                  return (
                    <Link href={chip.action} key={chip.name} legacyBehavior>
                      <a 
                        className={chipClasses}
                        style={chipStyle}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = chipStyle.backgroundColor}
                      >
                        <ChipContent />
                      </a>
                    </Link>
                  );
                }
                return (
                  <div // Changed to div for consistent styling behavior
                    key={chip.name}
                    onClick={() => sendQuickAction(chip.action)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && sendQuickAction(chip.action)}
                    className={chipClasses}
                    style={chipStyle}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
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

