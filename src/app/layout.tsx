import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { absoluteUrl, getSiteOrigin } from "@/lib/seo/site";
import { Navbar } from "@/features/portfolio-shell/navbar";
import { Footer } from "@/features/portfolio-shell/footer";
import { SmoothScrolling } from "@/components/ui/SmoothScrolling";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { EmployerModeProvider } from "@/components/ui/employer-mode-provider";
import { DeferredEnhancements } from "@/components/ui/deferred-enhancements";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-story-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteOrigin(),
  title: {
    default: "Nay Myo Khant | Full-Stack Engineer Portfolio",
    template: "%s | Nay Myo Khant",
  },
  description:
    "Nay Myo Khant is a full-stack engineer building performant Next.js, React Native, and AI-powered products. Explore case studies, architecture decisions, and production-ready engineering work.",
  keywords: [
    "Nay Myo Khant",
    "full-stack engineer portfolio",
    "Next.js developer",
    "React developer",
    "TypeScript engineer",
    "React Native developer",
    "AI engineer portfolio",
    "Myanmar software engineer",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: "Nay Myo Khant | Full-Stack Engineer Portfolio",
    description:
      "Portfolio of Nay Myo Khant featuring shipped products, technical case studies, and practical full-stack engineering work.",
    siteName: "Nay Myo Khant Portfolio",
    images: [
      {
        url: absoluteUrl("/potrait.png"),
        width: 1200,
        height: 1200,
        alt: "Portrait of Nay Myo Khant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nay Myo Khant | Full-Stack Engineer Portfolio",
    description:
      "Shipped products, case studies, and engineering work across Next.js, React Native, and AI systems.",
    images: [absoluteUrl("/potrait.png")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nay Myo Khant",
    alternateName: "Marcus",
    jobTitle: "Full-Stack Engineer",
    url: absoluteUrl("/"),
    email: "mailto:naymyokhant78@gmail.com",
    telephone: "+95 945 913 3418",
    address: {
      "@type": "PostalAddress",
      addressCountry: "MM",
    },
    sameAs: ["https://github.com/Nmk78"],
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "React Native",
      "AI product engineering",
      "Full-stack development",
    ],
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nay Myo Khant Portfolio",
    url: absoluteUrl("/"),
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: "Nay Myo Khant",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/projects")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col pt-[max(6rem,calc(4.5rem+env(safe-area-inset-top)))] selection:bg-primary/30 selection:text-white relative bg-background text-foreground antialiased leading-[1.65]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <EmployerModeProvider>
            <a
              href="#main-content"
              className="fixed left-[-10000px] top-0 z-100 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white outline-none focus:left-[max(1rem,env(safe-area-inset-left))] focus:top-[max(1rem,env(safe-area-inset-top))] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Skip to main content
            </a>
            <SmoothScrolling>
              <Navbar />
              <main
                id="main-content"
                className="flex-1 w-full max-w-5xl scroll-mt-24 px-[max(1rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pb-12 pt-0 lg:max-w-5xl 2xl:max-w-6xl relative z-10 mx-auto xl:scroll-mt-28 xl:pb-14"
              >
                {children}
              </main>
              <Footer />
              <DeferredEnhancements />
            </SmoothScrolling>
          </EmployerModeProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
