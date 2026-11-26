"use client";

import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  Home,
  Library,
  Megaphone,
  ShieldCheck,
  User,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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

const STORAGE_KEY = "sidebar-collapsed";

interface DesktopSidebarProps {
  appName: string;
  /** Placeholder until admin auth is wired. */
  isAdmin?: boolean;
}

export default function DesktopSidebar({
  appName,
  isAdmin = false,
}: DesktopSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Persist collapse choice across navigations.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed, hydrated]);

  const toggleCollapsed = () => setCollapsed((p) => !p);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const filteredGroups = navGroups.filter((g) => !g.adminOnly || isAdmin);

  return (
    <aside
      className={cn(
        "hidden sm:flex flex-col h-screen sticky top-0 shrink-0 overflow-hidden",
        "bg-sidebar border-r border-sidebar-border",
        "transition-[width,min-width] duration-300 ease-out",
        collapsed ? "w-16 min-w-16" : "w-64 min-w-64",
      )}
    >
      <SidebarHeader
        appName={appName}
        collapsed={collapsed}
        onToggle={toggleCollapsed}
      />

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <NavSection items={standaloneItems} collapsed={collapsed} isActive={isActive} />

        {filteredGroups.map((group) => (
          <NavGroup
            key={group.groupLabel}
            group={group}
            collapsed={collapsed}
            isActive={isActive}
          />
        ))}
      </nav>

      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Header (brand + collapse toggle)
// ---------------------------------------------------------------------------

interface SidebarHeaderProps {
  appName: string;
  collapsed: boolean;
  onToggle: () => void;
}

function SidebarHeader({ appName, collapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className="relative flex items-center gap-3 px-3 py-4 border-b border-sidebar-border">
      <BrandMark collapsed={collapsed} onExpand={collapsed ? onToggle : undefined} />

      {/* Brand wordmark - fades when collapsed */}
      <div
        className={cn(
          "flex flex-col leading-tight overflow-hidden whitespace-nowrap",
          "transition-[opacity,transform] duration-300 ease-out",
          collapsed ? "opacity-0 -translate-x-2 w-0" : "opacity-100 translate-x-0",
        )}
      >
        <span className="font-semibold text-sm text-sidebar-foreground">
          {appName}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          UNLP
        </span>
      </div>

      {/* Collapse toggle */}
      {!collapsed && (
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "ml-auto inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
            "text-muted-foreground hover:bg-muted hover:text-foreground",
            "transition-colors duration-200",
          )}
          aria-label="Colapsar menú"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

interface BrandMarkProps {
  collapsed: boolean;
  onExpand?: () => void;
}

function BrandMark({ collapsed, onExpand }: BrandMarkProps) {
  const inner = (
    <div
      className={cn(
        "relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl",
        "bg-white ring-1 ring-border shadow-sm",
        "transition-transform duration-200 ease-out",
        onExpand && "group-hover:scale-105",
      )}
    >
      <Image
        src="/logo.png"
        alt="Blog Informática UNLP"
        width={36}
        height={36}
        priority
        className="h-full w-full object-contain"
      />
    </div>
  );

  if (onExpand) {
    return (
      <button
        type="button"
        onClick={onExpand}
        className="group relative cursor-pointer"
        aria-label="Expandir menú"
      >
        {inner}
        <ChevronRight
          className={cn(
            "absolute -right-2 top-1/2 -translate-y-1/2 h-3 w-3",
            "text-primary opacity-0 transition-opacity duration-200",
            "group-hover:opacity-100",
          )}
        />
      </button>
    );
  }

  return <Link href="/" className="group">{inner}</Link>;
}

// ---------------------------------------------------------------------------
// Nav sections + items
// ---------------------------------------------------------------------------

interface NavSectionProps {
  items: NavItem[];
  collapsed: boolean;
  isActive: (href: string) => boolean;
}

function NavSection({ items, collapsed, isActive }: NavSectionProps) {
  return (
    <ul className="space-y-1 px-2">
      {items.map((item) => (
        <NavItemLink
          key={item.href}
          item={item}
          collapsed={collapsed}
          active={isActive(item.href)}
        />
      ))}
    </ul>
  );
}

interface NavGroupProps {
  group: NavGroup;
  collapsed: boolean;
  isActive: (href: string) => boolean;
}

function NavGroup({ group, collapsed, isActive }: NavGroupProps) {
  return (
    <div className="mt-5">
      <div
        className={cn(
          "px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em]",
          "text-muted-foreground/70 overflow-hidden whitespace-nowrap",
          "transition-[opacity,height] duration-300 ease-out",
          collapsed && "h-0 py-0 opacity-0",
        )}
      >
        {group.groupLabel}
      </div>
      <ul className="space-y-1 px-2 mt-1">
        {group.items.map((item) => (
          <NavItemLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            active={isActive(item.href)}
          />
        ))}
      </ul>
    </div>
  );
}

interface NavItemLinkProps {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}

function NavItemLink({ item, collapsed, active }: NavItemLinkProps) {
  const className = cn(
    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
    "text-sm font-medium transition-all duration-200 ease-out",
    active
      ? "bg-pastel-blue text-primary"
      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:translate-x-0.5",
  );

  const inner = (
    <>
      {/* Active indicator: a soft blue bar on the left */}
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

      <span
        className={cn(
          "min-w-0 flex-1 truncate whitespace-nowrap overflow-hidden",
          "transition-[opacity,width] duration-300 ease-out",
          collapsed ? "opacity-0 w-0" : "opacity-100",
        )}
      >
        {item.label}
      </span>

      {item.external && !collapsed && (
        <ExternalLink
          className="h-3 w-3 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-foreground"
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
          title={collapsed ? `${item.label} (abrir en otra pestaña)` : undefined}
          className={className}
        >
          {inner}
        </a>
      ) : (
        <Link
          href={item.href}
          title={collapsed ? item.label : undefined}
          className={className}
        >
          {inner}
        </Link>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        "border-t border-sidebar-border px-3 py-3",
        "flex items-center gap-2",
        collapsed && "justify-center px-0",
      )}
    >
      <a
        href="https://github.com/MatiasGuaymas/Blog_Informatica"
        target="_blank"
        rel="noreferrer"
        title="Repositorio en GitHub"
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          "text-muted-foreground hover:bg-muted hover:text-foreground",
          "transition-all duration-200 hover:-translate-y-0.5",
        )}
      >
        <GithubIcon className="h-4 w-4" />
      </a>
      <div
        className={cn(
          "flex flex-col leading-tight overflow-hidden whitespace-nowrap",
          "transition-[opacity,width] duration-300 ease-out",
          collapsed ? "opacity-0 w-0" : "opacity-70",
        )}
      >
        <span className="text-[10px] text-muted-foreground">
          Hecho con 💙 por Matías Guaymas
        </span>
      </div>
    </div>
  );
}
