import dynamic from "next/dynamic";
import { HomeScrollEffects } from "@/features/home/home-scroll-effects";
import { timelineItems } from "@/content/portfolio-identity";
import { HeroSection } from "@/features/home/hero-section";
import { TechStacksSection } from "@/features/home/tech-stacks-section";
import { TestimonialsSection } from "@/features/home/testimonials-section";
import { TimelineSection } from "@/features/home/timeline-section";
import { ValuePropsSection } from "@/features/home/value-props-section";

const ProjectShowcaseSection = dynamic(
  () =>
    import("@/features/home/project-showcase-section").then(
      (module) => module.ProjectShowcaseSection,
    ),
  {
    loading: () => (
      <section className="scroll-shrink-section rounded-3xl border-0 border-foreground/10 p-5 md:p-7 lg:p-8">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
          Featured Projects
        </h2>
        <p className="mt-2 text-sm text-theme-muted">
          Loading interactive showcase...
        </p>
      </section>
    ),
  },
);

export default function Home() {
  const groupedTimeline = new Map<string, Array<(typeof timelineItems)[number]>>();
  for (const item of timelineItems) {
    const yearKey = item.timeFrame.split(" ")[0];
    const yearItems = groupedTimeline.get(yearKey);
    if (yearItems) groupedTimeline.set(yearKey, [...yearItems, item]);
    else groupedTimeline.set(yearKey, [item]);
  }

  const timelineRows = Array.from(groupedTimeline.entries()).flatMap(([year, items]) =>
    items.map((item, idx) => ({
      showYear: idx === 0,
      year,
      item,
      rowKey: `${year}-${item.title}-${item.company}-${item.timeFrame}`,
    })),
  );

  return (
    <div className="w-full texture-dots space-y-5 pb-24 md:space-y-7 md:pb-32 lg:space-y-8 lg:pb-36 employer-mode-surface">
      <HomeScrollEffects />
      <HeroSection />
      <TechStacksSection />
      <ProjectShowcaseSection />
      <ValuePropsSection />
      <TimelineSection timelineRows={timelineRows} />
      <TestimonialsSection />
    </div>
  );
}
