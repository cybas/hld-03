
import { PackageCard } from '@/components/assessment/PackageCard';
import { treatmentPackages } from '@/app/assessment/step5/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Treatment Packages - HairlossDoctor.AI',
  description: 'Explore our comprehensive 100-day treatment packages for hair loss, from home care to intensive clinic solutions.',
};

export default function PackagesPage() {
  const allPackages = Object.values(treatmentPackages);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Treatment Packages
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find the perfect plan to start your hair restoration journey. All our programs are designed around a 100-day cycle for measurable results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {allPackages.map(pkg => (
            <div key={pkg.id}>
              <PackageCard pkg={pkg} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
