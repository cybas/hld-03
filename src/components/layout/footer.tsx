import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="py-8 md:py-12 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Your Company.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
           <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
           <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
           <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">FAQ</Link>
           <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
        </div>
      </div>
       <p className="text-center text-xs text-muted-foreground mt-4">
          In partnership with Instituto De Benito
        </p>
    </footer>
  );
}
