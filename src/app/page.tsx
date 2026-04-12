import { HomeScrollEffects } from "@/features/home/home-scroll-effects";
import { timelineItems } from "@/content/portfolio-identity";
import { HeroSection } from "@/features/home/hero-section";
import { ProjectShowcaseSection } from "@/features/home/project-showcase-section";
import { TechStacksSection } from "@/features/home/tech-stacks-section";
import { TestimonialsSection } from "@/features/home/testimonials-section";
import { TimelineSection } from "@/features/home/timeline-section";
import { ValuePropsSection } from "@/features/home/value-props-section";

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
