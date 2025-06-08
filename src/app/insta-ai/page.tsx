
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Pill, ShoppingBag, CalendarDays, Sparkles, ClipboardList, FileText, BookOpen, ShieldCheck } from 'lucide-react';

const RolePill = ({ label, value, color, emoji, onSelect }: { label: string, value: string, color: string, emoji: string, onSelect: (value: string) => void }) => (
  <button
    onClick={() => onSelect(value)}
    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold
                transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 ${color}`}
  >
    <span className="text-xl">{emoji}</span> {label}
  </button>
);

const featureChipsData = [
  { name: 'Treatment Plans', IconComponent: Pill, color: '#F6A34B', action: "Tell me about treatment plans" },
  { name: 'Product Finder', IconComponent: ShoppingBag, color: '#F56C6C', action: "Help me find hair products" },
  { name: 'Book Consultation', IconComponent: CalendarDays, color: '#F6C14B', action: "/assessment/step1", isLink: true },
  { name: 'Ingredient Checker', IconComponent: Sparkles, color: '#F64BC1', action: "Check this ingredient: " },
  { name: 'Hair-Care Tips', IconComponent: ClipboardList, color: '#4BB7F6', action: "Give me hair care tips" },
  { name: 'Diagnosis History', IconComponent: FileText, color: '#9A6AF6', action: "Show my diagnosis history" },
  { name: 'FAQs', IconComponent: BookOpen, color: '#F6B94B', action: "Show me FAQs" },
  { name: 'Scalp Care Guide', IconComponent: ShieldCheck, color: '#4BE0A0', action: "Tell me about scalp care" },
];

const hexToRgba = (hex: string, alpha: number) => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
    console.warn('Invalid hex color provided to hexToRgba:', hex);
    return `rgba(0,0,0,${alpha})`; // Fallback color
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function HairLossLanding() {
  /* ───────── state ───────── */
  const [userType, setUserType] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<{ sender: string, text: string }[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  /* ───────── effects ─────── */
  useEffect(() => {
    if (userType && chatHistory.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, userType]);

  /* ───────── helpers ─────── */
  const welcomeMessages: Record<string, string> = {
    doctor: 'Hello colleague! Ready to discuss hair-loss cases and protocols.',
    patient: 'Hi there! Ask me anything about hair loss in simple terms.',
    other: 'Hello! What would you like to know about hair loss?'
  };

  const chooseRole = (role: string) => {
    setUserType(role);
    setChatHistory([{ sender: 'ai', text: welcomeMessages[role] }]);
  };

  const sendQuickAction = async (actionText: string) => {
    if (!userType) return;
    setChatHistory((h) => [...h, { sender: 'user', text: actionText }]);
    try {
      const r = await fetch('/api/general-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: actionText, userType })
      });
      const { response } = await r.json();
      setChatHistory((h) => [...h, { sender: 'ai', text: response }]);
    } catch (err) {
      console.error('Quick action chat error:', err);
      setChatHistory((h) => [
        ...h,
        { sender: 'ai', text: 'Sorry, something went wrong processing that action.' }
      ]);
    }
  };
  
  const sendMessage = async () => {
    if (!input.trim() || !userType) return;
    const text = input.trim();
    setChatHistory((h) => [...h, { sender: 'user', text }]);
    setInput('');
    try {
      const r = await fetch('/api/general-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, userType })
      });
      const { response } = await r.json();
      setChatHistory((h) => [...h, { sender: 'ai', text: response }]);
    } catch (err){
      console.error('Chat send error:', err);
      setChatHistory((h) => [
        ...h,
        { sender: 'ai', text: 'Sorry, something went wrong.' }
      ]);
    }
  };

  /* ───────── UI ──────────── */
  return (
    <div className="min-h-screen flex flex-col items-center bg-indigo-50/20">
      {/* ── NAVBAR ── */}
      <header className="w-full flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <Link href="/insta-ai" className="flex items-center gap-2 font-bold text-indigo-700">
          <span className="text-2xl">📋</span> HairlossDoctor.AI
        </Link>
        <nav className="space-x-6">
          <a href="#" className="text-sm text-gray-600 hover:text-indigo-600">Login</a>
          <a href="#" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition-colors">Sign Up</a>
        </nav>
      </header>

      {/* ── HERO SECTION ── */}
      <main className="w-full flex flex-col items-center px-4 pt-12 pb-12 flex-grow">
        <span className="text-4xl">🤖</span>
        <h1 className="mt-4 text-3xl font-bold text-indigo-800 text-center">
          Hello, I’m HairlossDoctor.AI
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          Your personal AI trichologist—how can I help you today?
        </p>

        {/* chat input card & history (only show when role chosen) */}
        <div className="w-full max-w-xl mt-10">
          {userType && (
            <>
              <div className="flex flex-col gap-3 bg-white/80 border border-gray-200 rounded-2xl shadow-lg p-4 backdrop-blur-sm">
                <input
                  className="w-full border-none focus:outline-none placeholder-gray-500 bg-transparent p-2 text-sm"
                  placeholder="Ask me anything about hair-loss care…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 text-sm">
                    <span 
                      onClick={() => sendQuickAction('Tell me about Hair Scan')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-300/70 text-indigo-700 cursor-pointer hover:bg-indigo-100/70 transition-colors"
                    >
                      🔍 Hair Scan
                    </span>
                    <span 
                      onClick={() => sendQuickAction('Suggest some Routine Ideas')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-300/70 text-indigo-700 cursor-pointer hover:bg-indigo-100/70 transition-colors"
                    >
                      💡 Routine Ideas
                    </span>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="p-2.5 h-9 w-9 flex items-center justify-center rounded-full bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                    aria-label="Send message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
                </div>
              </div>

              {/* chat history */}
              <div className="mt-6 space-y-3 max-h-[50vh] overflow-y-auto pb-4 pr-1"> {/* Added pr-1 for scrollbar space */}
                {chatHistory.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] px-4 py-2.5 rounded-xl text-sm leading-relaxed shadow-sm
                                ${m.sender === 'user'
                                  ? 'ml-auto bg-indigo-100 text-indigo-900'
                                  : 'mr-auto bg-indigo-600 text-white'}`}
                  >
                    {m.text}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </>
          )}
        </div>

        {/* primary CTA (still visible even if role chosen) */}
        {!userType && (
            <Link href="/assessment/step1" legacyBehavior>
              <a className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 hover:scale-105 transition-transform duration-150 ease-out">
                Start Hair-Loss Assessment
              </a>
            </Link>
        )}
        

        {/* feature chips grid (only show if role NOT chosen) */}
       {!userType && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mt-10 max-w-3xl w-full">
            {featureChipsData.map((chip) => {
              const chipStyle = {
                borderColor: chip.color,
                color: chip.color,
                backgroundColor: hexToRgba(chip.color, 0.04),
              };
              const hoverStyle = {
                 backgroundColor: hexToRgba(chip.color, 0.1),
              };
              const ChipContent = () => (
                <>
                  <chip.IconComponent className="w-5 h-5 mr-2" style={{ color: chip.color }} />
                  <span className="font-medium text-sm" style={{ color: chip.color }}>{chip.name}</span>
                </>
              );

              const chipClasses = "flex items-center justify-center h-11 px-3 rounded-full border transition-all duration-150 ease-out hover:scale-105 cursor-pointer";

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
                <button
                  key={chip.name}
                  onClick={() => sendQuickAction(chip.action)}
                  className={chipClasses}
                  style={chipStyle}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = chipStyle.backgroundColor}
                >
                  <ChipContent />
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* ── ROLE-SELECTION MODAL ── */}
      {!userType && (
        <div className="fixed inset-0 bg-slate-300/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 w-full max-w-md text-center">
            <h2 className="text-xl font-semibold text-indigo-700 mb-6">
              Tell me who you are:
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <RolePill
                label="Doctor"
                value="doctor"
                emoji="👨‍⚕️"
                color="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400"
                onSelect={chooseRole}
              />
              <RolePill
                label="Patient"
                value="patient"
                emoji="🧑‍🦱"
                color="bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-300"
                onSelect={chooseRole}
              />
              <RolePill
                label="Other"
                value="other"
                emoji="👤"
                color="bg-violet-500 hover:bg-violet-600 focus:ring-violet-300"
                onSelect={chooseRole}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
