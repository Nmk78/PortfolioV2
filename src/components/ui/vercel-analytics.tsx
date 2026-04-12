"use client";

import { Analytics } from "@vercel/analytics/next";
import { useEffect, useState } from "react";

/** Mount after hydration so server and first client paint both render nothing — avoids Analytics/Suspense mismatch. */
export function VercelAnalytics() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <Analytics />;
}
