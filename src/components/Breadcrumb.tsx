"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { carreras, materiaSlugs } from "@/lib/carreras";

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
  navigable: boolean;
}

// Mapeo explícito para segmentos cuya transformación no es "uppercase".
const segmentLabels: Record<string, string> = {
  carreras: "Carreras",
  materia: "Materia",
  calendario: "Calendario",
  cartelera: "Cartelera",
  bibliografia: "Bibliografía",
  links: "Links útiles",
  "sobre-mi": "Sobre mí",
  admin: "Admin",
  // Carreras -> su sigla en mayúsculas (apu->APU, ls->LS, etc.).
  ...Object.fromEntries(carreras.map((c) => [c.slug, c.nombreCorto])),
};

/**
 * Segmentos que NO tienen una página propia: solo son prefijos de
 * rutas dinámicas. Aparecen en el breadcrumb como texto plano (no
 * link) porque clickearlos llevaría a un 404. Ejemplo: en `/materia/epa`
 * el segmento "Materia" se muestra pero no es clickeable porque no
 * existe `/materia` como página.
 */
const NON_NAVIGABLE_SEGMENTS = new Set<string>(["materia", "admin"]);

/**
 * Slugs de materia (epa, taller, seminario, mat1, ttps, etc.). En
 * el breadcrumb los mostramos en uppercase porque son siglas
 * técnicas, aunque la URL los conserve en lowercase.
 */
const MATERIA_SLUGS = new Set<string>(Object.values(materiaSlugs));

function humanize(segment: string): string {
  const decoded = decodeURIComponent(segment);
  if (segmentLabels[decoded]) return segmentLabels[decoded];
  // Slugs de materia: siempre uppercase ("taller" -> "TALLER",
  // "epa" -> "EPA", "seminario" -> "SEMINARIO").
  if (MATERIA_SLUGS.has(decoded)) return decoded.toUpperCase();
  // Cualquier slug "tipo código" (con dígitos: si106, at310, oi309) o
  // cualquier slug corto en alfanumérico se muestra en mayúsculas.
  if (/\d/.test(decoded) || /^[a-z0-9-]{1,5}$/.test(decoded)) {
    return decoded.toUpperCase();
  }
  return decoded.replace(/-/g, " ");
}

export default function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  // If on home page, don't show breadcrumb (logo is shown instead)
  if (segments.length === 0) {
    return null;
  }

  const items: BreadcrumbItem[] = [];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    items.push({
      label: humanize(segment),
      href: currentPath,
      isLast: index === segments.length - 1,
      navigable: !NON_NAVIGABLE_SEGMENTS.has(decodeURIComponent(segment)),
    });
  });

  return (
    <nav aria-label="Migas de pan" className="flex items-center">
      <ol className="flex items-center gap-1 text-sm">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
            )}
            {item.isLast ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : item.navigable ? (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              // Segmento intermedio sin página propia: texto plano para
              // evitar que clickearlo lleve a un 404.
              <span className="text-muted-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
