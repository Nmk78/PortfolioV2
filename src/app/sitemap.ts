import type { MetadataRoute } from "next";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { absoluteUrl } from "@/lib/seo/site";

const PROJECT_SLUGS = ["lbms", "pivot", "note", "pu-selection", "ignite"] as const;

const ROUTE_SOURCE_FILES = {
  "/": "src/app/page.tsx",
  "/about": "src/app/about/page.tsx",
  "/projects": "src/app/projects/page.tsx",
} as const;

const PROJECT_SOURCE_FILES: Record<(typeof PROJECT_SLUGS)[number], string> = {
  lbms: "src/features/projects/lbms/details.tsx",
  pivot: "src/features/projects/pivot/details.tsx",
  note: "src/features/projects/note/details.tsx",
  "pu-selection": "src/features/projects/pu-selection/details.tsx",
  ignite: "src/features/projects/ignite/details.tsx",
};

async function getLastModified(relativePath: string) {
  try {
    const fullPath = join(process.cwd(), relativePath);
    const stats = await stat(fullPath);
    return stats.mtime;
  } catch {
    return new Date();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const homeLastModified = await getLastModified(ROUTE_SOURCE_FILES["/"]);
  const aboutLastModified = await getLastModified(ROUTE_SOURCE_FILES["/about"]);
  const projectsLastModified = await getLastModified(ROUTE_SOURCE_FILES["/projects"]);
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: homeLastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: aboutLastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/projects"),
      lastModified: projectsLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = await Promise.all(
    PROJECT_SLUGS.map(async (slug) => ({
      url: absoluteUrl(`/projects/${slug}`),
      lastModified: await getLastModified(PROJECT_SOURCE_FILES[slug]),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  );

  return [...staticRoutes, ...projectRoutes];
}
