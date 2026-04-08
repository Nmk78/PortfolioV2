import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-foreground/10">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-12 lg:px-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <p className="text-xl font-black tracking-tighter text-foreground">NMK.</p>
            <p className="text-theme-muted max-w-md text-sm leading-relaxed">
              Fullstack product engineer focused on building fast, accessible, and visually distinct digital experiences.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Navigation</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-theme-muted transition-colors hover:text-foreground">Home</Link></li>
              <li><Link href="/projects" className="text-theme-muted transition-colors hover:text-foreground">Projects</Link></li>
              <li><Link href="/contact" className="text-theme-muted transition-colors hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Connect</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:naymyokhant.dev@gmail.com" className="text-theme-muted transition-colors hover:text-foreground">
                  naymyokhant.dev@gmail.com
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-theme-muted transition-colors hover:text-foreground">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-theme-muted transition-colors hover:text-foreground">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-theme-subtle mt-10 border-t border-foreground/10 pt-5 text-sm">
          © {year} Nay Myo Khant. Crafted with focus and intent.
        </div>
      </div>
    </footer>
  );
}
