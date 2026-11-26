import { ArrowRight, BookOpen, Clock, ExternalLink, Layers } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerList } from "@/components/motion/StaggerList";
import { carreras } from "@/lib/carreras";

import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Carreras",
  description:
    "Las 4 carreras de la Facultad de Informática UNLP: APU, ATIC, Licenciatura en Sistemas y Licenciatura en Informática. Plan 2021 con materias, correlativas y duración.",
  path: "/carreras",
});

export default function CarrerasIndexPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <Reveal trigger="mount">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Plan de estudios 2021
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Carreras
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Elegí una carrera para ver el plan de estudios completo (año a año,
            con correlativas y duración). Las materias con notas y opinión
            personal aparecen como links a su página de detalle.
          </p>
        </header>
      </Reveal>

      <StaggerList
        className="grid gap-4 sm:grid-cols-2"
        staggerMs={90}
        delay={0.1}
      >
        {carreras.map((c) => (
          <Link
            key={c.slug}
            href={`/carreras/${c.slug}`}
            className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            {/* Decorative pastel blob */}
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-pastel-blue opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
              aria-hidden="true"
            />

            <div className="relative flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">
                  {c.nombreCorto}
                </p>
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                  {c.nombre}
                </h2>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
            </div>

            <p className="relative text-sm leading-relaxed text-muted-foreground">
              {c.descripcion}
            </p>

            <div className="relative mt-auto flex flex-wrap items-center gap-3 pt-2 text-xs text-muted-foreground">
              <Pill icon={<Clock className="h-3.5 w-3.5" />}>
                {c.duracionAnios} años
              </Pill>
              <Pill icon={<BookOpen className="h-3.5 w-3.5" />}>
                {c.cantidadAsignaturas} asignaturas
              </Pill>
              <Pill icon={<Layers className="h-3.5 w-3.5" />}>Plan 2021</Pill>
            </div>
          </Link>
        ))}
      </StaggerList>

      <Reveal trigger="view">
        <p className="text-xs text-muted-foreground">
          Datos extraídos de los planes oficiales en{" "}
          <a
            href="https://www.info.unlp.edu.ar/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            info.unlp.edu.ar
            <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </Reveal>
    </div>
  );
}

function Pill({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
      {icon}
      {children}
    </span>
  );
}
