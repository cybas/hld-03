
'use client';

import { useState, useRef, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/* 1 ▸ Utility components                                             */
/* ------------------------------------------------------------------ */

const PillButton = ({ label, color, icon, onClick }: {label: string, color: string, icon: string, onClick: () => void}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold
                transition-transform duration-150 hover:scale-105 ${color}`}
  >
    <span className="text-xl">{icon}</span>
    {label}
  </button>
);

const MessageBubble = ({ sender, text }: {sender: string, text: string}) => (
  <div
    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed
                ${sender === 'user'
                  ? 'ml-auto bg-indigo-50 text-gray-900'
                  : 'mr-auto bg-indigo-600 text-white'}`}
  >
    {text}
  </div>
);

/* ------------------------------------------------------------------ */
/* 2 ▸ Main page component                                            */
/* ------------------------------------------------------------------ */

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export default function InstaAIPage() {
  /* ----- state ----- */
  const [userType, setUserType] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  /* ----- side-effects ----- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  /* ----- helpers ----- */
  const welcome: Record<string, string> = {
    doctor:
      "Hello colleague! I'm ready to discuss hair-loss cases, treatment protocols, and clinical considerations. How can I help?",
    patient:
      "Hi there! I can explain hair-loss causes in plain language and walk you through evidence-based options. Ask me anything!",
    other: "Hello! What would you like to know about hair loss?"
  };

  const handleRoleSelect = (role: string) => {
    setUserType(role);
    setChatHistory([{ sender: 'ai', text: welcome[role] }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !userType) return;

    const userText = input.trim();
    setChatHistory((h) => [...h, { sender: 'user', text: userText }]);
    setInput('');

    try {
      const r = await fetch('/api/general-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, userType })
      });
      const { response } = await r.json();
      // It's good practice to ensure response is a string
      const aiText = typeof response === 'string' ? response : 'Sorry, I received an unexpected response format.';
      setChatHistory((h) => [...h, { sender: 'ai', text: aiText }]);
    } catch (err) {
      console.error(err);
      setChatHistory((h) => [
        ...h,
        { sender: 'ai', text: 'Sorry, something went wrong.' }
      ]);
    }
  };

  /* ----- render ----- */
  return (
    <div className="min-h-screen bg-indigo-50/20 flex flex-col items-center pt-20 px-4">
      {/* ---- header ---- */}
      <h1 className="text-3xl font-bold text-indigo-700 mb-2">
        HairlossDoctor.AI
      </h1>
      <p className="text-gray-600 mb-12">
        Your personal AI trichologist. How can I help you today?
      </p>

      {/* ---- role selection or chat ---- */}
      {!userType ? (
        <section className="space-y-6 text-center">
          <h3 className="text-xl font-medium text-indigo-600">
            Tell me who you are:
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <PillButton
              label="Doctor"
              color="bg-indigo-600"
              icon="👨‍⚕️"
              onClick={() => handleRoleSelect('doctor')}
            />
            <PillButton
              label="Patient"
              color="bg-emerald-500"
              icon="🧑‍🦱"
              onClick={() => handleRoleSelect('patient')}
            />
            <PillButton
              label="Other"
              color="bg-violet-500"
              icon="👤"
              onClick={() => handleRoleSelect('other')}
            />
          </div>
        </section>
      ) : (
        <>
          {/* ---- chat history ---- */}
          <div className="w-full max-w-xl flex flex-col gap-4 mb-6 overflow-y-auto flex-grow">
            {chatHistory.map((m, i) => (
              <MessageBubble key={i} sender={m.sender} text={m.text} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* ---- input bar ---- */}
          <div className="w-full max-w-xl flex gap-2 sticky bottom-0 bg-indigo-50/20 py-4">
            <input
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ask me about hair loss..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40 transition-colors"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
