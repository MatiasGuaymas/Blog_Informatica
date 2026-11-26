import { existsSync } from "node:fs";
import { join } from "node:path";
import { GraduationCap, Sparkles } from "lucide-react";
import Image from "next/image";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import { Reveal } from "@/components/motion/Reveal";
import { pageMetadata } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Sobre mí",
  description:
    "Matías Guaymas: recibido de APU, cursando Licenciatura en Sistemas, Forward Deployed Engineer y ayudante alumno en Ingeniería de Software 1 y 2 de UNLP Informática.",
  path: "/sobre-mi",
});

// ---------------------------------------------------------------------------
// Foto-collage en 3 filas. Cada foto preserva su aspect ratio nativo y la
// altura de la fila la decide cuál fila es. Resultado: las fotos se ven
// enteras (sin recortes forzados), con un look "scrapbook" / "wall" donde
// cada foto tiene su tamaño orgánico. En mobile stack vertical.
// ---------------------------------------------------------------------------
interface Foto {
  src: string;
  alt: string;
  /** Aspect ratio nativo de la foto (ancho / alto). */
  aspect: number;
}

interface FilaFotos {
  /** Altura del row en desktop (px). */
  height: number;
  fotos: Foto[];
}

// Hero: la foto grupal panorámica. Va full-width en desktop con su
// aspect ratio nativo, así domina la galería como pidió el usuario.
const heroFoto: Foto = {
  src: "/sobre-mi/foto-5.jpeg",
  alt: "Con toda mi gente querida",
  aspect: 2.2,
};

const filas: FilaFotos[] = [
  {
    // Fila 1: cuadrada + landscape + portrait. Después de la grupal del
    // hero arriba van las "fotos mías" en distintos formatos.
    height: 280,
    fotos: [
      { src: "/sobre-mi/foto-3.jpeg", alt: "Foto 3", aspect: 1.0 },
      { src: "/sobre-mi/foto-6.jpeg", alt: "Foto 6", aspect: 1.33 },
      { src: "/sobre-mi/foto-4.jpeg", alt: "Foto 4", aspect: 0.78 },
    ],
  },
  {
    // Fila 2: tres landscape de tamaños similares.
    height: 240,
    fotos: [
      { src: "/sobre-mi/foto-1.jpeg", alt: "Foto 1", aspect: 1.48 },
      { src: "/sobre-mi/foto-2.jpeg", alt: "Foto 2", aspect: 1.58 },
      { src: "/sobre-mi/foto-7.png", alt: "Foto 7", aspect: 1.6 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Redes / contacto. Reemplazá los URLs marcados como TODO por los reales.
// ---------------------------------------------------------------------------
interface Red {
  label: string;
  username: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const redes: Red[] = [
  {
    label: "GitHub",
    username: "@MatiasGuaymas",
    href: "https://github.com/MatiasGuaymas",
    Icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    username: "Matías Guaymas",
    href: "https://www.linkedin.com/in/matiasguaymas/",
    Icon: LinkedinIcon,
  },
  {
    label: "Instagram",
    username: "@matiguaymas_",
    href: "https://www.instagram.com/matiguaymas_/",
    Icon: InstagramIcon,
  },
];

export default function SobreMiPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16">
      {/* Hero */}
      <Reveal trigger="mount">
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Quién está detrás
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Hola, soy{" "}
            <span className="bg-gradient-to-br from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              Matías
            </span>
          </h1>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-muted-foreground sm:text-lg">
            <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
            <span>
              Recibido de{" "}
              <strong className="font-semibold text-foreground">APU</strong>,
              cursando{" "}
              <strong className="font-semibold text-foreground">
                Licenciatura en Sistemas
              </strong>{" "}
              en la Facultad de Informática - UNLP.
            </span>
          </p>
        </header>
      </Reveal>

      {/* Photo wall: arriba el hero grupal full-width, después 2 filas con
          altura fija. Cada foto preserva su aspect ratio nativo (sin
          recortes forzados). Mobile stack vertical. Animación de cascada. */}
      <section aria-label="Galería de fotos" className="space-y-3 sm:space-y-4">
        <FotoHero foto={heroFoto} index={0} />
        {filas.map((fila, rowIndex) => (
          <FilaCollage
            key={rowIndex}
            fila={fila}
            globalStartIndex={1 + previousFotosCount(filas, rowIndex)}
          />
        ))}
      </section>

      {/* Quién soy */}
      <Reveal trigger="view">
        <section className="grid gap-8 md:grid-cols-[200px_1fr] md:items-start">
          <h2 className="text-2xl font-bold text-foreground">Quién soy</h2>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Estudiante de Informática en La Plata. Recibido de Analista
              Programador Universitario, ahora cerrando la Licenciatura en
              Sistemas.
            </p>
            <p>
              Trabajo como{" "}
              <strong className="font-semibold text-foreground">
                Forward Deployed Engineer
              </strong>
              . En paralelo soy{" "}
              <strong className="font-semibold text-foreground">
                ayudante alumno
              </strong>{" "}
              en Ingeniería de Software 1 y 2 (materias de segundo y tercer
              año). Antes fui ayudante en materias de primer año de las carreras
              de Informática, y de esas mismas materias doy actualmente clases
              particulares en{" "}
              <a
                href="https://rinconinformatico.app/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Rincón Informático
              </a>
              .
            </p>
            <p>
              Me gusta ayudar, explicar y construir herramientas que le sirvan a
              otros. Disfruto estar siempre haciendo cosas, aprender y trabajar
              en equipo. De ahí, en gran parte, sale este blog: una herramienta
              más para los que estamos en la facultad.
            </p>
          </div>
        </section>
      </Reveal>

      {/*
        TODO(matias): reactivar "Por qué este blog" cuando tengamos
        el copy real. El texto que había no representa al autor, así
        que la sección queda oculta hasta que lo definas.
      */}

      {/*
        TODO(matias): reactivar "Más sobre mí" cuando definas las 3
        facetas reales (stack/herramientas/gustos). El array `facetas`
        está vacío así que aunque renderemos el bloque no se muestra
        nada, pero lo dejamos comentado para que sea un toggle on/off
        de un solo lugar.
      */}

      {/* Redes */}
      <Reveal trigger="view">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            Encontrame en redes
          </h2>
          <ul className="grid gap-3 sm:grid-cols-3">
            {redes.map((r) => (
              <li key={r.label}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl border border-border bg-card p-4",
                    "transition-all duration-300",
                    "hover:-translate-y-0.5 hover:border-primary/40 hover:bg-pastel-blue/30 hover:shadow-md",
                  )}
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pastel-blue/60 text-primary transition-transform duration-300 group-hover:scale-110">
                    <r.Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {r.label}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r.username}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>
    </div>
  );
}

/**
 * Chequea en el server si la imagen existe en /public antes de renderizarla.
 * Si no existe, renderizamos un placeholder visual limpio (gradient + sparkles).
 * Cuando el usuario dropee la foto en /public/sobre-mi/foto-N.jpg, en el
 * próximo render (dev) o build (prod) la imagen aparece sola.
 */
function fotoExiste(src: string): boolean {
  // src arranca con "/", lo unimos al cwd/public para resolver el archivo.
  return existsSync(join(process.cwd(), "public", src));
}

function previousFotosCount(filas: FilaFotos[], upTo: number): number {
  let count = 0;
  for (let i = 0; i < upTo; i++) count += filas[i].fotos.length;
  return count;
}

/**
 * Hero del collage: foto que ocupa el ancho completo del container con
 * su aspect ratio nativo (sin recortes). Pensado para la foto grupal,
 * que merece protagonismo y dimensiones generosas.
 */
function FotoHero({ foto, index }: { foto: Foto; index: number }) {
  const existe = fotoExiste(foto.src);
  const animationDelay = `${index * 90}ms`;

  return (
    <div
      className={cn(
        "gallery-tile group relative w-full overflow-hidden rounded-2xl ring-1 ring-border",
        existe
          ? "bg-card"
          : "bg-gradient-to-br from-pastel-blue/70 via-pastel-blue/40 to-pastel-blue/20",
      )}
      style={{ aspectRatio: foto.aspect, animationDelay }}
    >
      {existe ? (
        <Image
          src={foto.src}
          alt={foto.alt}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1280px"
          className="object-cover transition-transform duration-500 [will-change:transform] group-hover:scale-[1.02]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center text-primary/40"
        >
          <Sparkles className="h-8 w-8" />
        </div>
      )}
    </div>
  );
}

function FilaCollage({
  fila,
  globalStartIndex,
}: {
  fila: FilaFotos;
  globalStartIndex: number;
}) {
  return (
    <div
      className={cn(
        // En desktop: row donde cada tile crece proporcional a su aspect
        // ratio. Como flex-grow = aspect y aspect-ratio = aspect, todos
        // los tiles terminan con la misma altura sin importar el ancho
        // disponible (el row se encoge limpio con el contenedor en vez
        // de causar scroll horizontal cuando se abre el sidebar).
        // En mobile: stack vertical con altura natural por aspect ratio.
        "flex flex-col gap-3 sm:flex-row sm:gap-4",
      )}
    >
      {fila.fotos.map((f, i) => (
        <FotoTile
          key={f.src}
          foto={f}
          priority={globalStartIndex + i < 2}
          index={globalStartIndex + i}
        />
      ))}
    </div>
  );
}

function FotoTile({
  foto,
  priority,
  index,
}: {
  foto: Foto;
  priority: boolean;
  index: number;
}) {
  const existe = fotoExiste(foto.src);

  // Cada tile entra con un delay escalonado (90ms por tile) para un fade-up
  // en cascada que recorre la galería de izquierda-arriba a derecha-abajo.
  const animationDelay = `${index * 90}ms`;

  return (
    <div
      className={cn(
        "gallery-tile group relative overflow-hidden rounded-2xl ring-1 ring-border",
        // Mobile: ocupa todo el ancho del contenedor, alto por aspect-ratio.
        "w-full",
        // Desktop: ancho proporcional al aspect ratio (flex-grow del
        // padre), alto derivado del aspect-ratio. min-w-0 evita overflow
        // del flex item. La regla `flex:var(--aspect) 1 0` solo aplica
        // sm+ así no rompe el flex-col mobile (donde queremos cada foto
        // con su altura intrínseca por aspect-ratio).
        "sm:w-auto sm:min-w-0 sm:[flex:var(--aspect)_1_0]",
        existe
          ? "bg-card"
          : "bg-gradient-to-br from-pastel-blue/70 via-pastel-blue/40 to-pastel-blue/20",
      )}
      style={
        {
          aspectRatio: foto.aspect,
          animationDelay,
          "--aspect": foto.aspect,
        } as React.CSSProperties
      }
    >
      {existe ? (
        <Image
          src={foto.src}
          alt={foto.alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 [will-change:transform] group-hover:scale-[1.03]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center text-primary/40"
        >
          <Sparkles className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}
