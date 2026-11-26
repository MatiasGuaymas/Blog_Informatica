// Datos de las 4 carreras de la Facultad de Informática UNLP (planes 2021).
//
// Modelo:
//   - `Carrera` con metadata + plan completo
//   - `PlanRow` por materia (incluye nombre, duración, correlativas; el código
//     funciona como identificador único dentro de la facultad)
//   - `materiaDetails` registry opcional con resumen/recomendaciones/links
//
// Cuando una materia tiene una entrada en `materiaDetails`, su fila en la
// tabla del plan se renderiza como link a /materia/[codigo].
//
// Eventualmente este módulo va a leer de Vercel KV (Redis) para que el contenido
// editorial sea editable desde el panel admin sin redeploy. Por ahora los planes
// son estáticos (cambian poco) y los detalles también.

export type Cuatrimestre = 1 | 2 | "intro";

export type TipoMateria =
  | "obligatoria"
  | "introductoria"
  | "electiva"
  | "optativa"
  | "tesina";

export interface PlanRow {
  /** Código institucional UNLP. Funciona como id global de la materia. */
  codigo: string;
  nombre: string;
  /** Año dentro del plan (1-5). */
  anio: 1 | 2 | 3 | 4 | 5;
  cuatrimestre: Cuatrimestre;
  /** Duración tal como figura en el plan oficial. */
  duracion: string;
  /** Códigos de materias correlativas previas. */
  correlativas: string[];
  tipo?: TipoMateria;
  /** Para Seminario de Lenguajes y similares. */
  opciones?: string[];
  /** Notas al pie de la fila (electiva alternativa, orientación, etc.). */
  nota?: string;
  /**
   * URL externa que reemplaza el detalle interno de la materia. Pensado
   * para optativas: en vez de ir a /materia/<slug>, la fila linkea
   * directo a la página oficial de la facultad donde se listan todas
   * las optativas del año. Tiene precedencia sobre `hasMateriaSlug`.
   */
  externalUrl?: string;
}

export interface Carrera {
  slug: string;
  nombre: string;
  nombreCorto: string;
  descripcion: string;
  duracionAnios: number;
  cantidadAsignaturas: number;
  /** URL del plan oficial en info.unlp.edu.ar. */
  planUrl: string;
  plan: PlanRow[];
}

export interface MateriaDetail {
  resumen: string;
  recomendaciones?: string;
  links?: { label: string; href: string }[];
}

// ---------------------------------------------------------------------------
// Bloques compartidos (las 4 carreras tienen idénticos los cuatrimestres 1-4)
// ---------------------------------------------------------------------------

const INTRODUCTORIAS: PlanRow[] = [
  {
    codigo: "CNE",
    nombre: "Expresión de Problemas y Algoritmos",
    anio: 1,
    cuatrimestre: "intro",
    duracion: "6 semanas",
    correlativas: [],
    tipo: "introductoria",
  },
  {
    codigo: "CNC",
    nombre: "Conceptos de Organización de Computadoras",
    anio: 1,
    cuatrimestre: "intro",
    duracion: "6 semanas",
    correlativas: [],
    tipo: "introductoria",
  },
  {
    codigo: "CNM",
    nombre: "Matemática 0",
    anio: 1,
    cuatrimestre: "intro",
    duracion: "6 semanas",
    correlativas: [],
    tipo: "introductoria",
  },
];

const ANIO_1_CUAT_1: PlanRow[] = [
  {
    codigo: "SI106",
    nombre: "Conceptos de Algoritmos, Datos y Programas",
    anio: 1,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["CNE"],
  },
  {
    codigo: "SI104",
    nombre: "Organización de Computadoras",
    anio: 1,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["CNC"],
  },
  {
    codigo: "SI101",
    nombre: "Matemática 1",
    anio: 1,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["CNM"],
  },
];

const ANIO_1_CUAT_2: PlanRow[] = [
  {
    codigo: "SI107",
    nombre: "Taller de Programación",
    anio: 1,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI106"],
  },
  {
    codigo: "SI105",
    nombre: "Arquitectura de Computadoras",
    anio: 1,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI104"],
  },
  {
    codigo: "SI102",
    nombre: "Matemática 2",
    anio: 1,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI101"],
  },
];

const ANIO_2_CUAT_1: PlanRow[] = [
  {
    codigo: "SI209",
    nombre: "Fundamentos de Organización de Datos",
    anio: 2,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI107"],
  },
  {
    codigo: "SI203",
    nombre: "Algoritmos y Estructuras de Datos",
    anio: 2,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI102", "SI107"],
  },
  {
    codigo: "SI207",
    nombre: "Seminario de Lenguajes",
    anio: 2,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI107"],
    opciones: [
      "Android + Kotlin",
      "PHP, React y API Rest",
      ".NET",
      "Python",
      "JavaScript",
      "Go",
      "Rust",
    ],
  },
];

const ANIO_2_CUAT_2: PlanRow[] = [
  {
    codigo: "SI210",
    nombre: "Diseño de Bases de Datos",
    anio: 2,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI209"],
  },
  {
    codigo: "SI202",
    nombre: "Ingeniería de Software 1",
    anio: 2,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI107"],
  },
  {
    codigo: "SI206",
    nombre: "Orientación a Objetos 1",
    anio: 2,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI107"],
  },
  {
    codigo: "SI204",
    nombre: "Introducción a los Sistemas Operativos",
    anio: 2,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI107", "SI105"],
  },
  {
    codigo: "SI208",
    nombre: "Taller de lecto-comprensión y Traducción en Inglés",
    anio: 2,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: [],
  },
];

const PLAN_BASE = [
  ...INTRODUCTORIAS,
  ...ANIO_1_CUAT_1,
  ...ANIO_1_CUAT_2,
  ...ANIO_2_CUAT_1,
  ...ANIO_2_CUAT_2,
];

// ---------------------------------------------------------------------------
// APU - Analista Programador Universitario (3 años, 24 asignaturas)
// ---------------------------------------------------------------------------

const APU_ANIO_3: PlanRow[] = [
  {
    codigo: "SI308",
    nombre: "Matemática 3",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI102"],
  },
  {
    codigo: "SI302",
    nombre: "Ingeniería de Software 2",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI202", "SI208"],
  },
  {
    codigo: "SI307",
    nombre: "Orientación a Objetos 2",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI206", "SI208"],
  },
  {
    codigo: "SI306",
    nombre: "Conceptos y Paradigmas de Lenguajes de Programación",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI203", "SI207", "SI208"],
    tipo: "electiva",
    nota: "Electiva alternativa de 5° semestre",
  },
  {
    codigo: "SI301",
    nombre: "Programación Concurrente",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI204", "SI207", "SI208"],
  },
  {
    codigo: "SI305",
    nombre: "Proyecto de Software",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI210", "SI202", "SI203", "SI206", "SI207", "SI208"],
  },
  {
    codigo: "O7301",
    nombre: "Taller de Tecnologías de Producción de Software",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI210", "SI203", "SI204", "SI206", "SI208", "SI302"],
    opciones: [
      "Opción A: Java",
      "Opción B: Ingeniería de Software Aplicada",
      "Opción C: Técnicas y Estrategias",
      "Opción D: Ruby",
      "Opción E: Desarrollo Guiado por Requerimientos",
    ],
  },
  {
    codigo: "SI304",
    nombre: "Redes y Comunicaciones",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI102", "SI204", "SI208"],
    tipo: "electiva",
    nota: "Electiva alternativa de 6° semestre",
  },
  {
    codigo: "SO303",
    nombre: "Bases de Datos 1",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI210", "SI208"],
    tipo: "electiva",
    nota: "Electiva alternativa de 6° semestre",
  },
  {
    codigo: "SO410",
    nombre: "Sistemas y Organizaciones",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI210", "SI202", "SI208"],
    tipo: "electiva",
    nota: "Electiva alternativa de 6° semestre",
  },
];

// ---------------------------------------------------------------------------
// LS - Licenciatura en Sistemas (5 años, 37 asignaturas)
// ---------------------------------------------------------------------------

const LS_ANIO_3: PlanRow[] = [
  {
    codigo: "SI308",
    nombre: "Matemática 3",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI102"],
  },
  {
    codigo: "SI302",
    nombre: "Ingeniería de Software 2",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI202", "SI208"],
  },
  {
    codigo: "SI306",
    nombre: "Conceptos y Paradigmas de Lenguajes de Programación",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI203", "SI207", "SI208"],
  },
  {
    codigo: "SI307",
    nombre: "Orientación a Objetos 2",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI206", "SI208"],
  },
  {
    codigo: "SI304",
    nombre: "Redes y Comunicaciones",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI102", "SI204", "SI208"],
  },
  {
    codigo: "SI301",
    nombre: "Programación Concurrente",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI204", "SI207", "SI208"],
  },
  {
    codigo: "SI305",
    nombre: "Proyecto de Software",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI210", "SI202", "SI203", "SI206", "SI207", "SI208"],
  },
  {
    codigo: "SO303",
    nombre: "Bases de Datos 1",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI210", "SI208"],
  },
];

const LS_ANIO_4: PlanRow[] = [
  {
    codigo: "SO407",
    nombre: "Fundamentos de la Teoría de la Computación",
    anio: 4,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI308", "SI306"],
  },
  {
    codigo: "SI403",
    nombre: "Sistemas Operativos",
    anio: 4,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI304"],
  },
  {
    codigo: "SI405",
    nombre: "Bases de Datos 2",
    anio: 4,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SO303"],
  },
  {
    codigo: "SO406",
    nombre: "Ingeniería de Software 3",
    anio: 4,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI308", "SI202"],
  },
  {
    codigo: "SO410",
    nombre: "Sistemas y Organizaciones",
    anio: 4,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI210", "SI202", "SI208"],
  },
  {
    codigo: "SI409",
    nombre: "Matemática 4",
    anio: 4,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI308"],
  },
  {
    codigo: "SO408",
    nombre: "Desarrollo de Software en Sistemas Distribuidos",
    anio: 4,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI301", "SO303", "SI304"],
  },
  {
    codigo: "OPT-LS-1",
    nombre: "Optativa 1",
    anio: 4,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: [],
    tipo: "optativa",
    // TODO(matias): la URL tiene el año hardcoded (2026). Revisar/actualizar
    // cada año cuando la facu publique la lista del año siguiente.
    externalUrl:
      "https://www.info.unlp.edu.ar/optativas-2026-licenciatura-en-sistemas/",
  },
];

const LS_ANIO_5: PlanRow[] = [
  {
    codigo: "SI504",
    nombre: "Aspectos Sociales y Profesionales de Informática",
    anio: 5,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI305"],
  },
  {
    codigo: "SI505",
    nombre: "Aspectos Éticos, Sociales y Profesionales Avanzados",
    anio: 5,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI305"],
  },
  {
    codigo: "OPT-LS-2",
    nombre: "Optativa 2",
    anio: 5,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: [],
    tipo: "optativa",
    externalUrl:
      "https://www.info.unlp.edu.ar/optativas-2026-licenciatura-en-sistemas/",
  },
  {
    codigo: "OI503-LS",
    nombre: "Tesina de Licenciatura en Sistemas",
    anio: 5,
    cuatrimestre: 1,
    duracion: "Trabajo Final",
    correlativas: [],
    tipo: "tesina",
    nota: "Requiere todos los finales de 1° y 2° año + mínimo 2 finales adicionales",
  },
];

// ---------------------------------------------------------------------------
// LI - Licenciatura en Informática (5 años, 37 asignaturas)
// ---------------------------------------------------------------------------

const LI_ANIO_3: PlanRow[] = [
  {
    codigo: "SI308",
    nombre: "Matemática 3",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI102"],
  },
  {
    codigo: "SI302",
    nombre: "Ingeniería de Software 2",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI202", "SI208"],
  },
  {
    codigo: "SI306",
    nombre: "Conceptos y Paradigmas de Lenguajes de Programación",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI203", "SI207", "SI208"],
  },
  {
    codigo: "SI307",
    nombre: "Orientación a Objetos 2",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI206", "SI208"],
  },
  {
    codigo: "SI304",
    nombre: "Redes y Comunicaciones",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI102", "SI204", "SI208"],
  },
  {
    codigo: "SI301",
    nombre: "Programación Concurrente",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI204", "SI207", "SI208"],
  },
  {
    codigo: "SI305",
    nombre: "Proyecto de Software",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI210", "SI202", "SI203", "SI206", "SI207", "SI208"],
  },
  {
    codigo: "OI309",
    nombre: "Computabilidad y Complejidad",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI203", "SI308", "SI208"],
  },
];

const LI_ANIO_4: PlanRow[] = [
  {
    codigo: "OI401",
    nombre: "Teoría de la Computación y Verificación de Programas",
    anio: 4,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI308", "SI306"],
  },
  {
    codigo: "SI403",
    nombre: "Sistemas Operativos",
    anio: 4,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI304"],
  },
  {
    codigo: "OI404",
    nombre: "Sistemas Paralelos",
    anio: 4,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI301"],
  },
  {
    codigo: "OPT-LI-1",
    nombre: "Optativa 1",
    anio: 4,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: [],
    tipo: "optativa",
    externalUrl:
      "https://www.info.unlp.edu.ar/optativas-2026-licenciatura-en-informatica/",
  },
  {
    codigo: "OI406",
    nombre: "Lógica e Inteligencia Artificial",
    anio: 4,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI102", "SI306"],
  },
  {
    codigo: "SI409",
    nombre: "Matemática 4",
    anio: 4,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI308"],
  },
  {
    codigo: "OI402",
    nombre: "Laboratorio de Software",
    anio: 4,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI305"],
  },
  {
    codigo: "OI405",
    nombre: "Programación Distribuida y Tiempo Real",
    anio: 4,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI306", "SI304"],
  },
];

const LI_ANIO_5: PlanRow[] = [
  {
    codigo: "OI502",
    nombre: "Diseño de Experiencia de Usuario",
    anio: 5,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI302", "OI402"],
  },
  {
    codigo: "SI504",
    nombre: "Aspectos Sociales y Profesionales de Informática",
    anio: 5,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI305"],
  },
  {
    codigo: "SI505",
    nombre: "Aspectos Éticos, Sociales y Profesionales Avanzados",
    anio: 5,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI305"],
  },
  {
    codigo: "OI503-LI",
    nombre: "Tesina de Licenciatura en Informática",
    anio: 5,
    cuatrimestre: 1,
    duracion: "Trabajo Final",
    correlativas: [],
    tipo: "tesina",
    nota: "Requiere todos los finales de 1° y 2° año + mínimo 2 finales adicionales",
  },
];

// ---------------------------------------------------------------------------
// ATIC - Analista en Tecnologías de la Información y la Comunicación
// (3 años, 24 asignaturas)
// ---------------------------------------------------------------------------

const ATIC_ANIO_3: PlanRow[] = [
  {
    codigo: "SI302",
    nombre: "Ingeniería de Software 2",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI202", "SI208"],
  },
  {
    codigo: "SI307",
    nombre: "Orientación a Objetos 2",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI206", "SI208"],
  },
  {
    codigo: "AT310",
    nombre: "Redes y Comunicaciones ATIC",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI102", "SI204", "SI208"],
  },
  {
    codigo: "AT311",
    nombre: "Programación Concurrente ATIC",
    anio: 3,
    cuatrimestre: 1,
    duracion: "Semestral",
    correlativas: ["SI204", "SI207", "SI208"],
  },
  {
    codigo: "PPS-ATIC",
    nombre: "Práctica Profesional Supervisada ATIC",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: ["SI210", "SI203", "SI204", "SI206", "SI302"],
  },
  {
    codigo: "OPT-ATIC-1",
    nombre: "Optativa de orientación 1",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: [],
    tipo: "optativa",
    nota: "Según orientación elegida (web / cloud-bigdata / móviles / seguridad)",
  },
  {
    codigo: "OPT-ATIC-2",
    nombre: "Optativa de orientación 2",
    anio: 3,
    cuatrimestre: 2,
    duracion: "Semestral",
    correlativas: [],
    tipo: "optativa",
    nota: "Según orientación elegida (web / cloud-bigdata / móviles / seguridad)",
  },
];

// ---------------------------------------------------------------------------
// Carreras
// ---------------------------------------------------------------------------

export const carreras: Carrera[] = [
  {
    slug: "apu",
    nombre: "Analista Programador Universitario",
    nombreCorto: "APU",
    descripcion:
      "Titulación de pregrado de 3 años orientada a formar programadores con base sólida en algoritmos, bases de datos, ingeniería de software y orientación a objetos.",
    duracionAnios: 3,
    cantidadAsignaturas: 24,
    planUrl:
      "https://www.info.unlp.edu.ar/analista-programador-universitario-plan-2021/",
    plan: [...PLAN_BASE, ...APU_ANIO_3],
  },
  {
    slug: "atic",
    nombre: "Analista en Tecnologías de la Información y la Comunicación",
    nombreCorto: "ATIC",
    descripcion:
      "Titulación de pregrado de 3 años con orientación a tecnologías de información y comunicación. En el último cuatrimestre se elige una orientación: web, cloud/big data, móviles o seguridad.",
    duracionAnios: 3,
    cantidadAsignaturas: 24,
    planUrl:
      "https://www.info.unlp.edu.ar/analista-en-tecnologias-de-la-informacion-y-la-comunicacion-plan-2021/",
    plan: [...PLAN_BASE, ...ATIC_ANIO_3],
  },
  {
    slug: "ls",
    nombre: "Licenciatura en Sistemas",
    nombreCorto: "LS",
    descripcion:
      "Carrera de grado de 5 años con énfasis en sistemas de información, bases de datos, ingeniería de software y aspectos socio-profesionales. Cierra con una tesina.",
    duracionAnios: 5,
    cantidadAsignaturas: 37,
    planUrl: "https://www.info.unlp.edu.ar/licenciatura-en-sistemas-plan-2021/",
    plan: [...PLAN_BASE, ...LS_ANIO_3, ...LS_ANIO_4, ...LS_ANIO_5],
  },
  {
    slug: "li",
    nombre: "Licenciatura en Informática",
    nombreCorto: "LI",
    descripcion:
      "Carrera de grado de 5 años con foco en fundamentos teóricos, sistemas paralelos/distribuidos, lógica e inteligencia artificial. Cierra con una tesina.",
    duracionAnios: 5,
    cantidadAsignaturas: 37,
    planUrl:
      "https://www.info.unlp.edu.ar/licenciatura-en-informatica-plan-2021/",
    plan: [...PLAN_BASE, ...LI_ANIO_3, ...LI_ANIO_4, ...LI_ANIO_5],
  },
];

// ---------------------------------------------------------------------------
// Detalles editoriales (resumen, recomendaciones, links). Se popula a medida.
// ---------------------------------------------------------------------------

/**
 * Mapping `codigo institucional UNLP` → slug usado en la URL del detalle
 * (`/materia/<slug>`). Una materia es clickeable internamente desde el
 * plan de su carrera SI Y SOLO SI tiene una entrada acá. La existencia
 * del slug es independiente de si hay contenido editorial completo en
 * `materiaDetails`: cuando hay slug pero todavía no hay resumen escrito,
 * la página de detalle muestra solo el header (código, nombre, correlativas,
 * carreras donde aparece) hasta que se sume el resumen. Esto permite
 * publicar las URLs estables incluso antes de tener todas las notas.
 *
 * Mantener en sync con el array `materiaDetails` de abajo. Si una entrada
 * acá no tiene su slug correspondiente la materia queda como fila no
 * clickeable en el plan.
 */
export const materiaSlugs: Record<string, string> = {
  // Año 1 - introductorias
  CNE: "epa",
  CNC: "coc",
  CNM: "mat0",
  // Año 1 - cuatrimestres 1 y 2
  SI101: "mat1",
  SI102: "mat2",
  SI104: "oc",
  SI105: "ac",
  SI106: "cadp",
  SI107: "taller",
  // Año 2 - cuatrimestres 1 y 2
  SI202: "inge1",
  SI203: "ayed",
  SI204: "iso",
  SI206: "oo1",
  SI207: "seminario",
  SI208: "ingles",
  SI209: "fod",
  SI210: "dbd",
  // Año 3 (compartido APU/LS)
  SI301: "pc",
  SI302: "inge2",
  SI305: "ps",
  SI306: "cplp",
  SI307: "oo2",
  SI308: "mat3",
  SO303: "bd1",
  // Año 3 (solo APU)
  O7301: "ttps",
};

export const materiaDetails: Record<string, MateriaDetail> = {
  SI106: {
    resumen:
      "Primera materia de programación de la carrera. Cubre algoritmos básicos, tipos de datos, estructuras de control y modularización en un lenguaje imperativo.",
    recomendaciones:
      "Hacé todos los ejercicios de la guía. Si nunca programaste, no te frustres en las primeras semanas: el salto inicial es el más empinado.",
    links: [],
  },
  SI107: {
    resumen:
      "Continuación natural de CADP. Profundiza en el lenguaje (Pascal o C según comisión) y suma manejo de archivos, recursión avanzada y estructuras dinámicas.",
    recomendaciones: "",
    links: [],
  },
  SI101: {
    resumen:
      "Lógica proposicional, conjuntos, relaciones y funciones. Sienta las bases para todas las matemáticas posteriores.",
    recomendaciones: "",
    links: [],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getCarreraBySlug(slug: string): Carrera | undefined {
  return carreras.find((c) => c.slug === slug);
}

export function getMateriaDetail(codigo: string): MateriaDetail | undefined {
  return materiaDetails[codigo];
}

/** Carreras (en orden) en cuyo plan aparece este código. */
export function getCarrerasContaining(codigo: string): Carrera[] {
  return carreras.filter((c) => c.plan.some((row) => row.codigo === codigo));
}

/** Buscá una fila representativa para un código (la primera que aparezca). */
export function findPlanRow(codigo: string): PlanRow | undefined {
  for (const c of carreras) {
    const row = c.plan.find((r) => r.codigo === codigo);
    if (row) return row;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Helpers de slug. Una materia "tiene slug" cuando aparece en
// `materiaSlugs`; eso es la condición canónica para que la fila del plan
// sea clickeable y la URL `/materia/<slug>` exista.
// ---------------------------------------------------------------------------

/** True si la materia es clickeable en el plan (tiene URL interna). */
export function hasMateriaSlug(codigo: string): boolean {
  return Boolean(materiaSlugs[codigo]);
}

/** Slug para usar en `/materia/<slug>`, o undefined si la materia no tiene. */
export function getMateriaSlug(codigo: string): string | undefined {
  return materiaSlugs[codigo];
}

/** Resuelve `slug → codigo`. Útil en la page de detalle para volver al plan. */
export function getCodigoBySlug(slug: string): string | undefined {
  for (const [codigo, s] of Object.entries(materiaSlugs)) {
    if (s === slug) return codigo;
  }
  return undefined;
}

/** Lista de todos los slugs registrados, para `generateStaticParams` y sitemap. */
export function getAllMateriaSlugs(): string[] {
  return Object.values(materiaSlugs);
}
