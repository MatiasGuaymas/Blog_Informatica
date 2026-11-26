import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { NavigationLoadingProvider } from "@/components/NavigationLoadingProvider";
import { Toaster } from "@/components/ui/toast";
import { absoluteUrl, SITE } from "@/lib/site";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    // Plantilla para títulos de subpáginas: "Carreras · Blog Informática UNLP".
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author.name, url: SITE.author.url }],
  creator: SITE.author.name,
  publisher: SITE.author.name,
  keywords: [...SITE.keywords],
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  // Sin handle propio: dejamos las meta tags igual porque cuando otra
  // gente comparte la URL en X, X las usa para renderizar la preview.
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE.name,
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// JSON-LD: schema.org @graph con WebSite + Person (autor) + Educational
// Organization (la Facultad). Va inline en el body del root layout porque
// scripts page-level no se serializan en el HTML SSR (problema React 19 /
// Next 16 con scripts dentro del subtree del Toaster client component).
//
// Las entidades se referencian por `@id` para que Google las una en un
// grafo: el WebSite tiene un autor (Person) y un publisher educativo
// (EducationalOrganization), la Person es alumna del publisher.
function siteJsonLd() {
  const personId = `${SITE.url}#person`;
  const orgId = `${SITE.publisher.url}#org`;
  const websiteId = `${SITE.url}#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE.url,
        name: SITE.name,
        alternateName: SITE.shortName,
        description: SITE.description,
        inLanguage: "es-AR",
        author: { "@id": personId },
        publisher: { "@id": personId },
        about: { "@id": orgId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: SITE.author.name,
        url: SITE.author.url,
        jobTitle: SITE.author.jobTitle,
        alumniOf: { "@id": orgId },
        sameAs: [...SITE.author.sameAs],
        knowsAbout: [...SITE.author.knowsAbout],
      },
      {
        "@type": "EducationalOrganization",
        "@id": orgId,
        name: SITE.publisher.name,
        url: SITE.publisher.url,
        parentOrganization: {
          "@type": "CollegeOrUniversity",
          name: SITE.publisher.parentName,
          url: SITE.publisher.parentUrl,
        },
      },
    ],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${poppins.variable} ${poppins.className} antialiased`}>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data, JSON propio
          dangerouslySetInnerHTML={{
            // Escapamos `<` para evitar romper el script si el JSON
            // contuviera "</script>" (best practice del Next.js docs).
            __html: JSON.stringify(siteJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        <Toaster>
          <Suspense fallback={null}>
            <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
          </Suspense>
        </Toaster>
      </body>
    </html>
  );
}

// Helper exportado para que las páginas hijas puedan armar canonical URLs
// fácilmente sin importar el helper desde lib.
export { absoluteUrl };
