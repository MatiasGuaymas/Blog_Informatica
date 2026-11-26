import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// Default Open Graph image of the site (1200x630), served at
// /opengraph-image and referenced from every page's metadata. It renders
// on the server with React style props instead of Tailwind classes. It
// uses the default Node.js runtime (the Edge runtime is deprecated), so
// Next.js prerenders it at build time.

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background:
          "linear-gradient(135deg, #f0f6ff 0%, #e6f0ff 50%, #ffffff 100%)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Brand mark + chip */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "linear-gradient(135deg, #2b7fff 0%, #1a5fd9 100%)",
            color: "white",
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          BI
        </div>
        <div
          style={{
            display: "flex",
            color: "#2b7fff",
            fontSize: 22,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          Facultad de Informática · UNLP
        </div>
      </div>

      {/* Title block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 980,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 24,
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#0a0a14" }}>Blog</span>
          <span
            style={{
              background: "linear-gradient(135deg, #2b7fff 0%, #1a5fd9 70%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Informática
          </span>
        </div>
        <div
          style={{
            display: "flex",
            color: "#3a3a4a",
            fontSize: 32,
            lineHeight: 1.35,
            fontWeight: 400,
          }}
        >
          Compañero de estudio para las carreras de la Facultad de Informática
          UNLP: APU, ATIC, LS y LI.
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#5a5a6a",
          fontSize: 24,
          fontWeight: 500,
        }}
      >
        <div style={{ display: "flex" }}>
          Plan 2021 · Calendario · Cartelera · Bibliografía
        </div>
        <div style={{ display: "flex", color: "#2b7fff", fontWeight: 600 }}>
          {SITE.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
