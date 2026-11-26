"use client";

import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  CATEGORIA_LABELS,
  CATEGORIA_STYLES,
  CATEGORIAS_ORDEN,
  type EventoCalendario,
  type EventoCategoria,
  diasDeRango,
  eventosActivos,
  eventosCalendario,
  eventosEnDia,
  eventosProximos,
  formatFechaLarga,
  formatLocalDate,
  formatRango,
  isSameDay,
  nombreMes,
  parseLocalDate,
  progresoDeEvento,
} from "@/lib/calendario";

/**
 * Eventos demasiado largos (semestres, recesos, periodos de inscripción
 * a carrera) NO se pintan en cada celda del calendario porque cubren
 * decenas de días y saturan la grilla. Se ven en el bloque "En curso ahora".
 */
const LONG_RANGE_THRESHOLD_DAYS = 14;
function esEventoLargo(ev: EventoCalendario): boolean {
  return (
    ev.tipo === "rango" && diasDeRango(ev.inicio, ev.fin) > LONG_RANGE_THRESHOLD_DAYS
  );
}
import { cn } from "@/lib/utils";

// Para resaltar el evento "más importante" en una celda con varios.
const PRIORIDAD: Record<EventoCategoria, number> = {
  examenes: 5,
  inscripciones: 4,
  feriado: 3,
  clases: 2,
  receso: 1,
  otro: 0,
};

const MES_CORTO = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

export default function CalendarioView() {
  // `today` se recalcula cada minuto para que "En curso ahora", el
  // resaltado del día actual y "Próximos N días" sigan correctos aunque
  // la pestaña quede abierta cruzando la medianoche.
  const [today, setToday] = useState<Date>(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setToday(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // El mes inicial es el del día en que se abre la página, sea cual sea
  // el año. Así el calendario sigue siendo útil después de 2026.
  const [viewYear, setViewYear] = useState<number>(() =>
    new Date().getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState<number>(() =>
    new Date().getMonth(),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [filtros, setFiltros] = useState<Set<EventoCategoria>>(
    () => new Set(CATEGORIAS_ORDEN),
  );

  const filteredEventos = useMemo(
    () => eventosCalendario.filter((ev) => filtros.has(ev.categoria)),
    [filtros],
  );

  const enCurso = useMemo(
    () =>
      eventosActivos(today, filteredEventos).filter(
        (ev) => ev.tipo === "rango" && diasDeRango(ev.inicio, ev.fin) > 14,
      ),
    [today, filteredEventos],
  );

  const proximos = useMemo(() => {
    const enCursoIds = new Set(enCurso.map((e) => e.id));
    return eventosProximos(today, 30, filteredEventos).filter(
      (ev) => !enCursoIds.has(ev.id),
    );
  }, [today, filteredEventos, enCurso]);

  function toggleFiltro(cat: EventoCategoria) {
    setFiltros((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function shiftMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function jumpToToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(today);
  }

  return (
    <div className="flex flex-col gap-12">
      <Filtros filtros={filtros} onToggle={toggleFiltro} />

      {enCurso.length > 0 && <EnCursoBloque eventos={enCurso} today={today} />}

      <CalendarioMensual
        year={viewYear}
        month={viewMonth}
        today={today}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onShiftMonth={shiftMonth}
        onJumpToday={jumpToToday}
        eventos={filteredEventos}
      />

      <ProximosBloque eventos={proximos} today={today} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// CategoryChip: usado en TODOS lados para que la alineación quede consistente
// ---------------------------------------------------------------------------

interface CategoryChipProps {
  categoria: EventoCategoria;
  size?: "sm" | "xs";
}

function CategoryChip({ categoria, size = "sm" }: CategoryChipProps) {
  const style = CATEGORIA_STYLES[categoria];
  const sizeClasses =
    size === "xs"
      ? "text-[10px] px-2 py-0.5 gap-1"
      : "text-[11px] px-2.5 py-0.5 gap-1.5";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold uppercase tracking-[0.12em]",
        sizeClasses,
        style.chip,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {CATEGORIA_LABELS[categoria]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Filtros (leyenda interactiva)
// ---------------------------------------------------------------------------

function Filtros({
  filtros,
  onToggle,
}: {
  filtros: Set<EventoCategoria>;
  onToggle: (c: EventoCategoria) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        <Filter className="h-3 w-3" />
        Filtros
      </span>
      {CATEGORIAS_ORDEN.map((cat) => {
        const active = filtros.has(cat);
        const style = CATEGORIA_STYLES[cat];
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onToggle(cat)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-200",
              active
                ? `${style.chip} hover:opacity-90`
                : "bg-muted/40 text-muted-foreground/70 hover:bg-muted/70",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                active ? style.dot : "bg-muted-foreground/40",
              )}
            />
            {CATEGORIA_LABELS[cat]}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Eventos en curso (rangos largos activos hoy)
// ---------------------------------------------------------------------------

function EnCursoBloque({
  eventos,
  today,
}: {
  eventos: EventoCalendario[];
  today: Date;
}) {
  return (
    <section className="space-y-4">
      <SectionHeader title="En curso ahora" hint="Lo que está activo hoy" />

      <ul className="grid gap-3 md:grid-cols-2">
        {eventos.map((ev) => (
          <li key={ev.id}>
            <EnCursoCard ev={ev} today={today} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function EnCursoCard({ ev, today }: { ev: EventoCalendario; today: Date }) {
  const style = CATEGORIA_STYLES[ev.categoria];
  const progress = Math.round(progresoDeEvento(ev, today) * 100);
  const totalDias = diasDeRango(ev.inicio, ev.fin);
  const restantes = Math.max(
    0,
    Math.ceil(
      (parseLocalDate(ev.fin).getTime() - today.getTime()) / 86_400_000,
    ),
  );

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <CategoryChip categoria={ev.categoria} size="xs" />
        <span className="text-[11px] font-medium text-muted-foreground">
          {restantes === 0
            ? "termina hoy"
            : `${restantes} día${restantes === 1 ? "" : "s"} restantes`}
        </span>
      </div>

      <h3 className="text-base font-semibold leading-tight text-foreground">
        {ev.nombre}
      </h3>

      <p className="text-xs text-muted-foreground">
        {formatRango(ev.inicio, ev.fin)} <span className="opacity-50">·</span>{" "}
        {totalDias} días totales
      </p>

      {ev.nota && (
        <p className="text-xs italic text-muted-foreground/80">{ev.nota}</p>
      )}

      <div className="mt-auto flex items-center gap-3 pt-1">
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("absolute inset-y-0 left-0 rounded-full", style.dot)}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="shrink-0 text-[11px] font-medium tabular-nums text-muted-foreground">
          {progress}%
        </span>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Calendario mensual
// ---------------------------------------------------------------------------

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function CalendarioMensual({
  year,
  month,
  today,
  selectedDate,
  onSelectDate,
  onShiftMonth,
  onJumpToday,
  eventos,
}: {
  year: number;
  month: number;
  today: Date;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  onShiftMonth: (delta: number) => void;
  onJumpToday: () => void;
  eventos: EventoCalendario[];
}) {
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);
  // El panel del día muestra los mismos eventos que la celda: filtramos
  // los rangos largos (semestres, recesos largos, inscripción a carrera)
  // que ya viven en "En curso ahora".
  const eventosDelDiaSeleccionado = eventosEnDia(selectedDate, eventos).filter(
    (ev) => !esEventoLargo(ev),
  );

  // Cuántos eventos hay en el mes visible (excluyendo los de rango largo
  // que ya viven en "En curso ahora").
  const eventosDelMes = useMemo(
    () =>
      eventos.filter((ev) => {
        if (esEventoLargo(ev)) return false;
        const ini = parseLocalDate(ev.inicio);
        const fin = parseLocalDate(ev.fin);
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0);
        return fin >= monthStart && ini <= monthEnd;
      }).length,
    [eventos, year, month],
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold capitalize text-foreground">
            {nombreMes(year, month)}
          </h2>
          <p className="text-xs text-muted-foreground">
            {eventosDelMes} evento{eventosDelMes === 1 ? "" : "s"} en este mes
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onJumpToday}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-pastel-blue/40 hover:text-primary"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => onShiftMonth(-1)}
            aria-label="Mes anterior"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-pastel-blue/40 hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onShiftMonth(1)}
            aria-label="Mes siguiente"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-pastel-blue/40 hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {DIAS_SEMANA.map((d, i) => (
            <div
              key={d}
              className={cn(
                "px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em]",
                i >= 5 ? "text-muted-foreground/60" : "text-muted-foreground",
              )}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {grid.map((d) => {
            const inThisMonth = d.getMonth() === month;
            const esHoy = isSameDay(d, today);
            const esSeleccionado = isSameDay(d, selectedDate);
            const evs = eventosEnDia(d, eventos);
            return (
              <DayCell
                key={d.toISOString()}
                date={d}
                inThisMonth={inThisMonth}
                esHoy={esHoy}
                esSeleccionado={esSeleccionado}
                eventos={evs}
                onClick={() => onSelectDate(d)}
              />
            );
          })}
        </div>
      </div>

      <DayDetailPanel date={selectedDate} eventos={eventosDelDiaSeleccionado} />
    </section>
  );
}

function DayCell({
  date,
  inThisMonth,
  esHoy,
  esSeleccionado,
  eventos,
  onClick,
}: {
  date: Date;
  inThisMonth: boolean;
  esHoy: boolean;
  esSeleccionado: boolean;
  eventos: EventoCalendario[];
  onClick: () => void;
}) {
  // Sacamos los eventos "background" (semestres, recesos, inscripciones a
  // carrera) que ya se ven en "En curso ahora". La celda muestra solo
  // eventos puntuales o cortos: examenes, feriados, asuetos, semanas de
  // inscripción a finales, etc.
  const eventosCelda = eventos.filter((ev) => !esEventoLargo(ev));

  const top =
    eventosCelda.length > 0
      ? [...eventosCelda].sort(
          (a, b) => PRIORIDAD[b.categoria] - PRIORIDAD[a.categoria],
        )[0]
      : null;
  const topStyle = top ? CATEGORIA_STYLES[top.categoria] : null;

  // Solo los feriados NACIONALES se pintan rojo (todos tienen día libre).
  // Los religiosos / de colectividad se muestran como evento normal.
  const feriadoNacional = eventosCelda.find(
    (ev) => ev.categoria === "feriado" && ev.nacional === true,
  );

  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  const titleSummary = eventosCelda
    .map((e) => `${CATEGORIA_LABELS[e.categoria]}: ${e.nombre}`)
    .join("\n");

  return (
    <button
      type="button"
      onClick={onClick}
      title={titleSummary || undefined}
      aria-label={
        feriadoNacional
          ? `${date.getDate()}, feriado nacional: ${feriadoNacional.nombre}`
          : `${date.getDate()} ${nombreMes(date.getFullYear(), date.getMonth())}${
              eventosCelda.length > 0 ? `, ${eventosCelda.length} eventos` : ""
            }`
      }
      className={cn(
        "group relative flex min-h-[72px] flex-col items-stretch gap-1 border-b border-r border-border/60 p-2 text-left transition-colors duration-150",
        "last:border-r-0 [&:nth-child(7n)]:border-r-0",
        !inThisMonth && "bg-muted/15",
        feriadoNacional &&
          inThisMonth &&
          !esSeleccionado &&
          "bg-rose-50 dark:bg-rose-950/30",
        esSeleccionado && "bg-pastel-blue/50 ring-1 ring-inset ring-primary/40",
        !esSeleccionado &&
          inThisMonth &&
          !feriadoNacional &&
          "hover:bg-muted/30",
        !esSeleccionado &&
          inThisMonth &&
          feriadoNacional &&
          "hover:bg-rose-100 dark:hover:bg-rose-950/50",
      )}
    >
      <span
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
          !inThisMonth && "text-muted-foreground/40",
          inThisMonth &&
            !esHoy &&
            !feriadoNacional &&
            !isWeekend &&
            "font-medium",
          inThisMonth &&
            !esHoy &&
            !feriadoNacional &&
            isWeekend &&
            "text-muted-foreground",
          inThisMonth &&
            !esHoy &&
            feriadoNacional &&
            "font-semibold text-rose-600 dark:text-rose-400",
          esHoy && "bg-primary font-bold text-primary-foreground",
          esSeleccionado && !esHoy && !feriadoNacional && "font-semibold text-primary",
        )}
      >
        {date.getDate()}
      </span>

      {top && topStyle && (
        <div className="mt-auto">
          {/* < lg: solo dot. En celdas chicas el texto del chip se trunca
              feo ("Fer.", "Ins.") y queda confuso. Mejor un dot del color
              y se ve la categoría completa al click en el día. */}
          <span
            className={cn(
              "block h-2 w-2 rounded-full lg:hidden",
              topStyle.dot,
              !inThisMonth && "opacity-50",
            )}
            aria-label={CATEGORIA_LABELS[top.categoria]}
          />
          {/* >= lg: chip completo con label */}
          <div
            className={cn(
              "hidden items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-tight lg:flex",
              topStyle.chip,
              !inThisMonth && "opacity-50",
            )}
          >
            <span
              className={cn("h-1.5 w-1.5 shrink-0 rounded-full", topStyle.dot)}
            />
            <span className="truncate">{CATEGORIA_LABELS[top.categoria]}</span>
          </div>
        </div>
      )}
    </button>
  );
}

function DayDetailPanel({
  date,
  eventos,
}: {
  date: Date;
  eventos: EventoCalendario[];
}) {
  const dayName = date.toLocaleDateString("es-AR", { weekday: "long" });
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold capitalize text-foreground">
          {dayName}, {formatFechaLarga(formatLocalDate(date))}
        </h3>
        <span className="text-xs text-muted-foreground">
          {eventos.length === 0
            ? "Sin eventos"
            : `${eventos.length} evento${eventos.length === 1 ? "" : "s"}`}
        </span>
      </div>

      {eventos.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Día sin eventos académicos cargados.
        </p>
      ) : (
        <ul className="space-y-2">
          {eventos.map((ev) => (
            <EventoLinea key={ev.id} ev={ev} />
          ))}
        </ul>
      )}
    </div>
  );
}

function EventoLinea({ ev }: { ev: EventoCalendario }) {
  return (
    <li className="rounded-lg p-2 transition-colors hover:bg-muted/30">
      <div className="flex flex-wrap items-center gap-2">
        <CategoryChip categoria={ev.categoria} size="xs" />
        <span className="text-sm font-medium text-foreground">{ev.nombre}</span>
      </div>
      <p className="ml-1 mt-1 text-xs text-muted-foreground">
        {ev.tipo === "rango" && ev.inicio !== ev.fin
          ? formatRango(ev.inicio, ev.fin)
          : "Día puntual"}
      </p>
      {ev.nota && (
        <p className="ml-1 text-xs italic text-muted-foreground/80">{ev.nota}</p>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// Próximos eventos (30 días)
// ---------------------------------------------------------------------------

function ProximosBloque({
  eventos,
  today,
}: {
  eventos: EventoCalendario[];
  today: Date;
}) {
  if (eventos.length === 0) {
    return (
      <section className="space-y-4">
        <SectionHeader title="Próximos 30 días" hint="" />
        <p className="text-sm text-muted-foreground">
          Sin eventos en los próximos 30 días con los filtros actuales.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Próximos 30 días"
        hint={`${eventos.length} evento${eventos.length === 1 ? "" : "s"}`}
      />

      <ul className="space-y-2">
        {eventos.map((ev) => (
          <ProximoEventoCard key={ev.id} ev={ev} today={today} />
        ))}
      </ul>
    </section>
  );
}

function ProximoEventoCard({
  ev,
  today,
}: {
  ev: EventoCalendario;
  today: Date;
}) {
  const inicio = parseLocalDate(ev.inicio);
  const yaEmpezo = inicio.getTime() <= today.getTime();
  const diasFalta = Math.max(
    0,
    Math.ceil((inicio.getTime() - today.getTime()) / 86_400_000),
  );

  const whenLabel = yaEmpezo
    ? "en curso"
    : diasFalta === 0
      ? "hoy"
      : diasFalta === 1
        ? "mañana"
        : `en ${diasFalta} días`;
  const whenIsHighlight = yaEmpezo || diasFalta <= 1;

  return (
    <li className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 sm:p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <DatePill date={inicio} />

      <div className="min-w-0 flex-1 space-y-1">
        <CategoryChip categoria={ev.categoria} size="xs" />
        <h3 className="text-sm font-semibold leading-tight text-foreground">
          {ev.nombre}
        </h3>
        <p className="text-xs text-muted-foreground">
          {ev.tipo === "rango" && ev.inicio !== ev.fin
            ? `${formatRango(ev.inicio, ev.fin)} (${diasDeRango(ev.inicio, ev.fin)} días)`
            : formatFechaLarga(ev.inicio)}
        </p>
        {ev.nota && (
          <p className="text-xs italic text-muted-foreground/80">{ev.nota}</p>
        )}
      </div>

      <span
        className={cn(
          "shrink-0 self-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]",
          whenIsHighlight
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {whenLabel}
      </span>
    </li>
  );
}

function DatePill({ date }: { date: Date }) {
  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-pastel-blue/40 text-primary">
      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] opacity-70">
        {MES_CORTO[date.getMonth()]}
      </span>
      <span className="text-lg font-bold leading-none">{date.getDate()}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section header reutilizable
// ---------------------------------------------------------------------------

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {hint && (
        <span className="text-xs text-muted-foreground">{hint}</span>
      )}
      <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper: armar grilla 6x7 de un mes (lunes-domingo)
// ---------------------------------------------------------------------------

function buildMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const shift = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - shift);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  return days;
}
