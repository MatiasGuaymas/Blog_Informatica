"use client";

import { Filter, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { carreras } from "@/lib/carreras";
import { cn } from "@/lib/utils";

interface CarteleraFiltersProps {
  /** Lista de materias presentes en los mensajes para el dropdown. */
  materias: string[];
}

const RANGOS = [
  { value: "7", label: "7 días" },
  { value: "30", label: "30 días" },
  { value: "90", label: "90 días" },
  { value: "todo", label: "Todo" },
];

export function CarteleraFilters({ materias }: CarteleraFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Estado local para el buscador (debounced para no spamear el router).
  const [q, setQ] = useState(params.get("q") ?? "");
  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const carrera = params.get("carrera") ?? "";
  const materia = params.get("materia") ?? "";
  const rango = params.get("rango") ?? "30";
  const conAdjuntos = params.get("adjuntos") === "1";
  const ocultarAnulados = params.get("anulados") !== "1";

  // Aplica el debounce sobre q
  useEffect(() => {
    const current = params.get("q") ?? "";
    if (q === current) return;
    const t = setTimeout(() => updateParam("q", q || null), 300);
    return () => clearTimeout(t);
  }, [q]);

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
    next.delete("page"); // cualquier cambio reinicia paginación
    startTransition(() => {
      router.replace(`/cartelera?${next.toString()}`, { scroll: false });
    });
  }

  function setCarrera(slug: string) {
    updateParam("carrera", slug === carrera ? null : slug);
  }

  function setRango(value: string) {
    updateParam("rango", value === "30" ? null : value); // 30 = default, no lo guardamos
  }

  const hayFiltrosActivos = useMemo(() => {
    return (
      q !== "" ||
      carrera !== "" ||
      materia !== "" ||
      (rango !== "30" && rango !== "") ||
      conAdjuntos ||
      params.get("anulados") === "1"
    );
  }, [q, carrera, materia, rango, conAdjuntos, params]);

  function limpiar() {
    setQ("");
    startTransition(() => {
      router.replace("/cartelera", { scroll: false });
    });
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-4 sm:p-5 transition-opacity",
        isPending && "opacity-70",
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <Filter className="h-4 w-4 text-primary" />
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Filtros
        </h2>
        {hayFiltrosActivos && (
          <button
            type="button"
            onClick={limpiar}
            className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar título, materia, autor..."
          className={cn(
            "w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm",
            "placeholder:text-muted-foreground/70",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40",
            "transition-colors",
          )}
        />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {/* Carrera */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
            Carrera
          </span>
          <div className="flex flex-wrap gap-1.5">
            {carreras.map((c) => {
              const active = carrera === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setCarrera(c.slug)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all duration-200",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-pastel-blue/40 text-primary hover:bg-pastel-blue/70",
                  )}
                >
                  {c.nombreCorto}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rango temporal */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
            Cuándo
          </span>
          <div className="flex flex-wrap gap-1.5">
            {RANGOS.map((r) => {
              const active = (rango || "30") === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRango(r.value)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all duration-200",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted",
                  )}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Materia (dropdown) */}
        <div className="flex min-w-0 items-center gap-2">
          <label
            htmlFor="cartelera-materia"
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80"
          >
            Materia
          </label>
          <select
            id="cartelera-materia"
            value={materia}
            onChange={(e) => updateParam("materia", e.target.value || null)}
            className={cn(
              "min-w-0 max-w-xs rounded-full border border-border bg-background px-3 py-1 text-[12px]",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40",
              "transition-colors",
            )}
          >
            <option value="">Todas</option>
            {materias.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Toggles - flex-wrap para que en mobile pasen a 2 filas y no se
            corten los labels ("Mostrar anulados" no entraba en una fila). */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Toggle
            label="Solo con adjuntos"
            checked={conAdjuntos}
            onChange={(v) => updateParam("adjuntos", v ? "1" : null)}
          />
          <Toggle
            label="Mostrar anulados"
            checked={!ocultarAnulados}
            onChange={(v) => updateParam("anulados", v ? "1" : null)}
          />
        </div>
      </div>
    </section>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-[12px] text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        className={cn(
          "relative inline-block h-4 w-7 rounded-full transition-colors duration-200",
          checked ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-3 w-3 rounded-full bg-card shadow-sm transition-transform duration-200",
            checked ? "translate-x-3.5" : "translate-x-0.5",
          )}
        />
      </span>
      {label}
    </label>
  );
}
