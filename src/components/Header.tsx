import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ClientOnlyMobileSidebar from "@/components/ClientOnlyMobileSidebar";
import ThemeToggle from "@/components/ThemeToggle";

const APP_NAME = "Blog Informática";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/70">
      <div className="flex h-14 items-center justify-between px-3 sm:px-4 text-foreground">
        <div className="flex items-center gap-2 sm:gap-3">
          <ClientOnlyMobileSidebar appName={APP_NAME} />

          {/* Atajo a home en mobile-only (desktop tiene el branding en el sidebar). */}
          <Link
            href="/"
            className="sm:hidden inline-flex items-center gap-2"
            aria-label={`Inicio - ${APP_NAME}`}
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-border">
              <Image
                src="/logo.png"
                alt=""
                width={32}
                height={32}
                priority
                className="h-full w-full object-contain"
              />
            </span>
            <span className="text-sm font-bold tracking-tight text-foreground">
              {APP_NAME}
            </span>
          </Link>

          {/* Breadcrumb - desktop only */}
          <div className="hidden sm:block">
            <Breadcrumb />
          </div>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1.5">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
