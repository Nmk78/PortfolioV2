import type { ComponentType } from "react";
import { IgniteProjectPreview } from "../ignite/preview";
import { LbmsProjectPreview } from "../lbms/preview";
import { NoteProjectPreview } from "../note/preview";
import { PivotProjectPreview } from "../pivot/preview";
import { PuSelectionProjectPreview } from "../pu-selection/preview";

export interface ProjectIndexEntry {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  github: string;
  /** Case-study route when available */
  detailHref?: string;
  Preview: ComponentType;
}

export const PROJECTS: ProjectIndexEntry[] = [
  {
    id: "lbms",
    title: "Library Management System",
    description:
      "A comprehensive digital solution for managing library resources, borrowing operations and student cataloging.",
    tags: ["Java", "JavaScript", "MySQL", "Tailwind CSS"],
    link: "#",
    github: "#",
    detailHref: "/projects/lbms",
    Preview: LbmsProjectPreview,
  },
  {
    id: "pivot",
    title: "Pivot",
    description:
      "Multi-platform AI cybersecurity chatbot for SMEs and startups—RAG backend, Next.js web & dashboard, Telegram bot, and Expo Android.",
    tags: ["Python", "FastAPI", "Next.js", "Expo", "MongoDB", "Milvus"],
    link: "#",
    github: "#",
    detailHref: "/projects/pivot",
    Preview: PivotProjectPreview,
  },
  {
    id: "pu-selection",
    title: "PU Selection",
    description:
      "King & Queen selection platform for PU (Myeik)—dual voting roles, UploadThing media, admin rounds, reusable rooms, and archive—optimized for 2,500+ peak visitors.",
    tags: [
      "TypeScript",
      "Next.js",
      "Zod",
      "Prisma",
      "MongoDB",
      "Clerk",
      "UploadThing",
      "TanStack Query",
      "shadcn/ui",
      "Vercel",
    ],
    link: "#",
    github: "#",
    detailHref: "/projects/pu-selection",
    Preview: PuSelectionProjectPreview,
  },
  {
    id: "note",
    title: "Note App",
    description:
      "Simple cross-platform note app with Expo, SQLite-backed storage, TailwindCSS + nativewind UI, and Expo Router navigation.",
    tags: ["Expo", "TailwindCSS", "TypeScript", "SQLite", "Expo Router"],
    link: "#",
    github: "#",
    detailHref: "/projects/note",
    Preview: NoteProjectPreview,
  },
  {
    id: "ignite",
    title: "IGNITE ERP",
    description:
      "Enterprise resource planning—branches, employees, inventory, products, and Auth0-secured access in one Next.js suite.",
    tags: [
      "Tailwind CSS",
      "TanStack Query",
      "MongoDB",
      "React Hook Form",
      "Node.js",
      "Auth0",
      "Next.js",
    ],
    link: "#",
    github: "#",
    detailHref: "/projects/ignite",
    Preview: IgniteProjectPreview,
  },
];
