"use client";

import dynamic from "next/dynamic";

// Skeleton placeholder that matches the collapsed sidebar dimensions
// This prevents layout shift while the real sidebar loads
function SidebarSkeleton() {
  return (
    <aside className="hidden sm:flex flex-col h-screen bg-card/50 border-r border-border w-16 min-w-16 shrink-0">
      {/* Header skeleton */}
      <div className="flex items-center justify-center h-14 px-3">
        <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
      </div>

      {/* Navigation skeleton */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
        {[...Array(5)].map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton placeholders
          <div key={i} className="flex items-center justify-center px-3 py-2.5">
            <div className="h-5 w-5 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </nav>

      {/* User avatar skeleton */}
      <div className="border-t border-border p-3">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
    </aside>
  );
}

// Dynamic import with ssr: false to prevent hydration mismatch
// Base UI components (Popover) generate different IDs on server vs client
const DesktopSidebar = dynamic(() => import("@/components/DesktopSidebar"), {
  ssr: false,
  loading: () => <SidebarSkeleton />,
});

interface ClientOnlySidebarProps {
  appName: string;
  isAdmin?: boolean;
}

export default function ClientOnlySidebar(props: ClientOnlySidebarProps) {
  return <DesktopSidebar {...props} />;
}
