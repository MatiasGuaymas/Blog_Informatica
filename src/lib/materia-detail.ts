/**
 * Editorial content of a subject page (/materia/[slug]). Every field except
 * `resumen` is optional, so subjects without notes can be filled in
 * incrementally. The page renders one section per field, in this order:
 * summary, format, study material, my take, recommendations, bibliography,
 * how the material is organized, and useful links.
 */
export interface MateriaDetail {
  /** Topics the subject covers (one or two paragraphs). */
  resumen: string;
  /** How the course runs and is graded: semester or year, midterms, finals, promotion. */
  modalidad?: string;
  /** Direct links to study material (notes, recordings, solved exercises, slides). */
  material?: { label: string; href: string }[];
  /** An honest personal take: how hard it is and what to expect. */
  miOpinion?: string;
  /** Concrete tips to approach and pass the subject. */
  recomendaciones?: string;
  /** Formal books and academic references in free form (author, title, publisher). */
  bibliografia?: string[];
  /** How the material is organized and in which order to use it. */
  estructuraMaterial?: string;
  /** Any other link (course site, student groups, and so on). */
  links?: { label: string; href: string }[];
}
