import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Production case studies by Nay Myo Khant across AI, ERP, mobile, and full-stack product engineering.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/projects"),
    title: "Projects | Nay Myo Khant",
    description:
      "Explore selected software projects with implementation details, architecture choices, and outcomes.",
    images: [
      {
        url: absoluteUrl("/projects/pivot/app-mockup.webp"),
        width: 1600,
        height: 900,
        alt: "Project case studies by Nay Myo Khant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Nay Myo Khant",
    description:
      "Selected shipped projects and case studies.",
    images: [absoluteUrl("/projects/pivot/app-mockup.webp")],
  },
};

export default function ProjectsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
