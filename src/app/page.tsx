
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { ActionSection } from '@/components/landing/action-section';

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-background"> {/* Ensure main background is applied */}
      <HeroSection />
      <FeaturesSection />
      <ActionSection />
    </div>
  );
}
