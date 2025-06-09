
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Ensured next/image is imported
import { Menu, X } from 'lucide-react';

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const nav = [
    { label: 'Features',   href: '#features' },
    { label: 'Pricing',    href: '#pricing'  },
    { label: 'Blog',       href: '#blog'     },
    { label: 'FAQs',       href: '#faqs'     },
  ];

  return (
    <header className="sticky top-0 z-20 w-full bg-white/70 backdrop-blur
                       border-b border-indigo-50/70 dark:bg-[#070707]/60
                       dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between
                      px-4 sm:px-6 lg:px-8">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold
                                  text-[#6A4BF6]">
          <Image
            src="https://hld-img.s3.me-central-1.amazonaws.com/logo/HLD+Logo.png" 
            alt="HairlossDoctor.AI Logo Mark"
            width={24}
            height={24}
            className="h-6 w-6"
            data-ai-hint="brand logo"
          />
          <span className="hidden sm:inline text-gray-900
                           dark:text-gray-100">HairlossDoctor.AI</span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <Link key={n.label}
              href={n.href}
              className="text-sm font-medium text-gray-600 hover:text-[#6A4BF6]
                         dark:text-gray-300 dark:hover:text-white">
              {n.label}
            </Link>
          ))}

          <Link href="#login"
                className="text-sm font-medium text-gray-600 hover:text-[#6A4BF6]
                           dark:text-gray-300 dark:hover:text-white">
            Login
          </Link>

          <Link href="#signup">
            <button className="rounded-xl bg-[#6A4BF6] px-5 py-2 text-sm
                               font-medium text-white transition hover:scale-105
                               active:scale-95">
              Sign Up
            </button>
          </Link>
        </nav>

        {/* mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700 dark:text-gray-100"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="md:hidden bg-white dark:bg-[#070707] border-t
                        border-indigo-50/70 dark:border-white/10">
          <div className="flex flex-col gap-6 px-6 py-6">
            {nav.map((n) => (
              <Link key={n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-gray-700 hover:text-[#6A4BF6]
                           dark:text-gray-300 dark:hover:text-white">
                {n.label}
              </Link>
            ))}

            <Link href="#login"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-[#6A4BF6]
                             dark:text-gray-300 dark:hover:text-white">
              Login
            </Link>

            <Link href="#signup" onClick={() => setOpen(false)}>
              <button className="w-full rounded-xl bg-[#6A4BF6] px-5 py-3 text-sm
                                 font-medium text-white transition hover:scale-105
                                 active:scale-95">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
