import {
  ArrowUpRight,
  Building2,
  ClipboardList,
  Compass,
  GraduationCap,
  Laptop,
  MessagesSquare,
  ScrollText,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerList } from "@/components/motion/StaggerList";
import { cn } from "@/lib/utils";

import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Links útiles",
  description:
    "Directorio de páginas oficiales y recursos para estudiantes de la Facultad de Informática UNLP: carreras, planes 2021, plataformas de cursada, autogestión SIU, calendario académico y comunidad.",
  path: "/links",
});

interface UsefulLink {
  title: string;
  description: string;
  href: string;
  /** Tag corto que se muestra arriba a la izquierda de la card. */
  tag?: string;
}

interface LinkGroup {
  title: string;
  description: string;
  icon: React.ReactNode;
  links: UsefulLink[];
}

const groups: LinkGroup[] = [
  {
    title: "Carreras",
    description: "Páginas oficiales de cada carrera de la facultad.",
    icon: <GraduationCap className="h-5 w-5" />,
    links: [
      {
        tag: "APU",
        title: "Analista Programador Universitario",
        description: "Información general, perfil, alcances y plan de estudios.",
        href: "https://www.info.unlp.edu.ar/analista-programador-universitario/",
      },
      {
        tag: "ATIC",
        title: "Analista en TIC",
        description: "Información general, perfil, orientaciones y plan.",
        href: "https://www.info.unlp.edu.ar/analista-en-tic/",
      },
      {
        tag: "LS",
        title: "Licenciatura en Sistemas",
        description: "Información general, perfil profesional y plan.",
        href: "https://www.info.unlp.edu.ar/licenciatura-en-sistemas/",
      },
      {
        tag: "LI",
        title: "Licenciatura en Informática",
        description: "Información general, perfil profesional y plan.",
        href: "https://www.info.unlp.edu.ar/carreras-de-grado-lic-en-informatica/",
      },
    ],
  },
  {
    title: "Planes de estudio 2021",
    description:
      "Plan oficial vigente con materias, correlativas y duración por carrera.",
    icon: <ScrollText className="h-5 w-5" />,
    links: [
      {
        tag: "APU",
        title: "Plan APU 2021",
        description: "3 años · 24 asignaturas. Plan oficial vigente.",
        href: "https://www.info.unlp.edu.ar/analista-programador-universitario-plan-2021/",
      },
      {
        tag: "ATIC",
        title: "Plan ATIC 2021",
        description: "3 años · 24 asignaturas con orientaciones de 6° cuatrimestre.",
        href: "https://www.info.unlp.edu.ar/analista-en-tecnologias-de-la-informacion-y-la-comunicacion-plan-2021/",
      },
      {
        tag: "LS",
        title: "Plan LS 2021",
        description: "5 años · 37 asignaturas. Plan oficial vigente.",
        href: "https://www.info.unlp.edu.ar/licenciatura-en-sistemas-plan-2021/",
      },
      {
        tag: "LI",
        title: "Plan LI 2021",
        description: "5 años · 37 asignaturas. Plan oficial vigente.",
        href: "https://www.info.unlp.edu.ar/licenciatura-en-informatica-plan-2021/",
      },
    ],
  },
  {
    title: "Plataformas de cursada",
    description:
      "Las tres plataformas que se usan para entrar a los cursos de cada materia. Cada cátedra elige una.",
    icon: <Laptop className="h-5 w-5" />,
    links: [
      {
        tag: "Plataforma",
        title: "Ideas",
        description:
          "Plataforma propia de la facultad. Recursos, materiales, prácticos y entregas por materia.",
        href: "https://ideas.info.unlp.edu.ar/",
      },
      {
        tag: "Plataforma",
        title: "Cátedras (LINTI)",
        description:
          "Sitio de cátedras alojado en LINTI. Recursos, materiales, prácticos y entregas por materia.",
        href: "https://catedras.linti.unlp.edu.ar/",
      },
      {
        tag: "Plataforma",
        title: "Moodle (Asignaturas)",
        description:
          "Plataforma Moodle de la facultad. Recursos, materiales, prácticos y entregas por materia.",
        href: "https://asignaturas.info.unlp.edu.ar/",
      },
    ],
  },
  {
    title: "Autogestión y trámites",
    description: "Inscripciones, horarios y novedades de cátedra.",
    icon: <ClipboardList className="h-5 w-5" />,
    links: [
      {
        tag: "SIU Guaraní",
        title: "Autogestión SIU",
        description:
          "Inscripción a materias y finales, libreta digital, plan de estudios y datos personales.",
        href: "https://autogestion.guarani.unlp.edu.ar/",
      },
      {
        tag: "Cursadas",
        title: "Inicio de clases y cursadas",
        description:
          "Horarios de cursada por materia y comisión, fechas de inicio y aulas asignadas.",
        href: "https://gestiondocente.info.unlp.edu.ar/cursadas/",
      },
      {
        tag: "Anuncios",
        title: "Cartelera virtual oficial",
        description:
          "Versión oficial de la cartelera (también la podés ver acá adentro en /cartelera).",
        href: "https://gestiondocente.info.unlp.edu.ar/cartelera/",
      },
    ],
  },
  {
    title: "Información de la facultad",
    description: "Web institucional, calendario académico y contacto.",
    icon: <Building2 className="h-5 w-5" />,
    links: [
      {
        tag: "Portal",
        title: "Web de la Facultad de Informática",
        description:
          "Página principal de la facultad: novedades, secretarías, autoridades.",
        href: "https://www.info.unlp.edu.ar/",
      },
      {
        tag: "Calendario",
        title: "Calendario académico 2026",
        description:
          "Inicio y fin de cuatrimestres, mesas de finales, recesos y feriados.",
        href: "https://www.info.unlp.edu.ar/calendario-academico-2026/",
      },
      {
        tag: "Contacto",
        title: "Contacto institucional",
        description:
          "Mails y teléfonos de las distintas secretarías y áreas de la facultad.",
        href: "https://www.info.unlp.edu.ar/contacto/",
      },
    ],
  },
  {
    title: "Comunidad",
    description: "Para mantenerte conectado con compañeros.",
    icon: <MessagesSquare className="h-5 w-5" />,
    links: [
      {
        tag: "WhatsApp",
        title: "Grupos de WhatsApp por materia",
        description:
          "Linktree con todos los grupos de WhatsApp de la facultad, creado y mantenido por alumnos.",
        href: "https://linktr.ee/gruposdewsp",
      },
    ],
  },
  {
    title: "Otras carreras de la facultad",
    description:
      "No están cubiertas por el blog pero comparten muchas materias con APU/ATIC/LS/LI.",
    icon: <Compass className="h-5 w-5" />,
    links: [
      {
        tag: "IC",
        title: "Ingeniería en Computación",
        description: "Sitio dedicado de la carrera de ingeniería en computación.",
        href: "https://ic.info.unlp.edu.ar/",
      },
      {
        tag: "CDO",
        title: "Ciencia de Datos en Organizaciones",
        description: "Sitio dedicado de la carrera de ciencia de datos.",
        href: "https://cdo.info.unlp.edu.ar/",
      },
    ],
  },
];

export default function LinksPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12">
      <Reveal trigger="mount">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Directorio de recursos
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Links útiles
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Páginas oficiales de la facultad y recursos que vas a necesitar
            durante la cursada. Todo abre en otra pestaña.
          </p>
        </header>
      </Reveal>

      {groups.map((group, idx) => (
        <Reveal
          key={group.title}
          trigger={idx < 2 ? "mount" : "view"}
          delay={idx < 2 ? 0.1 + idx * 0.05 : 0}
        >
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-pastel-blue/60 text-primary">
                {group.icon}
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-foreground">
                  {group.title}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {group.description}
                </p>
              </div>
            </div>

            <StaggerList
              className="grid auto-rows-fr gap-3 md:grid-cols-2"
              staggerMs={70}
              trigger="view"
            >
              {group.links.map((link) => (
                <LinkCard key={link.href} link={link} />
              ))}
            </StaggerList>
          </section>
        </Reveal>
      ))}
    </div>
  );
}

function LinkCard({ link }: { link: UsefulLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group relative flex h-full flex-col gap-2 overflow-hidden rounded-2xl border border-border bg-card p-5",
        "transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
      )}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-pastel-blue opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          {link.tag && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/80">
              {link.tag}
            </p>
          )}
          <h3 className="text-sm font-semibold leading-tight text-foreground">
            {link.title}
          </h3>
        </div>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>

      <p className="relative text-xs leading-relaxed text-muted-foreground">
        {link.description}
      </p>

      <p className="relative mt-auto pt-2 text-[10px] font-mono text-muted-foreground/70">
        {hostnameOf(link.href)}
      </p>
    </a>
  );
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
