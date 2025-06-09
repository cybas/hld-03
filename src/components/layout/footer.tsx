
import Link from 'next/link';
import Image from 'next/image';
import { Download } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="relative isolate bg-[#070707] text-gray-300 pt-24 pb-10 overflow-hidden">
      {/* backdrop glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#6A4BF6]/20 via-[#6A4BF6]/5 to-rose-600/30 blur-3xl" />

      {/* headline + CTA */}
      <div className="mx-auto max-w-4xl text-center px-4">
        <Image
          src="/logo-mark.svg" // Updated src
          alt="HairlossDoctor.AI Logo Mark"
          width={48}
          height={48}
          className="mx-auto h-12 w-12"
          data-ai-hint="brand logo" // Updated data-ai-hint
        />
        <h2 className="mt-6 text-3xl font-semibold text-slate-100 sm:text-4xl">
          Unlock a new approach&nbsp;to healthy hair
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Join thousands of doctors & patients already improving outcomes with HairlossDoctor.AI.
        </p>
        <Link // Changed from <a> to <Link>
          href="/assessment/step1" // Updated href to a relevant internal link
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#6A4BF6] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:scale-105 hover:bg-[#5c42d6] active:scale-100"
        >
          Get started for free
          <Download className="h-5 w-5" />
        </Link>
      </div>

      {/* link grid */}
      <div className="mx-auto mt-20 max-w-6xl grid grid-cols-2 gap-8 px-4 sm:grid-cols-4">
        <div>
          <h4 className="mb-4 text-sm font-medium text-gray-400">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#features" className="hover:text-white">Features</Link></li>
            <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link href="/assessment/step1" className="hover:text-white">Hair-Loss Assessment</Link></li>
            <li><Link href="#scanner" className="hover:text-white">AI Hair Scan</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-medium text-gray-400">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#help" className="hover:text-white">Help Center</Link></li>
            <li><Link href="#docs" className="hover:text-white">Documentation</Link></li>
            <li><Link href="#community" className="hover:text-white">Community</Link></li>
            <li><Link href="#contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-medium text-gray-400">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="#case" className="hover:text-white">Case Studies</Link></li>
            <li><Link href="#research" className="hover:text-white">Clinical Research</Link></li>
            <li><Link href="#api" className="hover:text-white">Developer API</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-medium text-gray-400">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#about" className="hover:text-white">About Us</Link></li>
            <li><Link href="#careers" className="hover:text-white">Careers</Link></li>
            <li><Link href="#partners" className="hover:text-white">Partners</Link></li>
            <li><Link href="#security" className="hover:text-white">Security</Link></li>
          </ul>
        </div>
      </div>

      {/* medical credibility blurb */}
      <div className="mx-auto mt-16 max-w-3xl px-6 text-center text-xs leading-relaxed text-gray-400 md:text-sm">
        HairlossDoctor.AI is trained on verified medical literature, including peer-reviewed publications from trusted sources such as PubMed. Its diagnostic support and recommendation engine has been vetted by medical experts at the Instituto de Benito Medical Group in Barcelona, Spain. Several advanced protocol combinations were designed in collaboration with <span className="whitespace-nowrap">Dr.&nbsp;Daniel&nbsp;Zarza</span>, Head of Trichology and Dermatology at Instituto de&nbsp;Benito.
      </div>

      {/* divider */}
      <hr className="mx-auto mt-16 w-11/12 border-t border-white/10" />

      {/* newsletter */}
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md text-sm text-gray-400">
          Never miss an update — expert hair-care tips delivered once a month.
        </div>

        <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 rounded-lg bg-white/10 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 backdrop-blur-md focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#6A4BF6] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:scale-105 hover:bg-[#5c42d6] active:scale-100"
          >
            Join
          </button>
        </form>
      </div>

      {/* legal */}
      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:gap-0">
        <p className="text-xs text-gray-500">© 2025 HairlossDoctor.AI</p>
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <Link href="#privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="#terms" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
