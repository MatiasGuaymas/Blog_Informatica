import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  findPlanRow,
  getAllMateriaSlugs,
  getCarrerasContaining,
  getCodigoBySlug,
  getMateriaDetail,
} from "@/lib/carreras";
import { pageMetadata } from "@/lib/site";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  // Pre-renderizamos todos los slugs registrados en `materiaSlugs`. Las
  // materias sin slug devuelven 404 (la fila tampoco es clickable en el
  // plan). Los slugs siempre vienen lowercase en la URL.
  return getAllMateriaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const codigo = getCodigoBySlug(slug);
  if (!codigo) return {};
  const row = findPlanRow(codigo);
  if (!row) return {};
  const detail = getMateriaDetail(codigo);
  return pageMetadata({
    title: `${row.nombre} (${row.codigo})`,
    description:
      detail?.resumen ||
      `${row.nombre}: ${row.duracion.toLowerCase()}, materia del plan 2021 de la Facultad de Informática UNLP.`,
    path: `/materia/${slug}`,
  });
}

export default async function MateriaDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const codigo = getCodigoBySlug(slug);
  if (!codigo) notFound();

  const row = findPlanRow(codigo);
  if (!row) notFound();

  const detail = getMateriaDetail(codigo);
  const apareceEn = getCarrerasContaining(row.codigo);

  // El detalle editorial es opcional: si todavía no escribí resumen para
  // esta materia, mostramos el header igual (con código, nombre,
  // correlativas, dónde aparece) y un placeholder amistoso en lugar del
  // bloque de resumen / recomendaciones / material. Eso permite que la URL
  // sea estable desde el día uno y que ir agregando contenido sea aditivo.
  const hasContent = Boolean(
    detail?.resumen ||
      detail?.recomendaciones ||
      (detail?.links && detail.links.length > 0),
  );

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-8">
      <Link
        href="/carreras"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Carreras
      </Link>

      <header className="space-y-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
          {row.codigo}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {row.nombre}
        </h1>
        {detail?.resumen && (
          <p className="max-w-prose text-lg leading-relaxed text-muted-foreground">
            {detail.resumen}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
            {row.duracion}
          </span>
        </div>

        {row.correlativas.length > 0 && (
          <p className="pt-1 text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              {row.correlativas.length === 1 ? "Correlativa:" : "Correlativas:"}
            </span>{" "}
            {row.correlativas
              .map((codigo) => findPlanRow(codigo)?.nombre ?? codigo)
              .join(", ")}
          </p>
        )}
      </header>

      {!hasContent && <ContenidoEnPreparacion />}

      {detail?.recomendaciones && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Recomendaciones
          </h2>
          <p className="max-w-prose leading-relaxed text-muted-foreground">
            {detail.recomendaciones}
          </p>
        </section>
      )}

      {detail?.links && detail.links.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Material</h2>
          <ul className="space-y-2">
            {detail.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary transition-colors hover:underline"
                >
                  {link.label}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {apareceEn.length > 0 && (
        <section className="space-y-3 border-t border-border pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Aparece en el plan de
          </h2>
          <ul className="flex flex-wrap gap-2">
            {apareceEn.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/carreras/${c.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  {c.nombreCorto}
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{c.nombre}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

/**
 * Placeholder cuando la materia tiene URL estable pero todavía no hay
 * resumen/recomendaciones/links. Se ve amable, no como un 404 disfrazado.
 */
function ContenidoEnPreparacion() {
  return (
    <section className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-pastel-blue/30 p-5 text-sm">
      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pastel-blue/70 text-primary">
        <Sparkles className="h-4 w-4" />
      </span>
      <div className="space-y-1">
        <p className="font-medium text-foreground">Notas en preparación</p>
        <p className="text-muted-foreground">
          Todavía no escribí mis recomendaciones para esta materia. Mientras
          tanto, mirá el resto del plan en la página de tu carrera y la
          cartelera oficial.
        </p>
      </div>
    </section>
  );
}
