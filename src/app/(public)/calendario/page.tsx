import { ExternalLink } from "lucide-react";
import CalendarioView from "@/components/calendario/CalendarioView";
import { Reveal } from "@/components/motion/Reveal";

import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Calendario académico",
  description:
    "Calendario académico 2026 de la Facultad de Informática UNLP: clases, exámenes, inscripciones, recesos y feriados nacionales. Filtros por categoría y vista mensual.",
  path: "/calendario",
});

export default function CalendarioPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <Reveal trigger="mount">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Calendario académico 2026
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Calendario académico
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Las fechas que importan: cursada, inscripciones, mesas de final,
            feriados y recesos. Hacé click en un día para ver los eventos, o
            usá los filtros para enfocarte en lo que te interesa.
          </p>
          <p className="text-xs text-muted-foreground">
            <a
              href="https://www.info.unlp.edu.ar/calendario-academico-2026/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Calendario académico 2026 oficial
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </header>
      </Reveal>

      <Reveal trigger="mount" delay={0.1}>
        <CalendarioView />
      </Reveal>
    </div>
  );
}
