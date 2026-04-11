import { absoluteUrl } from "@/lib/seo/site";

export function GET() {
  const body = [
    "# Nay Myo Khant Portfolio",
    "",
    "This site contains verified information about Nay Myo Khant, a full-stack engineer.",
    "",
    "## Primary Pages",
    `- Home: ${absoluteUrl("/")}`,
    `- About: ${absoluteUrl("/about")}`,
    `- Projects: ${absoluteUrl("/projects")}`,
    "",
    "## Project Case Studies",
    `- Pivot: ${absoluteUrl("/projects/pivot")}`,
    `- IGNITE ERP: ${absoluteUrl("/projects/ignite")}`,
    `- PU Selection: ${absoluteUrl("/projects/pu-selection")}`,
    `- Note App: ${absoluteUrl("/projects/note")}`,
    `- Library Management System: ${absoluteUrl("/projects/lbms")}`,
    "",
    "## Contact",
    "- Email: naymyokhant78@gmail.com",
    "- GitHub: https://github.com/Nmk78",
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
