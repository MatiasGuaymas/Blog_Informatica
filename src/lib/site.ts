// Configuración del sitio para SEO, OG, sitemap, etc.
//
// El URL canónico se toma de NEXT_PUBLIC_SITE_URL (Vercel lo expone como
// VERCEL_URL en deploys, pero NEXT_PUBLIC_SITE_URL es nuestro override
// estable). Default a un placeholder local en dev.
//
// Para producir un build correcto antes de configurar el dominio, leer
// la env var en runtime y caer al default.

import type { Metadata } from "next";

const FALLBACK_URL = "https://blog-informatica.vercel.app";

function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return FALLBACK_URL;
}

export const SITE = {
  name: "Blog Informática UNLP",
  shortName: "Blog Informática",
  description:
    "Compañero de estudio para las carreras de la Facultad de Informática UNLP (APU, ATIC, Licenciatura en Sistemas y Licenciatura en Informática): planes de estudio, cartelera en vivo, calendario, bibliografía, material y recomendaciones para cada cursada.",
  /** URL absoluto del sitio sin trailing slash. */
  url: resolveSiteUrl(),
  locale: "es_AR",
  author: {
    name: "Matías Guaymas",
    url: "https://github.com/MatiasGuaymas",
    // Datos para enriquecer el JSON-LD Person del root layout.
    jobTitle: "Forward Deployed Engineer",
    /**
     * Perfiles públicos que Google une al Person via @id. Sumar acá
     * cualquier perfil profesional nuevo (portfolio, etc.).
     */
    sameAs: [
      "https://github.com/MatiasGuaymas",
      "https://www.linkedin.com/in/matiasguaymas/",
      "https://www.instagram.com/matiguaymas_/",
    ],
    knowsAbout: [
      "Software Engineering",
      "TypeScript",
      "React",
      "Next.js",
      "Python",
      ".NET",
      "Linux",
    ],
  },
  /** Institución educativa que publica las carreras del blog. */
  publisher: {
    name: "Facultad de Informática - UNLP",
    url: "https://www.info.unlp.edu.ar/",
    parentName: "Universidad Nacional de La Plata",
    parentUrl: "https://unlp.edu.ar/",
  },
  keywords: [
    "UNLP",
    "Facultad de Informática",
    "Informática UNLP",
    "APU",
    "ATIC",
    "Licenciatura en Sistemas",
    "Licenciatura en Informática",
    "Plan 2021",
    "Calendario académico",
    "Cartelera",
    "Bibliografía",
    "Apuntes",
    "Materias",
    "La Plata",
    "Universidad Nacional de La Plata",
  ],
} as const;

/** Construye una URL absoluta a partir de un path relativo. */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${normalized}`;
}

/**
 * Helper para armar el metadata de cada página con canonical, OG y
 * Twitter coherentes. El título se inyecta en la plantilla del root
 * (`%s · Blog Informática UNLP`), así que pasalo SIN sufijo.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  /** Título solo de la sección, sin "· Blog Informática UNLP". */
  title: string;
  description: string;
  /** Path relativo al sitio, ej. "/carreras". */
  path: string;
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} · ${SITE.name}`;
  // Repetimos `images` en cada página porque Next no mergea el openGraph
  // del root con el de la página: si lo definís acá, el root entero queda
  // sobrescrito y se pierde el og:image. Mismo motivo en twitter.
  const ogImages = [
    {
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt: SITE.name,
    },
  ];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      title: fullTitle,
      description,
      url,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}
