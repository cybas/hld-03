
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { ActionSection } from '@/components/landing/action-section';
import { BlogSection } from '@/components/landing/BlogSection';

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-background"> {/* Ensure main background is applied */}
      <HeroSection />
      <FeaturesSection />
      <BlogSection />
      <ActionSection />
    </div>
  );
}
