import { valueProps } from "@/content/portfolio-identity";

export function ValuePropsSection() {
  return (
    <section className="scroll-shrink-section employer-mode-only rounded-3xl border-0 border-foreground/10 p-5 md:p-7 lg:p-8">
      <div className="mb-7 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
          What I Bring
        </h2>
      </div>
      <div className="grid gap-0 md:grid-cols-3">
        {valueProps.map((item) => (
          <article
            key={item.title}
            className="scroll-shrink-item space-y-3 p-5 transition-ui md:space-y-3.5 md:p-6 lg:p-7 hover:bg-foreground/2"
          >
            <h3 className="text-lg font-bold tracking-tight md:text-xl">
              {item.title}
            </h3>
            <p className="text-theme-muted text-sm leading-relaxed md:text-base">
              {item.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
