import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Compass,
  Info,
  Library,
  MessagesSquare,
  Newspaper,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerList } from "@/components/motion/StaggerList";
import { type Carrera, carreras } from "@/lib/carreras";
import {
  type Mensaje,
  fetchCartelera,
  formatRelative,
  mensajeId,
} from "@/lib/cartelera";
import { cn } from "@/lib/utils";

// ISR: la home ya re-fetchea los anuncios cada 5min (mismo cache que
// /cartelera, así no le pegamos doble a la API).
export const revalidate = 300;

const ULTIMOS_ANUNCIOS = 3;

export default async function HomePage() {
  const ultimos = await fetchUltimosAnuncios();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 sm:gap-20">
      <HeroSection />
      <DisclaimerSection />
      <CarrerasSection />
      {ultimos.length > 0 && <CarteleraEnVivoSection mensajes={ultimos} />}
      <SeccionesGridSection />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Disclaimer: blog personal, no es contenido oficial de ninguna cátedra.
// Va arriba de todo (después del hero) para que setee expectativas antes
// de que la persona consuma planes, materias y bibliografía.
// ---------------------------------------------------------------------------

function DisclaimerSection() {
  return (
    <Reveal trigger="mount" delay={0.1}>
      <section
        role="note"
        aria-label="Aviso sobre el contenido del blog"
        className="flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4 sm:gap-4 sm:p-5"
      >
        <span
          className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pastel-amber/60 text-amber-700 dark:text-amber-200"
          aria-hidden
        >
          <Info className="h-4 w-4" />
        </span>
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          El material compartido es de carácter personal y no representa
          contenidos oficiales ni resoluciones aprobadas por ninguna cátedra.
        </p>
      </section>
    </Reveal>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function HeroSection() {
  return (
    <Reveal trigger="mount">
      <section className="space-y-6 pt-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Compañero de estudio · UNLP
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
          Blog{" "}
          <span className="bg-gradient-to-br from-primary via-primary to-primary/70 bg-clip-text text-transparent">
            Informática
          </span>
        </h1>
        <p className="max-w-prose text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Todo lo que necesitás para cursar las carreras de la Facultad de
          Informática UNLP en un solo lugar: planes de estudio, cartelera en
          vivo, calendario, bibliografía, material y recomendaciones para
          cada cursada.
        </p>
      </section>
    </Reveal>
  );
}

// ---------------------------------------------------------------------------
// Carreras: 4 cards más vívidas que la versión anterior
// ---------------------------------------------------------------------------

function CarrerasSection() {
  return (
    <Reveal trigger="view">
      <section className="space-y-5">
        <SectionHeader
          eyebrow="Plan 2021"
          title="Las 4 carreras de la facultad"
          link={{ href: "/carreras", label: "Ver todas" }}
        />
        {/* `auto-rows-fr` mantiene todas las filas con la misma altura,
         * así las 4 cards quedan parejas independientemente del largo
         * del nombre de cada carrera. */}
        <StaggerList
          className="grid auto-rows-fr gap-3 sm:grid-cols-2"
          staggerMs={80}
          trigger="view"
        >
          {carreras.map((c) => (
            <CarreraCard key={c.slug} carrera={c} />
          ))}
        </StaggerList>
      </section>
    </Reveal>
  );
}

function CarreraCard({ carrera }: { carrera: Carrera }) {
  return (
    <Link
      href={`/carreras/${carrera.slug}`}
      className={cn(
        "group flex h-full flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5",
        "transition-colors duration-200",
        "hover:border-primary/40 hover:bg-pastel-blue/20",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80">
          {carrera.nombreCorto}
        </p>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>

      <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg">
        {carrera.nombre}
      </h3>

      <p className="text-xs text-muted-foreground">
        {carrera.duracionAnios} años · {carrera.cantidadAsignaturas} asignaturas
      </p>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Cartelera en vivo: 3 anuncios más recientes (no anulados) en una lista
// compacta. La sección entera se esconde si fetchCartelera falla o no
// devuelve nada, así no queda un placeholder vacío.
// ---------------------------------------------------------------------------

async function fetchUltimosAnuncios(): Promise<Mensaje[]> {
  const all = await fetchCartelera();
  return all
    .filter((m) => !m.isAnulado)
    .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
    .slice(0, ULTIMOS_ANUNCIOS);
}

function CarteleraEnVivoSection({ mensajes }: { mensajes: Mensaje[] }) {
  return (
    <Reveal trigger="view">
      <section className="space-y-5">
        <SectionHeader
          eyebrow="En vivo"
          title="Últimos anuncios"
          link={{ href: "/cartelera", label: "Ver cartelera completa" }}
        />
        <ul className="overflow-hidden rounded-2xl border border-border bg-card">
          {mensajes.map((m, i) => (
            <li
              key={`${m.titulo}-${m.fecha.toISOString()}`}
              className={i > 0 ? "border-t border-border" : undefined}
            >
              <AnuncioRow mensaje={m} />
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}

function AnuncioRow({ mensaje }: { mensaje: Mensaje }) {
  return (
    <Link
      // Deep-link al anuncio: abre el modal directamente al llegar a
      // /cartelera. El query param `a` lo resuelve el server component.
      href={`/cartelera?a=${encodeURIComponent(mensajeId(mensaje))}`}
      className="group flex items-start gap-3 p-4 transition-colors duration-200 hover:bg-pastel-blue/30 sm:gap-4 sm:p-5"
    >
      <span
        className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pastel-blue/60 text-primary"
        aria-hidden
      >
        <Newspaper className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {mensaje.carreras.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-pastel-blue/70 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
              {mensaje.carreras.map((c) => c.nombreCorto).join(" · ")}
            </span>
          )}
          <p className="truncate text-sm font-medium text-primary">
            {mensaje.materia}
          </p>
        </div>
        <p className="line-clamp-2 text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-base">
          {mensaje.titulo}
        </p>
      </div>
      <span className="shrink-0 self-start text-xs text-muted-foreground">
        {formatRelative(mensaje.fecha)}
      </span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Grid de secciones: 6 cards, una por ruta pública. Cubre todo lo que
// el sidebar ofrece, así la home funciona como mapa del sitio.
// ---------------------------------------------------------------------------

interface NavItem {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    href: "/carreras",
    icon: BookOpen,
    title: "Carreras",
    description:
      "Plan 2021 completo de cada carrera con materias, correlativas y duración por cuatrimestre.",
  },
  {
    href: "/calendario",
    icon: CalendarDays,
    title: "Calendario académico",
    description:
      "Inicio y fin de cuatrimestres, mesas de finales, recesos y feriados del año en curso.",
  },
  {
    href: "/cartelera",
    icon: MessagesSquare,
    title: "Cartelera",
    description:
      "Anuncios de cátedras y docentes en tiempo real, filtrables por carrera, materia y rango de fechas.",
  },
  {
    href: "/bibliografia",
    icon: Library,
    title: "Bibliografía",
    description:
      "Repositorios públicos de GitHub con los libros oficiales en PDF, organizados por carrera.",
  },
  {
    href: "/links",
    icon: Compass,
    title: "Links útiles",
    description:
      "Directorio de páginas oficiales: SIU Guaraní, plataformas de cursada, contacto y comunidad.",
  },
  {
    href: "/sobre-mi",
    icon: Sparkles,
    title: "Sobre mí",
    description:
      "Quién está detrás del blog: bio corta, recorrido por la facultad y dónde encontrarme online.",
  },
];

function SeccionesGridSection() {
  return (
    <Reveal trigger="view">
      <section className="space-y-5">
        <SectionHeader eyebrow="Secciones" title="Todo lo que hay acá" />
        <StaggerList
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          staggerMs={70}
          trigger="view"
        >
          {navItems.map((item) => (
            <NavCard key={item.href} item={item} />
          ))}
        </StaggerList>
      </section>
    </Reveal>
  );
}

function NavCard({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card/50 p-5",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/40 hover:bg-pastel-blue/30 hover:shadow-lg",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-pastel-blue text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-base font-semibold text-foreground">
          {item.title}
        </h3>
        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {item.description}
      </p>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Helpers de layout
// ---------------------------------------------------------------------------

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  link?: { href: string; label: string };
}

function SectionHeader({ eyebrow, title, link }: SectionHeaderProps) {
  return (
    <header className="flex items-end justify-between gap-3">
      <div className="space-y-1">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {link.label}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      )}
    </header>
  );
}
