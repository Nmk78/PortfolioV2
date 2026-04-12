import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Nay Myo Khant: full-stack engineer focused on shipping performant interfaces, scalable product architecture, and reliable developer workflows.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "profile",
    url: absoluteUrl("/about"),
    title: "About | Nay Myo Khant",
    description:
      "Learn about Nay Myo Khant's engineering background, product mindset, and collaboration style.",
    images: [
      {
        url: absoluteUrl("/og.webp"),
        width: 1200,
        height: 1200,
        alt: "Portrait of Nay Myo Khant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Nay Myo Khant",
    description:
      "Engineering profile and contact details for Nay Myo Khant, full-stack software engineer.",
    images: [absoluteUrl("/og.webp")],
  },
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
