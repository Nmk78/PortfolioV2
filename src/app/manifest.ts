import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nay Myo Khant Portfolio",
    short_name: "NMK Portfolio",
    description:
      "Portfolio of Nay Myo Khant, full-stack engineer focused on modern web, mobile, and AI product engineering.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#3b82f6",
    icons: [
      {
        src: absoluteUrl("/potrait.png"),
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
