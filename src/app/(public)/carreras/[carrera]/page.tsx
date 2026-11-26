import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CorrelativasGraphTrigger } from "@/components/correlativas/CorrelativasGraphTrigger";
import { Reveal } from "@/components/motion/Reveal";
import {
  type Carrera,
  type Cuatrimestre,
  type PlanRow,
  carreras,
  getCarreraBySlug,
  getMateriaSlug,
  hasMateriaSlug,
} from "@/lib/carreras";
import { pageMetadata } from "@/lib/site";

interface Params {
  carrera: string;
}

/**
 * Slugs de carreras que muestran el botón de "Ver grafo de correlativas".
 * El componente es genérico: lee el plan de cada `Carrera` y arma el
 * grafo dinámicamente.
 */
const GRAFO_HABILITADO_PARA: string[] = ["apu", "atic", "li", "ls"];

export function generateStaticParams(): Params[] {
  return carreras.map((c) => ({ carrera: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { carrera } = await params;
  const c = getCarreraBySlug(carrera);
  if (!c) return {};
  return pageMetadata({
    title: `${c.nombre} · Plan 2021`,
    description: `${c.descripcion} ${c.duracionAnios} años, ${c.cantidadAsignaturas} asignaturas. Plan oficial vigente con materias, correlativas y duración.`,
    path: `/carreras/${c.slug}`,
  });
}

export default async function CarreraPlanPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { carrera } = await params;
  const c = getCarreraBySlug(carrera);
  if (!c) notFound();

  const grouped = groupByAnioCuatrimestre(c.plan);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <Reveal trigger="mount">
        <Link
          href="/carreras"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Carreras
        </Link>
      </Reveal>

      <Reveal trigger="mount" delay={0.05}>
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {c.nombreCorto} · Plan 2021
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {c.nombre}
          </h1>
          <p className="max-w-prose text-muted-foreground">{c.descripcion}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2 text-xs text-muted-foreground">
            <span>{c.duracionAnios} años</span>
            <span aria-hidden>·</span>
            <span>{c.cantidadAsignaturas} asignaturas</span>
            <span aria-hidden>·</span>
            <a
              href={c.planUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Plan oficial <ExternalLink className="h-3 w-3" />
            </a>
            {/* El grafo de correlativas vive como otro link del header,
             * misma escala que "Plan oficial". Solo APU mientras
             * validamos la UX; cuando esté afilada sumar las demás. */}
            {GRAFO_HABILITADO_PARA.includes(c.slug) && (
              <>
                <span aria-hidden>·</span>
                <CorrelativasGraphTrigger carrera={c} />
              </>
            )}
          </div>
        </header>
      </Reveal>

      <div className="space-y-12">
        {grouped.map(({ anio, bloques }, idx) => (
          <Reveal key={anio} trigger={idx < 2 ? "mount" : "view"} delay={idx < 2 ? 0.1 + idx * 0.05 : 0}>
            <section className="space-y-4">
              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl font-bold text-foreground">
                  {anio === 0 ? "Curso de ingreso" : `Año ${anio}`}
                </h2>
                <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {bloques.map(({ cuatrimestre, rows }) => (
                  <PlanBloque
                    key={`${anio}-${cuatrimestre}`}
                    cuatrimestre={cuatrimestre}
                    rows={rows}
                  />
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

interface BloqueProps {
  cuatrimestre: Cuatrimestre;
  rows: PlanRow[];
}

function PlanBloque({ cuatrimestre, rows }: BloqueProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-md">
      <div className="border-b border-border bg-pastel-blue/40 px-4 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
          {labelCuatrimestre(cuatrimestre)}
        </p>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <PlanRowItem
            key={`${row.codigo}-${row.anio}-${row.cuatrimestre}`}
            row={row}
          />
        ))}
      </ul>
    </div>
  );
}

function PlanRowItem({ row }: { row: PlanRow }) {
  // externalUrl tiene precedencia: las optativas linkean al listado oficial
  // de la facultad en vez de tener un detalle interno propio. Si no hay URL
  // externa, caemos al detalle interno cuando la materia tenga slug
  // registrado en `materiaSlugs`, y si tampoco hay, queda como fila no
  // clickeable.
  const isExternal = Boolean(row.externalUrl);
  const slug = !isExternal ? getMateriaSlug(row.codigo) : undefined;
  const isInternal = !isExternal && hasMateriaSlug(row.codigo);
  const isInteractive = isExternal || isInternal;

  const inner = (
    <>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-mono text-[11px] font-medium text-muted-foreground">
          {row.codigo}
        </span>
        <span
          className={
            isInteractive
              ? "text-sm font-medium text-foreground transition-colors group-hover:text-primary"
              : "text-sm font-medium text-foreground"
          }
        >
          {row.nombre}
        </span>
        {isExternal && (
          <ExternalLink
            className="h-3 w-3 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
            aria-hidden
          />
        )}
        {row.tipo &&
          row.tipo !== "obligatoria" &&
          row.tipo !== "introductoria" && (
            <span className="rounded-full bg-pastel-amber px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/70">
              {row.tipo}
            </span>
          )}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>{row.duracion}</span>
        {row.correlativas.length > 0 && (
          <span>
            Correlativas:{" "}
            <span className="font-mono">{row.correlativas.join(", ")}</span>
          </span>
        )}
      </div>

      {row.opciones && row.opciones.length > 0 && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Opciones:</span>{" "}
          {row.opciones.join(" · ")}
        </p>
      )}

      {row.nota && (
        <p className="text-xs italic text-muted-foreground/80">{row.nota}</p>
      )}
    </>
  );

  if (isExternal && row.externalUrl) {
    return (
      <li>
        <a
          href={row.externalUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex flex-col gap-1.5 px-4 py-3 transition-colors duration-200 hover:bg-pastel-blue/30"
          aria-label={`${row.nombre} (abre en info.unlp.edu.ar)`}
        >
          {inner}
        </a>
      </li>
    );
  }

  if (isInternal && slug) {
    return (
      <li>
        <Link
          href={`/materia/${slug}`}
          className="group flex flex-col gap-1.5 px-4 py-3 transition-colors duration-200 hover:bg-pastel-blue/30"
        >
          {inner}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <div className="flex flex-col gap-1.5 px-4 py-3">{inner}</div>
    </li>
  );
}

interface Bloque {
  cuatrimestre: Cuatrimestre;
  rows: PlanRow[];
}

interface AnioGroup {
  anio: number;
  bloques: Bloque[];
}

function groupByAnioCuatrimestre(plan: PlanRow[]): AnioGroup[] {
  const map = new Map<number, Map<Cuatrimestre, PlanRow[]>>();

  for (const row of plan) {
    const anio = row.cuatrimestre === "intro" ? 0 : row.anio;
    const inner = map.get(anio) ?? new Map<Cuatrimestre, PlanRow[]>();
    const list = inner.get(row.cuatrimestre) ?? [];
    list.push(row);
    inner.set(row.cuatrimestre, list);
    map.set(anio, inner);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([anio, inner]) => ({
      anio,
      bloques: Array.from(inner.entries())
        .sort(sortCuat)
        .map(([cuatrimestre, rows]) => ({ cuatrimestre, rows })),
    }));
}

function sortCuat(
  a: [Cuatrimestre, PlanRow[]],
  b: [Cuatrimestre, PlanRow[]],
): number {
  const order: Record<string, number> = { intro: 0, "1": 1, "2": 2 };
  return (order[String(a[0])] ?? 99) - (order[String(b[0])] ?? 99);
}

function labelCuatrimestre(c: Cuatrimestre): string {
  if (c === "intro") return "Curso de ingreso";
  return `Cuatrimestre ${c}`;
}

export type { Carrera };
