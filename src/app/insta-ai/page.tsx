'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ChatShell from '@/components/chat/chat-shell';

import {
  Pill,
  ShoppingBag,
  Sparkles,
  ClipboardList,
  FileText,
  BookOpen,
  ShieldCheck,
  CalendarDays,
} from 'lucide-react';

/* ---------------------------------- */
/* 1 ▸ helper — rgba from hex         */
/* ---------------------------------- */
const hexToRgba = (hex, alpha) => {
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(hex)) return `rgba(0,0,0,${alpha})`;
  const h = hex.length === 4
    ? hex.replace(/#/,'').split('').map(c => c+c).join('')
    : hex.slice(1);
  const [r, g, b] = [0,2,4].map(i=>parseInt(h.slice(i,i+2),16));
  return `rgba(${r},${g},${b},${alpha})`;
};

/* ---------------------------------- */
/* 2 ▸ feature-chip data              */
/* ---------------------------------- */
const chips = [
  { name:'Treatment Plans',    Icon:Pill,          color:'#F6A34B', action:'Tell me about treatment plans' },
  { name:'Product Finder',     Icon:ShoppingBag,   color:'#F56C6C', action:'Help me find hair products'   },
  { name:'Ingredient Checker', Icon:Sparkles,      color:'#F64BC1', action:'Check this ingredient: '     },
  { name:'Hair-Care Tips',     Icon:ClipboardList, color:'#4BB7F6', action:'Give me hair care tips'       },
  { name:'Diagnosis History',  Icon:FileText,      color:'#9A6AF6', action:'Show my diagnosis history'    },
  { name:'FAQs',               Icon:BookOpen,      color:'#F6B94B', action:'Show me FAQs'                 },
  { name:'Scalp Care Guide',   Icon:ShieldCheck,   color:'#4BE0A0', action:'Tell me about scalp care'     },
  { name:'Book Consultation',  Icon:CalendarDays,  color:'#F6C14B', action:'/assessment/step1', isLink:true},
];

/* ---------------------------------- */
/* 3 ▸ landing page                   */
/* ---------------------------------- */
export default function InstaAI() {
  const [role, setRole] = useState(null);          // 'doctor' | 'patient' | 'other'
  const [started, setStarted] = useState(false);
  const [greeting, setGreeting] = useState('');

  const greet = {
    doctor : 'Hello colleague! Ready to discuss hair-loss cases and protocols.',
    patient: 'Hi there! Let’s talk about your hair health and solutions.',
    other  : 'Hello! What would you like to know about hair loss?'
  };

  /* ----- role select ----- */
  const pick = r => { setRole(r); setGreeting(greet[r]); };

  /* ----- launch chat ----- */
  const begin = () => {
    if (!role) return alert('Please choose Doctor / Patient / Other first.');
    setStarted(true);
  };

  /* ----- quick chip action ----- */
  const quick = txt => {
    if (!role) return alert('Choose a role first.');
    setGreeting(`${greet[role]}\n\nUSER_ACTION: ${txt}`);
    setStarted(true);
  };

  /* chat page */
  if (started && role) {
    return <ChatShell userType={role} initialGreeting={greeting} />;
  }

  /* ---------- landing markup ---------- */
  return (
    <div className="min-h-screen flex flex-col items-center bg-indigo-50/20
                    bg-[radial-gradient(ellipse_120%_90%_at_50%_0%,_white_0%,_rgba(250,250,255,0.7)_100%)]">
      <main className="flex flex-col items-center w-full px-4 pt-12 pb-16 flex-grow">
        {/* emoji + headline */}
        <span className="text-4xl">🤖</span>
        <h1 className="mt-4 text-3xl font-bold text-indigo-800 text-center">
          Hello, I’m HairlossDoctor.AI
        </h1>
        <p className="mt-2 text-gray-600 text-center mb-10">
          Your personal AI trichologist—how can I help you today?
        </p>

        {/* CTA */}
        <Link href="/assessment/step1">
 <button
 className={cn(
 'mb-2 px-8 py-3.5 rounded-xl font-semibold text-lg shadow-md transition',
 'bg-[#6A4BF6] text-white hover:scale-105 active:scale-95'
 )}
 >
          Start Hair-Loss Assessment
        </button>
 </Link>
 <button
 onClick={begin}
 disabled={!role}
 className={cn('mb-10 px-8 py-3.5 rounded-xl font-semibold text-lg shadow-md transition', role ? 'bg-[#6A4BF6] text-white hover:scale-105 active:scale-95' : 'bg-[#6A4BF6]/30 text-white/60 cursor-not-allowed')}
 >
 Start Chatting with AI
 </button>


        {/* role pills */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {['doctor','patient','other'].map(r => (
            <button
              key={r}
              onClick={() => pick(r)}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition hover:scale-105',
                r==='doctor' ? 'bg-[#6A4BF6]'
                : r==='patient' ? 'bg-emerald-500'
                : 'bg-violet-500',
                role===r && 'ring-4 ring-offset-2 ring-white/30 scale-105'
              )}
            >
              {r==='doctor' ? '👨‍⚕️' : r==='patient' ? '🧑‍🦱' : '👤'} {r[0].toUpperCase()+r.slice(1)}
            </button>
          ))}
        </div>

        {/* feature chips */}
        <p className="text-center text-indigo-700/80 font-medium mb-5 text-sm">
          Or explore common topics:
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(176px,1fr))] gap-3 max-w-3xl">
          {chips.map(ch => {
            /* ------------- per-chip styles ------------- */
            const pillBase =
              'w-44 h-14 inline-flex flex-col items-center justify-center gap-1 rounded-full ' +
              'border text-sm font-medium transition hover:scale-105 text-center leading-tight';
            const baseStyle  = {
              borderColor: ch.color,
              backgroundColor: hexToRgba(ch.color,0.04),
            };
            const hoverBg    = { backgroundColor: hexToRgba(ch.color, 0.10) };

            /* ------------- pill element ------------- */
            const Pill = (
              <span
                className={pillBase}
                style={baseStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, hoverBg)}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = baseStyle.backgroundColor}
              >
                <ch.Icon className="w-5 h-5 shrink-0" style={{ color: ch.color }} />
                {/* 2-line label for Ingredient Checker */}
                {ch.name === 'Ingredient Checker'
                  ? 'Ingredient\nChecker'
                  : ch.name}
              </span>
            );

            /* ------------- link vs. button ------------- */
            return (
              <button key={ch.name} onClick={() => quick(ch.action)}>
                {Pill}
              </button>
            )})}
        </div>
      </main>
    </div>
  );
}