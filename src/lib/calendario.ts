// Calendario académico 2026 - Facultad de Informática UNLP.
// Fuente: https://www.info.unlp.edu.ar/calendario-academico-2026/
//
// Modelo:
//   - Cada evento es una fecha puntual (`tipo: "fecha"`) o un rango (`tipo: "rango"`).
//   - `categoria` agrupa visualmente y permite filtrar (clases, inscripciones,
//     exámenes, receso, feriado, otro).
//   - Las fechas son strings YYYY-MM-DD interpretados en hora local del cliente.

export type EventoCategoria =
  | "clases"
  | "inscripciones"
  | "examenes"
  | "receso"
  | "feriado"
  | "otro";

export type EventoTipo = "fecha" | "rango";

export interface EventoCalendario {
  id: string;
  categoria: EventoCategoria;
  nombre: string;
  tipo: EventoTipo;
  /** Fecha de inicio (YYYY-MM-DD, hora local). */
  inicio: string;
  /** Fecha de fin inclusive. Si es una fecha puntual, igual a inicio. */
  fin: string;
  /** Nota o descripción adicional. */
  nota?: string;
  /**
   * Solo aplica a `categoria: "feriado"`. true si es feriado nacional
   * (todo el mundo tiene día libre). Los religiosos / de colectividad
   * (Pesaj, Iom Kipur, Id Al-Fitr, etc.) van con `nacional: false` o
   * sin la prop, y NO se pintan rojo en el calendario.
   */
  nacional?: boolean;
}

export const eventosCalendario: EventoCalendario[] = [
  {
    id: "insc-carreras-2026",
    categoria: "inscripciones",
    nombre: "Inscripción a las carreras 2026",
    tipo: "rango",
    inicio: "2025-11-10",
    fin: "2025-12-12",
    nota: "Ciclo inicial 2026",
  },
  {
    id: "curso-inicial",
    categoria: "clases",
    nombre: "Curso inicial",
    tipo: "rango",
    inicio: "2026-02-02",
    fin: "2026-03-06",
    nota: "Ciclo inicial 2026",
  },
  {
    id: "apref",
    categoria: "clases",
    nombre: "Cursos de apoyo para rendir final (APREF)",
    tipo: "rango",
    inicio: "2026-02-02",
    fin: "2026-02-13",
  },
  {
    id: "acomac",
    categoria: "clases",
    nombre: "Actividades Complementarias para Aprobación de Cursadas (AComAC)",
    tipo: "rango",
    inicio: "2026-02-09",
    fin: "2026-02-20",
  },
  {
    id: "cursos-verano",
    categoria: "clases",
    nombre: "Cursos de Verano",
    tipo: "rango",
    inicio: "2026-02-02",
    fin: "2026-02-28",
  },
  {
    id: "carnaval",
    categoria: "feriado",
    nacional: true,
    nombre: "Carnaval",
    tipo: "rango",
    inicio: "2026-02-16",
    fin: "2026-02-17",
    nota: "Feriado trasladable",
  },
  {
    id: "insc-1c",
    categoria: "inscripciones",
    nombre: "Inscripción a asignaturas 1er semestre",
    tipo: "rango",
    inicio: "2026-02-23",
    fin: "2026-03-08",
    nota: "Por SIU Guaraní",
  },
  {
    id: "memoria-verdad-justicia",
    categoria: "feriado",
    nacional: true,
    nombre: "Día Nacional de la Memoria por la Verdad y la Justicia",
    tipo: "fecha",
    inicio: "2026-03-24",
    fin: "2026-03-24",
    nota: "Feriado inamovible",
  },
  {
    id: "turismo-marzo",
    categoria: "otro",
    nombre: "Día sin actividad académica (turismo)",
    tipo: "fecha",
    inicio: "2026-03-23",
    fin: "2026-03-23",
    nota: "Res. 164/25 Jefatura de Gabinete",
  },
  {
    id: "primer-semestre",
    categoria: "clases",
    nombre: "Primer semestre",
    tipo: "rango",
    inicio: "2026-03-09",
    fin: "2026-08-08",
    nota: "Dictado, evaluaciones y cierre de notas",
  },
  {
    id: "final-feb-1-insc",
    categoria: "inscripciones",
    nombre: "Inscripción finales - Febrero 1° llamado",
    tipo: "rango",
    inicio: "2026-02-02",
    fin: "2026-02-08",
    nota: "Semana de exámenes: 09/02 al 14/02",
  },
  {
    id: "final-feb-1",
    categoria: "examenes",
    nombre: "Mesas de final - Febrero 1° llamado",
    tipo: "rango",
    inicio: "2026-02-09",
    fin: "2026-02-14",
  },
  {
    id: "final-feb-2-insc",
    categoria: "inscripciones",
    nombre: "Inscripción finales - Febrero 2° llamado",
    tipo: "rango",
    inicio: "2026-02-16",
    fin: "2026-02-22",
    nota: "Semana de exámenes: 23/02 al 28/02",
  },
  {
    id: "final-feb-2",
    categoria: "examenes",
    nombre: "Mesas de final - Febrero 2° llamado",
    tipo: "rango",
    inicio: "2026-02-23",
    fin: "2026-02-28",
  },
  {
    id: "final-mar-insc",
    categoria: "inscripciones",
    nombre: "Inscripción finales - Marzo",
    tipo: "rango",
    inicio: "2026-03-16",
    fin: "2026-03-22",
    nota: "Semana de exámenes: 25/03 al 31/03",
  },
  {
    id: "final-mar",
    categoria: "examenes",
    nombre: "Mesas de final - Marzo",
    tipo: "rango",
    inicio: "2026-03-25",
    fin: "2026-03-31",
  },
  {
    id: "final-abr-insc",
    categoria: "inscripciones",
    nombre: "Inscripción finales - Abril",
    tipo: "rango",
    inicio: "2026-04-13",
    fin: "2026-04-19",
    nota: "Semana de exámenes: 20/04 al 25/04",
  },
  {
    id: "final-abr",
    categoria: "examenes",
    nombre: "Mesas de final - Abril",
    tipo: "rango",
    inicio: "2026-04-20",
    fin: "2026-04-25",
  },
  {
    id: "malvinas",
    categoria: "feriado",
    nacional: true,
    nombre: "Día del Veterano y de los Caídos en Malvinas",
    tipo: "fecha",
    inicio: "2026-04-02",
    fin: "2026-04-02",
    nota: "Feriado inamovible",
  },
  {
    id: "viernes-santo",
    categoria: "feriado",
    nacional: true,
    nombre: "Viernes Santo",
    tipo: "fecha",
    inicio: "2026-04-03",
    fin: "2026-04-03",
    nota: "Feriado inamovible",
  },
  {
    id: "jueves-santo",
    categoria: "feriado",
    nombre: "Jueves Santo",
    tipo: "fecha",
    inicio: "2026-04-02",
    fin: "2026-04-02",
    nota: "Festividad cristiana",
  },
  {
    id: "pesaj",
    categoria: "feriado",
    nombre: "Pesaj (Pascuas Judías)",
    tipo: "rango",
    inicio: "2026-04-02",
    fin: "2026-04-09",
    nota: "Solo para quienes profesen religión judía",
  },
  {
    id: "tolerancia-armenia",
    categoria: "feriado",
    nacional: true,
    nombre: "Día por tolerancia y respeto entre pueblos",
    tipo: "fecha",
    inicio: "2026-04-24",
    fin: "2026-04-24",
    nota: "Conmemoración genocidio armenio",
  },
  {
    id: "trabajador",
    categoria: "feriado",
    nacional: true,
    nombre: "Día del Trabajador",
    tipo: "fecha",
    inicio: "2026-05-01",
    fin: "2026-05-01",
    nota: "Feriado inamovible",
  },
  {
    id: "final-may-insc",
    categoria: "inscripciones",
    nombre: "Inscripción finales - Mayo",
    tipo: "rango",
    inicio: "2026-05-18",
    fin: "2026-05-24",
    nota: "Semana de exámenes: 26/05 al 01/06",
  },
  {
    id: "final-may",
    categoria: "examenes",
    nombre: "Mesas de final - Mayo",
    tipo: "rango",
    inicio: "2026-05-26",
    fin: "2026-06-01",
  },
  {
    id: "id-al-fitr",
    categoria: "feriado",
    nombre: "Id Al-Fitr (ruptura del ayuno Ramadán)",
    tipo: "fecha",
    inicio: "2026-03-20",
    fin: "2026-03-20",
    nota: "Solo para quienes profesen religión islámica",
  },
  {
    id: "revolucion-mayo",
    categoria: "feriado",
    nacional: true,
    nombre: "Día de la Revolución de Mayo",
    tipo: "fecha",
    inicio: "2026-05-25",
    fin: "2026-05-25",
    nota: "Feriado inamovible",
  },
  {
    id: "guemes",
    categoria: "feriado",
    nacional: true,
    nombre: "Paso a la inmortalidad de Güemes",
    tipo: "fecha",
    inicio: "2026-06-15",
    fin: "2026-06-15",
    nota: "Trasladado del 17 de junio",
  },
  {
    id: "altas-pases-1",
    categoria: "inscripciones",
    nombre: "Altas, pases y cambios de plan",
    tipo: "rango",
    inicio: "2026-06-24",
    fin: "2026-07-07",
    nota: "Se resuelven antes del 2do semestre 2026",
  },
  {
    id: "final-jun-insc",
    categoria: "inscripciones",
    nombre: "Inscripción finales - Junio",
    tipo: "rango",
    inicio: "2026-06-15",
    fin: "2026-06-21",
    nota: "Semana de exámenes: 22/06 al 27/06",
  },
  {
    id: "final-jun",
    categoria: "examenes",
    nombre: "Mesas de final - Junio",
    tipo: "rango",
    inicio: "2026-06-22",
    fin: "2026-06-27",
  },
  {
    id: "colacion-jun",
    categoria: "otro",
    nombre: "Acto de colación de grado",
    tipo: "fecha",
    inicio: "2026-06-01",
    fin: "2026-06-01",
  },
  {
    id: "belgrano",
    categoria: "feriado",
    nacional: true,
    nombre: "Paso a la inmortalidad de Belgrano",
    tipo: "fecha",
    inicio: "2026-06-20",
    fin: "2026-06-20",
    nota: "Feriado inamovible",
  },
  {
    id: "ras-as-sana",
    categoria: "feriado",
    nombre: "R'as as-Sana (Año Nuevo Islámico)",
    tipo: "fecha",
    inicio: "2026-06-26",
    fin: "2026-06-26",
    nota: "Solo para quienes profesen religión islámica",
  },
  {
    id: "receso-invierno",
    categoria: "receso",
    nombre: "Receso invernal",
    tipo: "rango",
    inicio: "2026-07-20",
    fin: "2026-08-02",
    nota: "A confirmar por UNLP",
  },
  {
    id: "final-jul-insc",
    categoria: "inscripciones",
    nombre: "Inscripción finales - Julio",
    tipo: "rango",
    inicio: "2026-07-06",
    fin: "2026-07-12",
    nota: "Semana de exámenes: 13/07 al 18/07",
  },
  {
    id: "final-jul",
    categoria: "examenes",
    nombre: "Mesas de final - Julio",
    tipo: "rango",
    inicio: "2026-07-13",
    fin: "2026-07-18",
  },
  {
    id: "turismo-julio",
    categoria: "otro",
    nombre: "Día sin actividad académica (turismo)",
    tipo: "fecha",
    inicio: "2026-07-10",
    fin: "2026-07-10",
    nota: "Res. 164/25 Jefatura de Gabinete",
  },
  {
    id: "independencia",
    categoria: "feriado",
    nacional: true,
    nombre: "Día de la Independencia",
    tipo: "fecha",
    inicio: "2026-07-09",
    fin: "2026-07-09",
    nota: "Feriado inamovible",
  },
  {
    id: "aniv-unlp",
    categoria: "otro",
    nombre: "Aniversario de la UNLP",
    tipo: "fecha",
    inicio: "2026-08-12",
    fin: "2026-08-12",
    nota: "Día sin actividad académica ni administrativa",
  },
  {
    id: "final-ago-insc",
    categoria: "inscripciones",
    nombre: "Inscripción finales - Agosto",
    tipo: "rango",
    inicio: "2026-08-10",
    fin: "2026-08-16",
    nota: "Semana de exámenes: 18/08 al 24/08",
  },
  {
    id: "final-ago",
    categoria: "examenes",
    nombre: "Mesas de final - Agosto",
    tipo: "rango",
    inicio: "2026-08-18",
    fin: "2026-08-24",
  },
  {
    id: "insc-2c",
    categoria: "inscripciones",
    nombre: "Inscripción a asignaturas 2do semestre",
    tipo: "rango",
    inicio: "2026-08-03",
    fin: "2026-08-16",
  },
  {
    id: "insc-redictados",
    categoria: "inscripciones",
    nombre: "Inscripción a redictados 2do semestre",
    tipo: "rango",
    inicio: "2026-08-11",
    fin: "2026-08-13",
    nota: "Por web de la facultad",
  },
  {
    id: "segundo-semestre",
    categoria: "clases",
    nombre: "Segundo semestre",
    tipo: "rango",
    inicio: "2026-08-18",
    fin: "2027-02-06",
    nota: "Dictado, evaluaciones y cierre de notas",
  },
  {
    id: "san-martin",
    categoria: "feriado",
    nacional: true,
    nombre: "Paso a la inmortalidad de San Martín",
    tipo: "fecha",
    inicio: "2026-08-17",
    fin: "2026-08-17",
    nota: "Feriado inamovible",
  },
  {
    id: "final-sep-insc",
    categoria: "inscripciones",
    nombre: "Inscripción finales - Septiembre",
    tipo: "rango",
    inicio: "2026-09-07",
    fin: "2026-09-13",
    nota: "Semana de exámenes: 14/09 al 19/09",
  },
  {
    id: "final-sep",
    categoria: "examenes",
    nombre: "Mesas de final - Septiembre",
    tipo: "rango",
    inicio: "2026-09-14",
    fin: "2026-09-19",
  },
  {
    id: "dia-docente",
    categoria: "otro",
    nombre: "Día del Trabajador Docente",
    tipo: "fecha",
    inicio: "2026-09-11",
    fin: "2026-09-11",
    nota: "Asueto académico únicamente",
  },
  {
    id: "dia-estudiante",
    categoria: "otro",
    nombre: "Día del Estudiante",
    tipo: "fecha",
    inicio: "2026-09-21",
    fin: "2026-09-21",
    nota: "Asueto académico únicamente",
  },
  {
    id: "rosh-hashana",
    categoria: "feriado",
    nombre: "Rosh Hashaná (Año Nuevo Judío)",
    tipo: "rango",
    inicio: "2026-09-12",
    fin: "2026-09-13",
    nota: "Solo para quienes profesen religión judía",
  },
  {
    id: "iom-kipur",
    categoria: "feriado",
    nombre: "Iom Kipur (Día del Perdón)",
    tipo: "fecha",
    inicio: "2026-09-21",
    fin: "2026-09-21",
    nota: "Solo para quienes profesen religión judía",
  },
  {
    id: "final-oct-insc",
    categoria: "inscripciones",
    nombre: "Inscripción finales - Octubre",
    tipo: "rango",
    inicio: "2026-10-05",
    fin: "2026-10-11",
    nota: "Semana de exámenes: 13/10 al 19/10",
  },
  {
    id: "final-oct",
    categoria: "examenes",
    nombre: "Mesas de final - Octubre",
    tipo: "rango",
    inicio: "2026-10-13",
    fin: "2026-10-19",
  },
  {
    id: "diversidad-cultural",
    categoria: "feriado",
    nacional: true,
    nombre: "Día del Respeto a la Diversidad Cultural",
    tipo: "fecha",
    inicio: "2026-10-12",
    fin: "2026-10-12",
    nota: "Feriado inamovible",
  },
  {
    id: "final-nov-insc",
    categoria: "inscripciones",
    nombre: "Inscripción finales - Noviembre",
    tipo: "rango",
    inicio: "2026-11-02",
    fin: "2026-11-08",
    nota: "Semana de exámenes: 09/11 al 14/11",
  },
  {
    id: "final-nov",
    categoria: "examenes",
    nombre: "Mesas de final - Noviembre",
    tipo: "rango",
    inicio: "2026-11-09",
    fin: "2026-11-14",
  },
  {
    id: "aniv-la-plata",
    categoria: "otro",
    nombre: "Aniversario fundación de La Plata",
    tipo: "fecha",
    inicio: "2026-11-19",
    fin: "2026-11-19",
    nota: "Día sin actividad académica ni administrativa",
  },
  {
    id: "no-docente",
    categoria: "otro",
    nombre: "Día del Trabajador No Docente",
    tipo: "fecha",
    inicio: "2026-11-26",
    fin: "2026-11-26",
    nota: "Día sin actividad académica ni administrativa",
  },
  {
    id: "soberania",
    categoria: "feriado",
    nacional: true,
    nombre: "Día de la Soberanía Nacional",
    tipo: "fecha",
    inicio: "2026-11-23",
    fin: "2026-11-23",
    nota: "Trasladado del 20 de noviembre",
  },
  {
    id: "id-al-adha",
    categoria: "feriado",
    nombre: "Id Al-Adha (Fiesta del Sacrificio)",
    tipo: "fecha",
    inicio: "2026-05-27",
    fin: "2026-05-27",
    nota: "Solo para quienes profesen religión islámica",
  },
  {
    id: "altas-pases-2",
    categoria: "inscripciones",
    nombre: "Altas, pases y cambios de plan",
    tipo: "rango",
    inicio: "2026-11-24",
    fin: "2026-12-04",
    nota: "Se resuelven antes del 1er semestre 2027",
  },
  {
    id: "final-dic-1-insc",
    categoria: "inscripciones",
    nombre: "Inscripción finales - Diciembre 1° llamado",
    tipo: "rango",
    inicio: "2026-11-23",
    fin: "2026-11-29",
    nota: "Semana de exámenes: 30/11 al 05/12",
  },
  {
    id: "final-dic-1",
    categoria: "examenes",
    nombre: "Mesas de final - Diciembre 1° llamado",
    tipo: "rango",
    inicio: "2026-11-30",
    fin: "2026-12-05",
  },
  {
    id: "final-dic-2-insc",
    categoria: "inscripciones",
    nombre: "Inscripción finales - Diciembre 2° llamado",
    tipo: "rango",
    inicio: "2026-12-07",
    fin: "2026-12-13",
    nota: "Semana de exámenes: 14/12 al 19/12",
  },
  {
    id: "final-dic-2",
    categoria: "examenes",
    nombre: "Mesas de final - Diciembre 2° llamado",
    tipo: "rango",
    inicio: "2026-12-14",
    fin: "2026-12-19",
    nota: "Solo se puede rendir una asignatura en uno solo de los llamados",
  },
  {
    id: "colacion-dic",
    categoria: "otro",
    nombre: "Acto de colación de grado",
    tipo: "fecha",
    inicio: "2026-12-01",
    fin: "2026-12-01",
  },
  {
    id: "turismo-diciembre",
    categoria: "otro",
    nombre: "Día sin actividad académica (turismo)",
    tipo: "fecha",
    inicio: "2026-12-07",
    fin: "2026-12-07",
    nota: "Res. 164/25 Jefatura de Gabinete",
  },
  {
    id: "inmaculada",
    categoria: "feriado",
    nacional: true,
    nombre: "Inmaculada Concepción de María",
    tipo: "fecha",
    inicio: "2026-12-08",
    fin: "2026-12-08",
    nota: "Feriado inamovible",
  },
  {
    id: "navidad",
    categoria: "feriado",
    nacional: true,
    nombre: "Navidad",
    tipo: "fecha",
    inicio: "2026-12-25",
    fin: "2026-12-25",
    nota: "Feriado inamovible",
  },
  {
    id: "no-adeudar",
    categoria: "otro",
    nombre: "Plazo certificado de no adeudar materias secundarias",
    tipo: "fecha",
    inicio: "2026-07-10",
    fin: "2026-07-10",
    nota: "Ciclo inicial 2026",
  },
  {
    id: "analitico",
    categoria: "otro",
    nombre: "Plazo certificado analítico secundario",
    tipo: "fecha",
    inicio: "2027-02-26",
    fin: "2027-02-26",
    nota: "Ciclo inicial 2026",
  },
];

// ---------------------------------------------------------------------------
// Helpers de fecha (sin libs externas)
// ---------------------------------------------------------------------------

/**
 * Parsea YYYY-MM-DD a Date en hora local (medianoche). NO usar `new Date(s)`
 * directo porque interpreta como UTC y rompe los días.
 */
export function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Compara solo Y-M-D ignorando hora. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** ¿La fecha `d` cae dentro del evento (inclusive)? */
export function eventoContieneDia(ev: EventoCalendario, d: Date): boolean {
  const inicio = parseLocalDate(ev.inicio);
  const fin = parseLocalDate(ev.fin);
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return target >= inicio && target <= fin;
}

export function diasDeRango(inicio: string, fin: string): number {
  const a = parseLocalDate(inicio);
  const b = parseLocalDate(fin);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000) + 1;
}

/** Eventos que ocurren ese día (orden: rangos primero, luego puntuales). */
export function eventosEnDia(
  d: Date,
  eventos: EventoCalendario[] = eventosCalendario,
): EventoCalendario[] {
  return eventos
    .filter((ev) => eventoContieneDia(ev, d))
    .sort((a, b) => {
      if (a.tipo === b.tipo) return a.nombre.localeCompare(b.nombre);
      return a.tipo === "rango" ? -1 : 1;
    });
}

/** "Eventos largos": rangos de más de 14 días (cuatrimestres, recesos, etc.). */
export function eventosLargos(
  eventos: EventoCalendario[] = eventosCalendario,
): EventoCalendario[] {
  return eventos
    .filter((ev) => ev.tipo === "rango" && diasDeRango(ev.inicio, ev.fin) > 14)
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
}

/** Próximos N días (default 30) desde `from`. Incluye eventos en curso. */
export function eventosProximos(
  from: Date,
  days = 30,
  eventos: EventoCalendario[] = eventosCalendario,
): EventoCalendario[] {
  const fromTime = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate(),
  ).getTime();
  const toTime = fromTime + days * 86_400_000;
  return eventos
    .filter((ev) => {
      const inicio = parseLocalDate(ev.inicio).getTime();
      const fin = parseLocalDate(ev.fin).getTime();
      // Evento incluido si su rango cruza la ventana [from, from+days).
      return fin >= fromTime && inicio < toTime;
    })
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
}

/** Eventos activos en `d` (hoy en curso). */
export function eventosActivos(
  d: Date,
  eventos: EventoCalendario[] = eventosCalendario,
): EventoCalendario[] {
  return eventos
    .filter((ev) => eventoContieneDia(ev, d))
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
}

/** Fracción [0, 1] de progreso del evento en la fecha `d`. */
export function progresoDeEvento(ev: EventoCalendario, d: Date): number {
  const inicio = parseLocalDate(ev.inicio).getTime();
  const fin = parseLocalDate(ev.fin).getTime();
  if (fin <= inicio) return 1;
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  if (t <= inicio) return 0;
  if (t >= fin) return 1;
  return (t - inicio) / (fin - inicio);
}

// ---------------------------------------------------------------------------
// Categorías: orden, etiqueta, color
// ---------------------------------------------------------------------------

export const CATEGORIAS_ORDEN: EventoCategoria[] = [
  "clases",
  "examenes",
  "inscripciones",
  "feriado",
  "receso",
  "otro",
];

export const CATEGORIA_LABELS: Record<EventoCategoria, string> = {
  clases: "Clases",
  examenes: "Exámenes",
  inscripciones: "Inscripciones",
  feriado: "Feriados",
  receso: "Receso",
  otro: "Otros",
};

/**
 * Clases Tailwind para chip + dot del calendario, ya pensadas para
 * que se vean bien en light y dark mode.
 */
export const CATEGORIA_STYLES: Record<
  EventoCategoria,
  { dot: string; chip: string; chipBorder: string }
> = {
  clases: {
    dot: "bg-primary",
    chip: "bg-pastel-blue text-primary dark:text-blue-100",
    chipBorder: "border-primary/30",
  },
  examenes: {
    dot: "bg-amber-500",
    chip: "bg-pastel-amber text-amber-900 dark:text-amber-100",
    chipBorder: "border-amber-400/40",
  },
  inscripciones: {
    dot: "bg-emerald-500",
    chip: "bg-pastel-mint text-emerald-900 dark:text-emerald-100",
    chipBorder: "border-emerald-400/40",
  },
  feriado: {
    dot: "bg-rose-500",
    chip: "bg-pastel-rose text-rose-900 dark:text-rose-100",
    chipBorder: "border-rose-400/40",
  },
  receso: {
    dot: "bg-stone-500",
    chip: "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
    chipBorder: "border-stone-300/50 dark:border-stone-700/50",
  },
  otro: {
    dot: "bg-violet-500",
    chip: "bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-100",
    chipBorder: "border-violet-400/40",
  },
};

// ---------------------------------------------------------------------------
// Formateo es-AR
// ---------------------------------------------------------------------------

const MESES_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function formatFechaCorta(s: string): string {
  const d = parseLocalDate(s);
  return `${d.getDate()} ${MESES_ES[d.getMonth()].slice(0, 3)}`;
}

export function formatFechaLarga(s: string): string {
  const d = parseLocalDate(s);
  return `${d.getDate()} de ${MESES_ES[d.getMonth()]} de ${d.getFullYear()}`;
}

/**
 * Siempre devuelve un rango legible en español natural, sin flechas.
 * Capitaliza la primera letra para usarse al inicio de un texto.
 * - Mismo día:         "9 de febrero de 2026"
 * - Mismo mes y año:   "Del 9 al 14 de febrero de 2026"
 * - Mismo año:         "Del 9 de febrero al 14 de marzo de 2026"
 * - Distinto año:      "Del 9 de febrero de 2026 al 14 de marzo de 2027"
 */
export function formatRango(inicio: string, fin: string): string {
  if (inicio === fin) return formatFechaLarga(inicio);
  const a = parseLocalDate(inicio);
  const b = parseLocalDate(fin);
  const mismoAnio = a.getFullYear() === b.getFullYear();
  const mismoMes = mismoAnio && a.getMonth() === b.getMonth();

  if (mismoMes) {
    return `Del ${a.getDate()} al ${b.getDate()} de ${MESES_ES[a.getMonth()]} de ${a.getFullYear()}`;
  }
  if (mismoAnio) {
    return `Del ${a.getDate()} de ${MESES_ES[a.getMonth()]} al ${b.getDate()} de ${MESES_ES[b.getMonth()]} de ${a.getFullYear()}`;
  }
  return `Del ${a.getDate()} de ${MESES_ES[a.getMonth()]} de ${a.getFullYear()} al ${b.getDate()} de ${MESES_ES[b.getMonth()]} de ${b.getFullYear()}`;
}

export function nombreMes(year: number, month: number): string {
  return `${MESES_ES[month][0].toUpperCase()}${MESES_ES[month].slice(1)} ${year}`;
}
