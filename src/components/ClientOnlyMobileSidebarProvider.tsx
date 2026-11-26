"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// Dynamic import with ssr: false to prevent hydration mismatch
const MobileSidebarProvider = dynamic(
  () =>
    import("@/components/MobileSidebarContext").then(
      (mod) => mod.MobileSidebarProvider,
    ),
  { ssr: false },
);

interface ClientOnlyMobileSidebarProviderProps {
  children: ReactNode;
}

export default function ClientOnlyMobileSidebarProvider({
  children,
}: ClientOnlyMobileSidebarProviderProps) {
  return <MobileSidebarProvider>{children}</MobileSidebarProvider>;
}
