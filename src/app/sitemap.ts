import type { MetadataRoute } from "next";
import { carreras, getAllMateriaSlugs } from "@/lib/carreras";
import { SITE } from "@/lib/site";

const STATIC_PATHS: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/carreras", changeFrequency: "monthly", priority: 0.9 },
  { path: "/calendario", changeFrequency: "weekly", priority: 0.8 },
  { path: "/cartelera", changeFrequency: "hourly", priority: 0.8 },
  { path: "/bibliografia", changeFrequency: "monthly", priority: 0.7 },
  { path: "/links", changeFrequency: "monthly", priority: 0.6 },
  { path: "/sobre-mi", changeFrequency: "yearly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE.url}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  // Página por carrera (4 entries)
  const carrerasEntries: MetadataRoute.Sitemap = carreras.map((c) => ({
    url: `${SITE.url}/carreras/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Página por materia: una entry por cada slug registrado en
  // `materiaSlugs`. Las materias sin slug no aparecen (404 en runtime).
  const materiasEntries: MetadataRoute.Sitemap = getAllMateriaSlugs().map(
    (slug) => ({
      url: `${SITE.url}/materia/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  return [...staticEntries, ...carrerasEntries, ...materiasEntries];
}
