# Glossary

The Spanish domain vocabulary of Blog Informática UNLP as it appears in the routes, the code and the UI copy, with its English meaning. The docs write the English term; URLs, identifiers and the site keep the Spanish one. Most terms come from [`carreras.ts`](../src/lib/carreras.ts), [`cartelera.ts`](../src/lib/cartelera.ts), [`calendario.ts`](../src/lib/calendario.ts) and the pages in [`src/app/(public)`](../src/app/(public)/).

## Naming rule

- New identifiers, comments and docs are written in English.
- The exception is the domain vocabulary below that is marked as used in code. Those terms stay Spanish, without accents or ñ (`anio`, `codigo`, `examenes`), combined with English words: `getCarreraBySlug`, `fetchCartelera`, `hasMateriaSlug`, `CorrelativasGraph`, `AnuncioCard`.
- Do not translate a glossary term in code (`Career`, `Subject`, `NoticeBoard`, `Prerequisite`), and do not coin Spanish identifiers outside this glossary (`obtenerCarrera`, `esVisible`).
- The raw API types (`ApiResponse`, `MensajeRaw`, `AdjuntoRaw`) mirror the field names of the UNLP notice board API exactly: `total`, `from`, `count`, `mensajes`, `materia`, `titulo`, `cuerpo`, `fecha`, `autor`, `is_anulado`, `fecha_anulacion`, `adjuntos`, `nombre`, `public_path`. The transformed `Mensaje` type uses camelCase (`isAnulado`, `fechaAnulacion`, `cuerpoHtml`).
- Older code has Spanish helper and variable names outside this glossary, such as `aplicarFiltros`, `listarMaterias`, `filtros`, `esHoy`, `esSeleccionado`, `fotoExiste`, `filas` and `redes`. Leave them until that code is refactored, and do not copy the pattern.
- Routes are Spanish because they mirror UNLP terms: `/carreras`, `/materia/[slug]`, `/cartelera`, `/calendario`, `/bibliografia`, `/links`, `/sobre-mi`.
- A new domain term gets a row here in the same pull request that introduces it.

## Careers and study plans

| Term | English | Where it appears |
|---|---|---|
| `carrera`, `carreras` | Career: one of the four undergraduate degree programs | Routes `/carreras` and `/carreras/[carrera]`; query `carrera` on `/cartelera`; code `Carrera`, `carreras`, `getCarreraBySlug`, `getCarrerasContaining`, `carrerasDeMateria`; UI "Carreras", "Carrera" (notice filter) |
| `plan`, plan de estudios | Study plan: the official curriculum of a career, 2021 version | Code `Carrera.plan`, `PlanRow`, `PLAN_BASE`, `planUrl`, `PlanBloque`; UI "Plan de estudios 2021", "Plan 2021", "Plan oficial" |
| `anio` (año) | Year of the plan, from 1 to 5 | Code `PlanRow.anio`, `duracionAnios`, `ANIO_1_CUAT_1`, `groupByAnioCuatrimestre`; UI "Año 1", "3 años" |
| `cuatrimestre`, `cuat` | Term: one half of the academic year, as the plans call it | Code `Cuatrimestre` (`1`, `2` or `"intro"`), `labelCuatrimestre`, `ANIO_2_CUAT_1`; UI "Cuatrimestre 1", "1° cuat" (graph columns) |
| semestre | Semester: the official calendar's name for the same term | Code `duracion: "Semestral"`, calendar ids `primer-semestre` and `segundo-semestre`; UI "Primer semestre", "Electiva alternativa de 5° semestre" |
| curso de ingreso, curso inicial | Entry course, taken before the first year | Code `cuatrimestre: "intro"`, `INTRODUCTORIAS`; UI "Curso de ingreso" (plan and graph), "Curso inicial" (calendar) |
| licenciatura | Five-year degree that ends with a thesis (LS and LI) | UI only: "Licenciatura en Sistemas", "Carrera de grado de 5 años" |
| analista, titulación de pregrado | Three-year intermediate degree (APU and ATIC) | UI only: career names, "Titulación de pregrado de 3 años" |
| orientación | Specialization track chosen in the last ATIC term: web, cloud and big data, mobile or security | Notes of the `OPT-ATIC-1` and `OPT-ATIC-2` rows; UI "Optativa de orientación 1" |
| facultad | Faculty: the school of the university that runs the careers | UI only: "Facultad de Informática", "Las 4 carreras de la facultad"; `SITE.publisher` |

## Subjects

| Term | English | Where it appears |
|---|---|---|
| `materia` | Subject: one course of a plan | Route `/materia/[slug]`; query `materia` on `/cartelera`; code `materiaSlugs`, `materiaDetails`, `MateriaDetail`, `getMateriaSlug`, `hasMateriaSlug`, `getAllMateriaSlugs`, `MateriaNode`; UI "Materia" (breadcrumb, notice filter) |
| asignatura | Subject, the formal synonym used by the plans and the calendar | Code `cantidadAsignaturas`; UI "24 asignaturas", "Inscripción a asignaturas 1er semestre" |
| `codigo` (código) | Institutional subject code, the global id of a subject, for example `SI106` | Code `PlanRow.codigo`, `getCodigoBySlug`, the keys of `materiaSlugs` and `materiaDetails` |
| `correlativa`, `correlativas` | Prerequisite: a subject that must be passed before taking another | Code `PlanRow.correlativas`, `CorrelativasGraph`, `CorrelativasGraphTrigger`, `CorrelativaEdge`, folder `src/components/correlativas/`, CSS `.correlativas-graph`; UI "Correlativas:", "Ver grafo de correlativas" |
| grafo | Graph, as in the prerequisites graph | Code `GRAFO_HABILITADO_PARA`; UI "Ver grafo de correlativas" |
| `tipo` | Subject type | Code `PlanRow.tipo`, `TipoMateria` |
| `obligatoria` | Mandatory subject, the default when `tipo` is absent | Code `TipoMateria` |
| `introductoria` | Subject of the entry course | Code `TipoMateria` |
| `electiva` | Elective: one of several alternatives the plan offers for the same slot (APU) | Code `TipoMateria`; UI badge "electiva", note "Electiva alternativa de 6° semestre" |
| `optativa` | Optional subject, chosen from a list the faculty publishes every year | Code `TipoMateria`, codes `OPT-LS-1`, `OPT-LI-1`, `OPT-ATIC-1`; UI "Optativa 1", badge "optativa" |
| `tesina` | Thesis that closes a licenciatura | Code `TipoMateria`, codes `OI503-LS` and `OI503-LI`; UI "Tesina de Licenciatura en Sistemas", duration "Trabajo Final" |
| `opciones` | Options within one subject, such as the languages of Seminario de Lenguajes | Code `PlanRow.opciones`; UI "Opciones:" |
| `duracion` (duración) | Duration as the plan states it: "Semestral", "6 semanas", "Trabajo Final" | Code `PlanRow.duracion`, `Carrera.duracionAnios` |
| `nota` | Footnote under a plan row or a calendar event, not a grade | Code `PlanRow.nota`, `EventoCalendario.nota` |
| `resumen` | Summary in a subject's editorial notes | Code `MateriaDetail.resumen` |
| `recomendaciones` | Recommendations in a subject's editorial notes | Code `MateriaDetail.recomendaciones`; UI "Recomendaciones" |
| cursada | Taking a subject during a term: attending and passing its coursework, which unlocks the final exam | UI only: "recomendaciones para cada cursada", "Horarios de cursada", "por orden de cursada" |
| final | Final exam of a subject, taken after passing the cursada | UI only: "Inscripción finales - Julio", "Requiere todos los finales de 1° y 2° año"; calendar ids such as `final-jul` |
| mesa de final | Final exam session: the scheduled dates of a final | UI only: "Mesas de final - Julio" (calendar), "mesas de final" (`/cartelera` and `/calendario` intros) |
| llamado | Call: one exam date within a session | UI only: "Febrero 1° llamado" |
| parcial | Partial exam: an exam during the term that counts toward the cursada | UI only: "parciales" (`/cartelera` intro and description) |
| comisión | Section: one group of students of a subject, with its own schedule | UI only: "Horarios de cursada por materia y comisión" (`/links`), "según comisión" (subject notes) |
| redictado | Re-run of a subject in the other term | UI only: "Inscripción a redictados 2do semestre"; notice subjects that start with "Redictado - " |
| cátedra | Teaching team in charge of a subject | UI only: "ninguna cátedra" (home notice), "Anuncios de cátedras y docentes", "Cada cátedra elige una" |
| docente | Teacher | UI only: "Anuncios de cátedras y docentes" |
| bibliografía | Bibliography: the official course books | Route `/bibliografia`; code `RepoBibliografia`, `BibliografiaPage`; UI "Bibliografía" |

## Notice board

| Term | English | Where it appears |
|---|---|---|
| `cartelera` | Notice board: the faculty's official board of announcements, which the site mirrors | Route `/cartelera`; code `src/lib/cartelera.ts`, `fetchCartelera`, `FiltrosCartelera`, `CarteleraFilters`, `CarteleraPagination`, folder `src/components/cartelera/`, CSS `.cartelera-body`; UI "Cartelera", "Cartelera oficial" |
| `anuncio` | Notice: one announcement as students see it | Code `AnuncioCard`, `AnuncioModal`, `AutoOpenAnuncioModal`, `ULTIMOS_ANUNCIOS`, `AnuncioRow`; UI "Últimos anuncios", "Anuncios en tiempo real" |
| `mensaje` | Message: the API's name for a notice, and its type in code | Code `Mensaje`, `MensajeRaw`, `mensajeId`, `transformMensaje`, API field `mensajes`; the `a` query parameter holds a `mensajeId`; never shown in the UI |
| `adjunto`, `adjuntos` | Attachment, attachments | Code `AdjuntoRaw`, `Mensaje.adjuntos`, `adjuntoEsPdf`; query `adjuntos=1`; UI "Solo con adjuntos", "2 adjuntos" |
| `anulado`, `anulados` | Canceled: a notice its author withdrew | Code `isAnulado`, `fechaAnulacion`, `ocultarAnulados`, API fields `is_anulado` and `fecha_anulacion`; query `anulados=1`; UI badge "Anulado", toggle "Mostrar anulados" |
| `cuerpo` | Body of a notice, as HTML | API field `cuerpo`; code `cuerpoHtml`, `sanitizeCuerpo` |
| `rango` | Range: the date window of the notice filter, or a multi-day calendar event | Query `rango` (`7`, `30`, `90` or `todo`); code `parseRango`, `formatRango`, `EventoTipo` value `"rango"`; UI "Probá ampliar el rango de fechas" |
| en vivo, en tiempo real | Live, real time: notices refreshed every 5 minutes | Code `CarteleraEnVivoSection`; UI "En vivo", "Anuncios en tiempo real" |
| gestión docente | The faculty's teaching management site, which hosts the official board | Code `API_BASE` in `cartelera.ts` (`gestiondocente.info.unlp.edu.ar`); UI "todo lo que se anuncia desde gestión docente" |

## Academic calendar

| Term | English | Where it appears |
|---|---|---|
| `calendario` | Academic calendar | Route `/calendario`; code `src/lib/calendario.ts`, `eventosCalendario`, `CalendarioView`, `CalendarioMensual`, folder `src/components/calendario/`; UI "Calendario académico" |
| `evento` | Calendar event | Code `EventoCalendario`, `eventosEnDia`, `eventosProximos`, `eventosActivos`, `progresoDeEvento`; UI "eventos en este mes", "Sin eventos" |
| `categoria` (categoría) | Event category | Code `EventoCategoria`, `CATEGORIAS_ORDEN`, `CATEGORIA_LABELS`, `CATEGORIA_STYLES` |
| `clases` | Classes: teaching periods | Category value; UI "Clases" |
| `inscripciones`, inscripción | Enrollment in a career, a subject or a final exam | Category value; UI "Inscripciones", "Inscripción finales - Julio" |
| `examenes` (exámenes) | Exams | Category value; UI "Exámenes" |
| `receso` | Break, such as the winter recess | Category value; UI "Receso invernal" |
| `feriado`, `nacional` | Public holiday; `nacional: true` marks a national holiday, tinted red in the month view | Category value and `EventoCalendario.nacional`; UI "Feriados", "feriado nacional" |
| `otro` | Other | Category value; UI "Otros" |
| `fecha` | Date; as an `EventoTipo` value, a single-day event | Code `EventoTipo`, `parseFecha`, `formatFechaLarga`, `formatFechaCompleta` |
| `inicio`, `fin` | Start date and inclusive end date, as `YYYY-MM-DD` | Code `EventoCalendario.inicio` and `EventoCalendario.fin` |
| en curso | Ongoing | Code `enCurso`, `EnCursoBloque`; UI "En curso ahora" |
| próximos | Upcoming | Code `eventosProximos`, `ProximosBloque`; UI "Próximos 30 días" |
| asueto | Day off: classes are suspended | UI only: "Asueto académico únicamente" |
| colación de grado | Graduation ceremony | UI only: "Acto de colación de grado" |
| altas, pases y cambios de plan | Enrollment changes: additions, transfers and switching plans | UI only: calendar event name |

## Site sections

| Term | English | Where it appears |
|---|---|---|
| inicio | Home, as a navigation label | UI "Inicio" (sidebar), "Ir al inicio" (error and 404 pages) |
| recursos | Resources: the sidebar group with the calendar, the bibliography and the links | UI "Recursos" |
| links útiles | Useful links | Route `/links`; UI "Links útiles" |
| sobre mí | About me | Route `/sobre-mi`; code `SobreMiPage`; UI "Sobre mí" |
| migas de pan | Breadcrumbs | UI only: `aria-label="Migas de pan"` in `Breadcrumb.tsx` |

## Acronyms

| Acronym | Meaning |
|---|---|
| APU (`apu`) | Analista Programador Universitario: 3 years, 24 subjects |
| ATIC (`atic`) | Analista en Tecnologías de la Información y la Comunicación: 3 years, 24 subjects |
| LS (`ls`) | Licenciatura en Sistemas: 5 years, 37 subjects |
| LI (`li`) | Licenciatura en Informática: 5 years, 37 subjects |
| UNLP | Universidad Nacional de La Plata |
| PPS | Práctica Profesional Supervisada: the supervised internship of ATIC (`PPS-ATIC`) |
| APREF | Cursos de apoyo para rendir final: support courses before a final exam |
| AComAC | Actividades Complementarias para Aprobación de Cursadas: extra activities to pass a cursada |
| SIU Guaraní | The university system where students enroll in subjects and final exams |

## Words that mean something else here

| Word | Meaning in this project |
|---|---|
| `carrera` | A degree program, not a race or a professional career; the docs gloss it as "career" |
| `nota` | A footnote, not a grade |
| `final` | The final exam of a subject |
| `inicio` | Home in the navigation, and the start date of a calendar event |
| cursada and curso | Cursada is taking a subject during a term; curso is a course in general, as in curso de ingreso |
| cuatrimestre and semestre | The same term: the plans say cuatrimestre, the official calendar says semestre |
| anuncio and mensaje | The same notice: anuncio in components and copy, mensaje in the API and the data types |
