"use client";

import { Calendar, FileText, Link as LinkIcon, User } from "lucide-react";
import {
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type Mensaje,
  adjuntoEsPdf,
  formatFechaCompleta,
  formatRelative,
} from "@/lib/cartelera";
import { cn } from "@/lib/utils";

interface AnuncioCardProps {
  mensaje: Mensaje;
}

export function AnuncioCard({ mensaje }: AnuncioCardProps) {
  const [open, setOpen] = useState(false);
  const [bodyOverflows, setBodyOverflows] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const fechaRelativa = formatRelative(mensaje.fecha);
  const fechaCompleta = formatFechaCompleta(mensaje.fecha);

  // Sólo aplicamos la fade-out al final del cuerpo cuando ESTÁ overflowing.
  // ResizeObserver para que el cálculo se actualice si la card cambia de
  // ancho (responsive) o el contenido se re-renderea.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const check = () => setBodyOverflows(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Click en cualquier parte de la card abre el modal, EXCEPTO si el click
  // viene de un <a> (link en el cuerpo) o un botón. Así los links del
  // anuncio funcionan directo sin tener que abrir el modal primero.
  function handleCardClick(e: MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    if (target.closest("a, button")) return;
    setOpen(true);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    // Sólo si el foco está en la card misma, no en un link interno.
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  return (
    <>
      {/* biome-ignore lint/a11y/useSemanticElements: <article> con role=button es la forma correcta cuando el contenido tiene links internos interactivos */}
      <article
        role="button"
        tabIndex={0}
        aria-label={`Ver completo: ${mensaje.titulo}`}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "group relative flex h-full w-full cursor-pointer flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:p-6",
          "transition-all duration-300",
          "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          mensaje.isAnulado && "opacity-60",
        )}
      >
        {/* Anulado badge */}
        {mensaje.isAnulado && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-300/40 bg-rose-50 px-3 py-1.5 text-[11px] dark:border-rose-700/40 dark:bg-rose-950/30">
            <span className="font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              Anulado
            </span>
            {mensaje.fechaAnulacion && (
              <span className="text-rose-700/70 dark:text-rose-300/70">
                {formatFechaCompleta(mensaje.fechaAnulacion)}
              </span>
            )}
          </div>
        )}

        {/* Header: chips de carrera + fecha relativa */}
        <header className="flex flex-wrap items-center gap-2 text-xs">
          {mensaje.carreras.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {mensaje.carreras.map((c) => (
                <span
                  key={c.slug}
                  className="inline-flex items-center rounded-full bg-pastel-blue/60 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-primary"
                  title={c.nombre}
                >
                  {c.nombreCorto}
                </span>
              ))}
            </div>
          )}
          <time
            dateTime={mensaje.fecha.toISOString()}
            title={fechaCompleta}
            className="ml-auto inline-flex items-center gap-1 text-muted-foreground"
          >
            <Calendar className="h-3 w-3" />
            {fechaRelativa}
          </time>
        </header>

        {/* Title + Materia */}
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-tight text-foreground sm:text-lg">
            {mensaje.titulo}
          </h3>
          <p className="line-clamp-1 text-sm font-medium text-primary">
            {mensaje.materia}
          </p>
        </div>

        {/* Cuerpo: HTML con paragraphs y links clickeables. Los links del
            anuncio funcionan directo gracias al check en handleCardClick.
            cartelera-body-preview hace cap de altura sin recortar nada
            visual; el fade del final sólo aparece cuando data-faded="true"
            (medido en runtime con ResizeObserver). */}
        <div
          ref={bodyRef}
          data-faded={bodyOverflows}
          className="cartelera-body cartelera-body-preview text-sm leading-relaxed text-foreground/90"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: el HTML viene de sanitize-html con allowlist conservador
          dangerouslySetInnerHTML={{ __html: mensaje.cuerpoHtml }}
        />

        {/* Footer: autor + cantidad de adjuntos */}
        <footer className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <User className="h-3 w-3" />
            <span className="truncate">{mensaje.autor}</span>
          </span>
          {mensaje.adjuntos.length > 0 && (
            <span className="inline-flex items-center gap-1.5 text-foreground/70">
              <FileText className="h-3 w-3" />
              {mensaje.adjuntos.length}{" "}
              {mensaje.adjuntos.length === 1 ? "adjunto" : "adjuntos"}
            </span>
          )}
          <span className="ml-auto text-[11px] font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Ver completo →
          </span>
        </footer>
      </article>

      <AnuncioModal
        mensaje={mensaje}
        open={open}
        onOpenChange={setOpen}
        fechaCompleta={fechaCompleta}
      />
    </>
  );
}

interface AnuncioModalProps {
  mensaje: Mensaje;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fechaCompleta: string;
}

// Exportado para que el deep-link `/cartelera?a=<id>` pueda montar el
// modal directamente sin depender de que el anuncio esté en la grilla
// paginada actual.
export function AnuncioModal({
  mensaje,
  open,
  onOpenChange,
  fechaCompleta,
}: AnuncioModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-[min(95vw,48rem)] p-0"
        closeLabel="Cerrar"
      >
        {/* Padding-right en el header para no chocar con el botón X */}
        <div className="flex max-h-[85vh] flex-col">
          <header className="space-y-3 border-b border-border px-6 py-5 pr-14">
            {mensaje.isAnulado && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-300/40 bg-rose-50 px-3 py-1.5 text-[11px] dark:border-rose-700/40 dark:bg-rose-950/30">
                <span className="font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                  Anulado
                </span>
                {mensaje.fechaAnulacion && (
                  <span className="text-rose-700/70 dark:text-rose-300/70">
                    {formatFechaCompleta(mensaje.fechaAnulacion)}
                  </span>
                )}
              </div>
            )}

            {mensaje.carreras.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {mensaje.carreras.map((c) => (
                  <span
                    key={c.slug}
                    className="inline-flex items-center rounded-full bg-pastel-blue/60 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-primary"
                    title={c.nombre}
                  >
                    {c.nombreCorto}
                  </span>
                ))}
              </div>
            )}

            <DialogTitle className="text-xl font-bold leading-tight text-foreground sm:text-2xl">
              {mensaje.titulo}
            </DialogTitle>

            <p className="text-sm font-medium text-primary">{mensaje.materia}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3 w-3" />
                {mensaje.autor}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {fechaCompleta}
              </span>
            </div>
          </header>

          {/* Cuerpo scrolleable */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div
              className="cartelera-body text-sm leading-relaxed text-foreground/90"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: el HTML viene de sanitize-html con allowlist conservador
              dangerouslySetInnerHTML={{ __html: mensaje.cuerpoHtml }}
            />

            {mensaje.adjuntos.length > 0 && (
              <section className="mt-6 space-y-2 border-t border-border pt-4">
                <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Adjuntos ({mensaje.adjuntos.length})
                </h4>
                <ul className="flex flex-wrap gap-1.5">
                  {mensaje.adjuntos.map((a) => {
                    const Icono = adjuntoEsPdf(a) ? FileText : LinkIcon;
                    return (
                      <li key={a.public_path}>
                        <a
                          href={a.public_path}
                          target="_blank"
                          rel="noreferrer"
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground",
                            "hover:border-primary/40 hover:bg-pastel-blue/40 hover:text-primary",
                            "transition-colors duration-200",
                          )}
                        >
                          <Icono className="h-3 w-3" />
                          <span className="max-w-[40ch] truncate">
                            {a.nombre}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
