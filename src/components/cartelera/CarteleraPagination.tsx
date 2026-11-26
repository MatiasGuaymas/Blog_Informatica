import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CarteleraPaginationProps {
  current: number;
  total: number;
  /** Query string ya armado (sin "?", sin "page="). */
  baseQuery: string;
}

export function CarteleraPagination({
  current,
  total,
  baseQuery,
}: CarteleraPaginationProps) {
  if (total <= 1) return null;

  const buildHref = (page: number): string => {
    const params = new URLSearchParams(baseQuery);
    if (page === 1) params.delete("page");
    else params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/cartelera?${qs}` : "/cartelera";
  };

  const pages = computeVisiblePages(current, total);

  return (
    <nav
      aria-label="Paginación de la cartelera"
      className="flex items-center justify-center gap-1"
    >
      <PageLink
        href={buildHref(Math.max(1, current - 1))}
        disabled={current === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </PageLink>

      {pages.map((p, idx) =>
        p === "..." ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: spacers no participan de la lista lógica
          <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <PageLink
            key={p}
            href={buildHref(p)}
            active={p === current}
            aria-label={`Página ${p}`}
            aria-current={p === current ? "page" : undefined}
          >
            {p}
          </PageLink>
        ),
      )}

      <PageLink
        href={buildHref(Math.min(total, current + 1))}
        disabled={current === total}
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </PageLink>
    </nav>
  );
}

interface PageLinkProps extends React.AriaAttributes {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

function PageLink({
  href,
  active = false,
  disabled = false,
  children,
  ...aria
}: PageLinkProps) {
  const className = cn(
    "inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium transition-all duration-200",
    active
      ? "bg-primary text-primary-foreground shadow-sm"
      : "text-foreground hover:bg-pastel-blue/40 hover:text-primary",
    disabled && "pointer-events-none opacity-40",
  );

  if (disabled) {
    return (
      <span className={className} {...aria}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className} {...aria} scroll={false}>
      {children}
    </Link>
  );
}

/**
 * Devuelve algo como [1, "...", 4, 5, 6, "...", 42] para current=5, total=42.
 * Mantiene siempre 1 y total visibles, más una ventana alrededor de current.
 */
function computeVisiblePages(
  current: number,
  total: number,
): Array<number | "..."> {
  const WINDOW = 1; // cuántas páginas a cada lado de current
  const set = new Set<number>([1, total]);
  for (let i = current - WINDOW; i <= current + WINDOW; i++) {
    if (i >= 1 && i <= total) set.add(i);
  }
  const ordered = Array.from(set).sort((a, b) => a - b);
  const result: Array<number | "..."> = [];
  for (let i = 0; i < ordered.length; i++) {
    if (i > 0 && ordered[i] - ordered[i - 1] > 1) result.push("...");
    result.push(ordered[i]);
  }
  return result;
}
