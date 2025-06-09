import Link from 'next/link';

export function SiteFooter() {
 return (
    <footer className="py-8 md:py-12 border-t bg-[#F8FAFC]"> {/* Subtle Background */}
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        HairLossDoctor.AI
                    </p>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 md:gap-x-8">
                    <Link href="#" className="text-sm text-muted-foreground hover:text-accent">Privacy</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-accent">Terms</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-accent">FAQ</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-accent">Contact</Link>
                </div>
            </div>
            <p className="mt-8 text-center text-xs text-muted-foreground">
                In partnership with Instituto De Benito
            </p>
        </div>
    </footer>
  );
}
