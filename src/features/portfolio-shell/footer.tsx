import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="my-20 border-t border-foreground/10 transition-ui">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:max-w-6xl lg:px-12 lg:py-20 2xl:max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <p className="text-xl font-black tracking-tighter text-foreground">
              NMK.
            </p>
            <p className="text-theme-muted max-w-md text-sm leading-relaxed">
              Fullstack Developer focused on building fast, accessible, and
              visually distinct digital experiences.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-3">
              <p className="font-mono text-xs font-bold tracking-[0.2em] text-primary uppercase">
                Navigation
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-theme-muted transition-ui hover:text-foreground"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="text-theme-muted transition-ui hover:text-foreground"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-theme-muted transition-ui hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-mono text-xs font-bold tracking-[0.2em] text-primary uppercase">
                Connect
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:naymyokhant.dev@gmail.com"
                    className="text-theme-muted transition-ui hover:text-foreground"
                  >
                    naymyokhant78@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Nmk78"
                    target="_blank"
                    rel="noreferrer"
                    className="text-theme-muted transition-ui hover:text-foreground"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/nay-myo-khant-6760b4254"
                    target="_blank"
                    rel="noreferrer"
                    className="text-theme-muted transition-ui hover:text-foreground"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-theme-subtle mt-10 border-t border-foreground/10 pt-5 text-sm">
          © {year} Nay Myo Khant. Crafted with focus and intent.
        </div>
      </div>
    </footer>
  );
}
