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
    background_color: "#0b0b0b",
    theme_color: "#0b0b0b",
    icons: [
      {
        src: absoluteUrl("/potrait.png"),
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
