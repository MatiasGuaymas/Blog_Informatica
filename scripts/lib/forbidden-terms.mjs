/**
 * Third-party brand names that must never appear in this repository, shared
 * by scripts/check-forbidden-terms.mjs and the Claude Code write hook. The
 * patterns are base64-encoded so that this module does not contain them.
 */
const decode = (value) => Buffer.from(value, "base64").toString("utf8");

/** Short token, delimited by non-alphanumerics. Checked in text only. */
export const TOKEN = new RegExp(
  decode("KF58W15hLXowLTldKW1sbShbXmEtejAtOV18JCk="),
  "i",
);

/** Long phrases. Checked everywhere, binary files included. */
export const PHRASES = new RegExp(
  decode(
    "bWxtWy1fIC5dP2FwcHxtYWNoaW5lc1tcc18uLV0qbGlrZVtcc18uLV0qbWV8bWFjaGluZXNsaWtlbWV8cGF0b3ZpY2E=",
  ),
  "i",
);

/** Returns the 1-based line numbers of `text` that contain forbidden terms. */
export function findForbiddenLines(text, { checkToken = true } = {}) {
  const hits = [];
  text.split(/\r?\n/).forEach((line, index) => {
    if (PHRASES.test(line) || (checkToken && TOKEN.test(line))) {
      hits.push(index + 1);
    }
  });
  return hits;
}
