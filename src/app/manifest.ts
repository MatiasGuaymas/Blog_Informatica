import type { MetadataRoute } from "next";

const APP_NAME = "Blog Informática UNLP";
const APP_SHORT_NAME = "Blog Informática";
const APP_DESCRIPTION =
  "Compañero de estudio para las carreras de la Facultad de Informática UNLP.";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_SHORT_NAME,
    description: APP_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0076D2",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
