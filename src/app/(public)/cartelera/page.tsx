import { ExternalLink, MegaphoneOff } from "lucide-react";
import { AnuncioCard } from "@/components/cartelera/AnuncioCard";
import { AutoOpenAnuncioModal } from "@/components/cartelera/AutoOpenAnuncioModal";
import { CarteleraFilters } from "@/components/cartelera/CarteleraFilters";
import { CarteleraPagination } from "@/components/cartelera/CarteleraPagination";
import { Reveal } from "@/components/motion/Reveal";
import {
  aplicarFiltros,
  type FiltrosCartelera,
  fetchCartelera,
  listarMaterias,
  mensajeId,
} from "@/lib/cartelera";

export const revalidate = 300;

import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Cartelera",
  description:
    "Anuncios de cátedras y docentes de la Facultad de Informática UNLP en tiempo real. Cambios de fecha, mesas de final, parciales, links y PDFs. Datos de la cartelera virtual oficial.",
  path: "/cartelera",
});

interface PageProps {
  searchParams: Promise<{
    q?: string;
    materia?: string;
    carrera?: string;
    rango?: string;
    adjuntos?: string;
    anulados?: string;
    page?: string;
    /** Deep-link a un anuncio específico: abre su modal al cargar. */
    a?: string;
  }>;
}

const PER_PAGE = 12;

export default async function CarteleraPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const filtros: FiltrosCartelera = {
    q: sp.q,
    materia: sp.materia,
    carrera: sp.carrera,
    rango: sp.rango ?? "30",
    conAdjuntos: sp.adjuntos === "1",
    ocultarAnulados: sp.anulados !== "1",
  };

  const todos = await fetchCartelera();
  const filtrados = aplicarFiltros(todos, filtros);
  const materiasUnicas = listarMaterias(todos);

  // Deep-link: si la URL trae `?a=<id>`, buscamos ese mensaje en
  // TODOS los anuncios (no solo los filtrados/paginados) para poder
  // abrir su modal aunque no esté en la vista actual. Si el id no
  // matchea con nada, simplemente lo ignoramos.
  const mensajeDeepLink = sp.a
    ? todos.find((m) => mensajeId(m) === sp.a)
    : undefined;

  const page = clampPage(sp.page, filtrados.length);
  const start = (page - 1) * PER_PAGE;
  const visibles = filtrados.slice(start, start + PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));

  // Reconstruimos el query string actual (sin page) para los links de paginación.
  const baseQuery = buildBaseQuery(sp);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <Reveal trigger="mount">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Anuncios en tiempo real
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Cartelera
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Lo último que publicaron las cátedras: cambios de fecha, mesas de
            final, parciales, links, PDFs y todo lo que se anuncia desde gestión
            docente.
          </p>
          <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Se actualiza cada 5 minutos.</span>
            <span aria-hidden>·</span>
            <a
              href="https://gestiondocente.info.unlp.edu.ar/cartelera/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Cartelera oficial
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </header>
      </Reveal>

      <Reveal trigger="mount" delay={0.05}>
        <CarteleraFilters materias={materiasUnicas} />
      </Reveal>

      <ResultadosHeader
        total={filtrados.length}
        page={page}
        totalPages={totalPages}
      />

      {visibles.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid auto-rows-fr gap-4 sm:grid-cols-2">
          {visibles.map((m, i) => (
            <li key={`${m.fechaRaw}-${m.titulo}-${i}`} className="flex">
              <AnuncioCard mensaje={m} />
            </li>
          ))}
        </ul>
      )}

      <CarteleraPagination
        current={page}
        total={totalPages}
        baseQuery={baseQuery}
      />

      {/* Deep-link al anuncio: monta el modal abierto al cargar la
       * página. Se cierra normal y limpia el query param `a`. */}
      {mensajeDeepLink && <AutoOpenAnuncioModal mensaje={mensajeDeepLink} />}
    </div>
  );
}

function ResultadosHeader({
  total,
  page,
  totalPages,
}: {
  total: number;
  page: number;
  totalPages: number;
}) {
  if (total === 0) return null;
  return (
    <p className="text-xs text-muted-foreground">
      Mostrando <span className="font-semibold text-foreground">{total}</span>{" "}
      {total === 1 ? "resultado" : "resultados"}
      {totalPages > 1 && (
        <>
          {" "}
          ·{" "}
          <span className="font-medium">
            Página {page} de {totalPages}
          </span>
        </>
      )}
    </p>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
      <MegaphoneOff className="h-8 w-8 text-muted-foreground" />
      <div>
        <p className="text-sm font-semibold text-foreground">Sin resultados</p>
        <p className="text-xs text-muted-foreground">
          Probá ampliar el rango de fechas o sacar algunos filtros.
        </p>
      </div>
    </div>
  );
}

function clampPage(raw: string | undefined, totalResults: number): number {
  const n = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  const totalPages = Math.max(1, Math.ceil(totalResults / PER_PAGE));
  return Math.min(n, totalPages);
}

function buildBaseQuery(sp: {
  q?: string;
  materia?: string;
  carrera?: string;
  rango?: string;
  adjuntos?: string;
  anulados?: string;
}): string {
  const params = new URLSearchParams();
  if (sp.q) params.set("q", sp.q);
  if (sp.materia) params.set("materia", sp.materia);
  if (sp.carrera) params.set("carrera", sp.carrera);
  if (sp.rango && sp.rango !== "30") params.set("rango", sp.rango);
  if (sp.adjuntos) params.set("adjuntos", sp.adjuntos);
  if (sp.anulados) params.set("anulados", sp.anulados);
  return params.toString();
}
