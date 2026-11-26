import { ArrowUpRight, Info } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerList } from "@/components/motion/StaggerList";

import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Bibliografía",
  description:
    "Repositorios públicos de GitHub con los libros de la bibliografía oficial de cada materia, en PDF, organizados por carrera (APU y LS) y orden de cursada.",
  path: "/bibliografia",
});

interface RepoBibliografia {
  carreraSlug: string;
  sigla: string;
  carrera: string;
  href: string;
  description: string;
}

const repos: RepoBibliografia[] = [
  {
    carreraSlug: "apu",
    sigla: "APU",
    carrera: "Analista Programador Universitario",
    href: "https://github.com/MatiasGuaymas/Bibliografia-APU",
    description:
      "Libros en PDF de la bibliografía oficial de cada materia, organizados en carpetas numeradas por orden de cursada.",
  },
  {
    carreraSlug: "ls",
    sigla: "LS",
    carrera: "Licenciatura en Sistemas",
    href: "https://github.com/MatiasGuaymas/Bibliografia-LS",
    description:
      "Libros en PDF de la bibliografía oficial de cada materia, organizados en carpetas numeradas por orden de cursada.",
  },
];

export default function BibliografiaPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <Reveal trigger="mount">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Repositorios por carrera
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Bibliografía
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Dos repositorios públicos en GitHub con los libros de la
            bibliografía oficial de cada materia, en PDF, organizados por
            carrera y por orden de cursada.
          </p>
        </header>
      </Reveal>

      <Reveal trigger="mount" delay={0.05}>
        <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-pastel-blue/40 p-4 text-sm text-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="space-y-1">
            <p>
              <strong className="font-semibold">Importante:</strong> los
              primeros 2 años son{" "}
              <strong className="font-semibold">idénticos</strong> en las 4
              carreras de la facultad (APU, ATIC, LS y LI). Para esas materias
              cualquiera de los dos repositorios te sirve.
            </p>
            <p className="text-muted-foreground">
              Las diferencias aparecen desde el tercer año. APU y ATIC cierran
              en 3° año con su recorrido propio; LS y LI siguen hasta 5° año
              compartiendo la mayoría de las asignaturas.
            </p>
          </div>
        </div>
      </Reveal>

      <StaggerList
        className="grid gap-4 md:grid-cols-2"
        staggerMs={90}
        delay={0.15}
      >
        {repos.map((repo) => (
          <a
            key={repo.carreraSlug}
            href={repo.href}
            target="_blank"
            rel="noreferrer"
            className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-pastel-blue opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
              aria-hidden="true"
            />

            <div className="relative flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">
                  {repo.sigla}
                </p>
                <h2 className="flex items-center gap-2 text-lg font-semibold leading-tight text-foreground">
                  <GithubIcon className="h-4 w-4" />
                  Bibliografia-{repo.sigla}
                </h2>
                <p className="text-sm text-muted-foreground">{repo.carrera}</p>
              </div>
              <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>

            <p className="relative text-sm leading-relaxed text-muted-foreground">
              {repo.description}
            </p>
          </a>
        ))}
      </StaggerList>
    </div>
  );
}
