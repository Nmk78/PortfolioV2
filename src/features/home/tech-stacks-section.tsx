import { HashFrameLines, TechStackIcon } from "@/components/ui/Icons";
import { techStacks } from "@/content/portfolio-identity";

export function TechStacksSection() {
  return (
    <section className="scroll-shrink-section rounded-3xl border-0 border-foreground/10 p-5 md:p-7 lg:p-8">
      <h2 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
        Tech Stacks
      </h2>
      <p className="text-theme-muted mt-2 max-w-xl text-sm">
        Tools I actually ship with.
      </p>
      <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:hidden">
        {techStacks.map((stack) => (
          <li key={stack} className="relative list-none">
            <div className="relative flex aspect-square w-full flex-col items-center justify-center gap-1.5 overflow-visible p-1">
              <HashFrameLines />
              <TechStackIcon
                name={stack}
                className="h-8 w-8 shrink-0 [&_img]:h-full [&_img]:w-full"
              />
              <span className="line-clamp-2 px-0.5 text-center text-[0.65rem] font-semibold leading-tight text-theme-muted">
                {stack}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 hidden flex-wrap gap-2.5 md:flex md:gap-3">
        {techStacks.map((stack) => (
          <span
            key={stack}
            className="text-theme-muted inline-flex min-h-9 items-center gap-2 rounded-full border border-foreground/15 bg-foreground/3 px-3 py-1.5 font-sans text-xs font-semibold transition-ui hover:border-foreground/30 hover:bg-foreground/6 md:min-h-10 md:px-3.5 md:text-sm"
          >
            <TechStackIcon
              name={stack}
              className="h-[18px] w-[18px] shrink-0 [&_img]:h-full [&_img]:w-full"
            />
            {stack}
          </span>
        ))}
      </div>
    </section>
  );
}
