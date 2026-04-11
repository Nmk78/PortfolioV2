/**
 * Home page project showcase — copy + images for stacked gallery.
 */

export interface ShowcaseFeatured {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
}

export const projectShowcase = {
  eyebrow: "Selected work",
  title: "Project showcase",
  subtitle:
    "A few shipped pieces—systems, interfaces, and experiments. Same thread as the rest of the portfolio: build it so someone else can open the hood.",
  viewAll: { label: "View all projects", href: "/projects" as const },
  featured: [
    {
      title: "PU Selection Project",
      description:
        "King & Queen selection platform for PU (Myeik)—dual voting roles, admin rounds, reusable rooms, and archive support.",
      href: "/projects/pu-selection",
      imageSrc: "/projects/selectionV2/hero.webp",
      imageAlt: "PU Selection platform hero preview",
    },
    {
      title: "Pivot",
      description:
        "Multi-platform AI cybersecurity assistant with RAG support across web, dashboard, Telegram bot, and Android app.",
      href: "/projects/pivot",
      imageSrc: "/projects/pivot/system.webp",
      imageAlt: "Pivot project application mockup",
    },
    {
      title: "IGNITE ERP",
      description:
        "Enterprise resource planning suite covering branches, employees, inventory, products, and secure role-based access.",
      href: "/projects/ignite",
      imageSrc: "/projects/ignite/hero.webp",
      imageAlt: "IGNITE ERP dashboard preview",
    },
  ],
} as const satisfies {
  eyebrow: string;
  title: string;
  subtitle: string;
  viewAll: { label: string; href: "/projects" };
  featured: readonly ShowcaseFeatured[];
};
