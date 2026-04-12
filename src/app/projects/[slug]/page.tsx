import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IgniteProjectPage } from "@/features/projects/ignite/details";
import { LbmsProjectPage } from "@/features/projects/lbms/details";
import { NoteProjectPage } from "@/features/projects/note/details";
import { PivotProjectPage } from "@/features/projects/pivot/details";
import { PuSelectionProjectPage } from "@/features/projects/pu-selection/details";
import { absoluteUrl } from "@/lib/seo/site";

const SLUG_IGNITE = "ignite";
const SLUG_LBMS = "lbms";
const SLUG_NOTE = "note";
const SLUG_PIVOT = "pivot";
const SLUG_PU_SELECTION = "pu-selection";

const projectMeta: Record<
  string,
  { title: string; description: string; image: string; keywords: string[] }
> = {
  [SLUG_LBMS]: {
    title: "Library Management System",
    description:
      "Library Management System for USC Myeik—cataloging, loans, patrons, and reporting. Team project; main implementation lead.",
    image: "/projects/lbms/hero.webp",
    keywords: [
      "library management system",
      "Next.js portfolio project",
      "USC Myeik software project",
    ],
  },
  [SLUG_PIVOT]: {
    title: "Pivot",
    description:
      "Multi-platform AI cybersecurity chatbot for SMEs and startups—RAG backend, web, Telegram, and Android. APT YPS 2025.",
    image: "/projects/pivot/app-mockup.webp",
    keywords: [
      "AI cybersecurity assistant",
      "RAG chatbot case study",
      "multi-platform AI application",
    ],
  },
  [SLUG_NOTE]: {
    title: "Note App",
    description:
      "Cross-platform Expo note app using SQLite for reliable storage, with TailwindCSS + nativewind UI and Expo Router navigation.",
    image: "/projects/note/cover.webp",
    keywords: [
      "Expo note app",
      "React Native portfolio project",
      "SQLite mobile app",
    ],
  },
  [SLUG_PU_SELECTION]: {
    title: "PU Selection",
    description:
      "King & Queen selection for PU (Myeik)—role-based voting, UploadThing media, admin rounds, high traffic.",
    image: "/projects/selectionV2/cover.webp",
    keywords: [
      "voting platform case study",
      "role based voting system",
      "high traffic Next.js app",
    ],
  },
  [SLUG_IGNITE]: {
    title: "IGNITE ERP",
    description:
      "Enterprise resource planning—inventory, payroll, employees, branches, Auth0. Next.js, MongoDB, TanStack Query.",
    image: "/projects/ignite/hero.webp",
    keywords: [
      "ERP case study",
      "enterprise web app",
      "Next.js MongoDB TanStack Query",
    ],
  },
};

export function generateStaticParams() {
  return [
    { slug: SLUG_LBMS },
    { slug: SLUG_PIVOT },
    { slug: SLUG_NOTE },
    { slug: SLUG_PU_SELECTION },
    { slug: SLUG_IGNITE },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = projectMeta[slug];
  if (!meta) return { title: "Project" };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      type: "article",
      title: `${meta.title} | Nay Myo Khant`,
      description: meta.description,
      url: absoluteUrl(`/projects/${slug}`),
      images: [
        {
          url: absoluteUrl(meta.image),
          width: 1600,
          height: 900,
          alt: `${meta.title} preview image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | Nay Myo Khant`,
      description: meta.description,
      images: [absoluteUrl(meta.image)],
    },
  };
}

export default async function ProjectBySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = projectMeta[slug];

  let projectNode: React.ReactNode = null;
  if (slug === SLUG_LBMS) projectNode = <LbmsProjectPage />;
  if (slug === SLUG_PIVOT) projectNode = <PivotProjectPage />;
  if (slug === SLUG_NOTE) projectNode = <NoteProjectPage />;
  if (slug === SLUG_PU_SELECTION) projectNode = <PuSelectionProjectPage />;
  if (slug === SLUG_IGNITE) projectNode = <IgniteProjectPage />;

  if (!projectNode || !meta) notFound();

  const projectStructuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: meta.title,
    description: meta.description,
    url: absoluteUrl(`/projects/${slug}`),
    image: absoluteUrl(meta.image),
    author: {
      "@type": "Person",
      name: "Nay Myo Khant",
      url: absoluteUrl("/"),
    },
    isPartOf: {
      "@type": "CollectionPage",
      name: "Projects",
      url: absoluteUrl("/projects"),
    },
    about: meta.keywords,
    inLanguage: "en",
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: absoluteUrl("/projects"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: meta.title,
        item: absoluteUrl(`/projects/${slug}`),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      {projectNode}
    </>
  );
}
