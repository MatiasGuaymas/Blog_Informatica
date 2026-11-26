"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import "./globals.css";

const isDevelopment = () => process.env.NODE_ENV !== "production";

// Global error boundary for root layout failures.
// Kept self-contained - the layout itself may be broken when this renders.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (isDevelopment()) console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="es">
      <body className="m-0 min-h-screen font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center text-foreground">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
            <AlertTriangle
              className="h-8 w-8 text-destructive"
              aria-hidden="true"
            />
          </div>
          <h1 className="mb-2 text-2xl font-semibold">Algo salió mal</h1>
          <p className="mb-6 max-w-sm text-muted-foreground">
            Ocurrió un error crítico. Probá recargar la página.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={reset}
              className="cursor-pointer rounded-md border-0 bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Reintentar
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-4 py-2 font-medium text-foreground no-underline transition-colors hover:bg-muted/50"
            >
              Ir al inicio
            </Link>
          </div>
          {error.digest && (
            <p className="mt-4 text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
