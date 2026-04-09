import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

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
  title: "Nay Myo Khant | Portfolio",
  description:
    "Nay Myo Khant — full-stack engineer at TalentOS (React, Next.js, React Native, Firebase). Portfolio with recruiter mode for a concise, skills-first view.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScrolling } from "@/components/ui/SmoothScrolling";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { EmployerModeProvider } from "@/components/ui/employer-mode-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col pt-[max(6rem,calc(4.5rem+env(safe-area-inset-top)))] selection:bg-primary/30 selection:text-white relative bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <EmployerModeProvider>
            <a
              href="#main-content"
              className="fixed left-[-10000px] top-0 z-100 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white outline-none focus:left-[max(1rem,env(safe-area-inset-left))] focus:top-[max(1rem,env(safe-area-inset-top))] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Skip to main content
            </a>
            <SmoothScrolling>
              <CustomCursor />
              <Navbar />
              <main
                id="main-content"
                className="flex-1 max-w-7xl mx-auto w-full scroll-mt-28 px-[max(1rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] sm:px-12 lg:px-16 pt-0 pb-14 relative z-10"
              >
                {children}
              </main>
              <Footer />
            </SmoothScrolling>
          </EmployerModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
