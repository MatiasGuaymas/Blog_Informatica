"use client";

import dynamic from "next/dynamic";

// Dynamic import with ssr: false to prevent hydration mismatch
const EdgeSwipeDetector = dynamic(
  () => import("@/components/EdgeSwipeDetector"),
  { ssr: false },
);

export default function ClientOnlyEdgeSwipe() {
  return <EdgeSwipeDetector />;
}
