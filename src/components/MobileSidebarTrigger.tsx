"use client";

import {
  BookOpen,
  CalendarDays,
  Compass,
  ExternalLink,
  Home,
  Library,
  Megaphone,
  Menu,
  ShieldCheck,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useMobileSidebar } from "./MobileSidebarContext";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** Si true, renderiza como <a> con target="_blank" en vez de <Link>. */
  external?: boolean;
}

interface NavGroup {
  groupLabel: string;
  items: NavItem[];
  adminOnly?: boolean;
}

const standaloneItems: NavItem[] = [
  { href: "/", label: "Inicio", icon: <Home className="h-[18px] w-[18px]" /> },
  {
    href: "/carreras",
    label: "Carreras",
    icon: <BookOpen className="h-[18px] w-[18px]" />,
  },
  {
    href: "/cartelera",
    label: "Cartelera",
    icon: <Megaphone className="h-[18px] w-[18px]" />,
  },
  {
    href: "/sobre-mi",
    label: "Sobre mí",
    icon: <User className="h-[18px] w-[18px]" />,
  },
];

const navGroups: NavGroup[] = [
  {
    groupLabel: "Recursos",
    items: [
      {
        href: "/calendario",
        label: "Calendario",
        icon: <CalendarDays className="h-[18px] w-[18px]" />,
      },
      {
        href: "/bibliografia",
        label: "Bibliografía",
        icon: <Library className="h-[18px] w-[18px]" />,
      },
      {
        href: "/links",
        label: "Links útiles",
        icon: <Compass className="h-[18px] w-[18px]" />,
      },
      {
        href: "https://linktr.ee/gruposdewsp",
        label: "Grupos WhatsApp",
        icon: <WhatsAppIcon className="h-[18px] w-[18px]" />,
        external: true,
      },
    ],
  },
  {
    groupLabel: "Admin",
    adminOnly: true,
    items: [
      {
        href: "/admin",
        label: "Panel",
        icon: <ShieldCheck className="h-[18px] w-[18px]" />,
      },
    ],
  },
];

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 0.3;

interface MobileSidebarTriggerProps {
  appName: string;
  isAdmin?: boolean;
}

export default function MobileSidebarTrigger({
  appName,
  isAdmin = false,
}: MobileSidebarTriggerProps) {
  const pathname = usePathname();
  const { isOpen, setOpen, close } = useMobileSidebar();

  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isTracking = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchStartTime.current = Date.now();
    isTracking.current = true;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isTracking.current) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = Math.abs(touch.clientY - touchStartY.current);
      if (deltaY > Math.abs(deltaX)) {
        isTracking.current = false;
        return;
      }
      if (deltaX <= -SWIPE_THRESHOLD) {
        const elapsed = Date.now() - touchStartTime.current;
        const velocity = Math.abs(deltaX) / elapsed;
        if (velocity >= SWIPE_VELOCITY_THRESHOLD) {
          close();
          isTracking.current = false;
        }
      }
    },
    [close],
  );

  const handleTouchEnd = useCallback(() => {
    isTracking.current = false;
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const touchStartHandler = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      touchStartTime.current = Date.now();
      isTracking.current = true;
    };

    const touchMoveHandler = (e: TouchEvent) => {
      if (!isTracking.current) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = Math.abs(touch.clientY - touchStartY.current);
      if (deltaY > Math.abs(deltaX)) {
        isTracking.current = false;
        return;
      }
      if (deltaX <= -SWIPE_THRESHOLD) {
        const elapsed = Date.now() - touchStartTime.current;
        const velocity = Math.abs(deltaX) / elapsed;
        if (velocity >= SWIPE_VELOCITY_THRESHOLD) {
          close();
          isTracking.current = false;
        }
      }
    };

    const touchEndHandler = () => {
      isTracking.current = false;
    };

    content.addEventListener("touchstart", touchStartHandler, {
      passive: true,
    });
    content.addEventListener("touchmove", touchMoveHandler, { passive: true });
    content.addEventListener("touchend", touchEndHandler, { passive: true });

    return () => {
      content.removeEventListener("touchstart", touchStartHandler);
      content.removeEventListener("touchmove", touchMoveHandler);
      content.removeEventListener("touchend", touchEndHandler);
    };
  }, [close]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const filteredGroups = navGroups.filter((g) => !g.adminOnly || isAdmin);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl sm:hidden",
              "border border-border bg-card text-foreground",
              "hover:bg-pastel-blue hover:border-primary/30 hover:text-primary",
              "transition-all duration-200 active:scale-95",
            )}
            aria-label="Abrir menú"
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 p-0 flex flex-col touch-pan-y bg-sidebar"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div ref={contentRef} className="flex flex-col h-full">
          <SheetHeader className="border-b border-sidebar-border p-4 flex-row items-center gap-3 space-y-0">
            <div className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-border shadow-sm">
              <Image
                src="/logo.png"
                alt="Blog Informática UNLP"
                width={36}
                height={36}
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight text-left">
              <SheetTitle className="text-sm font-semibold">
                {appName}
              </SheetTitle>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                UNLP
              </span>
            </div>
          </SheetHeader>

          <div className="flex-1 flex flex-col overflow-hidden">
            <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
              <ul className="space-y-1 px-2">
                {standaloneItems.map((item) => (
                  <NavItemLink
                    key={item.href}
                    item={item}
                    active={isActive(item.href)}
                    onClick={close}
                  />
                ))}
              </ul>

              {filteredGroups.map((group) => (
                <div key={group.groupLabel} className="mt-5">
                  <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
                    {group.groupLabel}
                  </div>
                  <ul className="space-y-1 px-2 mt-1">
                    {group.items.map((item) => (
                      <NavItemLink
                        key={item.href}
                        item={item}
                        active={isActive(item.href)}
                        onClick={close}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="border-t border-sidebar-border px-3 py-3 flex items-center gap-2">
              <a
                href="https://github.com/MatiasGuaymas/Blog_Informatica"
                target="_blank"
                rel="noreferrer"
                title="Repositorio en GitHub"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <span className="text-[10px] text-muted-foreground">
                Hecho con 💙 por Matías Guaymas
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface NavItemLinkProps {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}

function NavItemLink({ item, active, onClick }: NavItemLinkProps) {
  const className = cn(
    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
    "text-sm font-medium transition-all duration-200 ease-out",
    active
      ? "bg-pastel-blue text-primary"
      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
  );

  const inner = (
    <>
      {active && (
        <span
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary"
          aria-hidden="true"
        />
      )}
      <span
        className={cn(
          "shrink-0 transition-transform duration-200",
          active ? "text-primary" : "group-hover:scale-110",
        )}
      >
        {item.icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.external && (
        <ExternalLink
          className="h-3 w-3 shrink-0 text-muted-foreground/60"
          aria-hidden="true"
        />
      )}
    </>
  );

  return (
    <li>
      {item.external ? (
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          onClick={onClick}
          className={className}
        >
          {inner}
        </a>
      ) : (
        <Link href={item.href} onClick={onClick} className={className}>
          {inner}
        </Link>
      )}
    </li>
  );
}
