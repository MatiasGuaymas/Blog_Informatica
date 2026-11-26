"use client";

import dynamic from "next/dynamic";

// Dynamic import with ssr: false to prevent hydration mismatch
// Base UI components (Sheet) generate different IDs on server vs client
const MobileSidebarTrigger = dynamic(
  () => import("@/components/MobileSidebarTrigger"),
  { ssr: false },
);

interface ClientOnlyMobileSidebarProps {
  appName: string;
  isAdmin?: boolean;
}

export default function ClientOnlyMobileSidebar(
  props: ClientOnlyMobileSidebarProps,
) {
  return <MobileSidebarTrigger {...props} />;
}
