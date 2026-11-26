"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AnuncioModal } from "@/components/cartelera/AnuncioCard";
import { type Mensaje, formatFechaCompleta } from "@/lib/cartelera";

interface Props {
  mensaje: Mensaje;
}

/**
 * Cuando la URL trae `?a=<mensajeId>`, montamos este componente
 * con el modal abierto al inicio. Al cerrarlo, removemos el query
 * param `a` preservando el resto de los filtros, así el deep-link
 * desde la home (`/cartelera?a=...`) abre el detalle directo y
 * después navegar dentro de la cartelera funciona normal.
 */
export function AutoOpenAnuncioModal({ mensaje }: Props) {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      // Reconstruimos la URL sin el query param `a` para no quedarnos
      // con basura en la barra después de cerrar.
      const params = new URLSearchParams(searchParams.toString());
      params.delete("a");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }

  return (
    <AnuncioModal
      mensaje={mensaje}
      open={open}
      onOpenChange={handleOpenChange}
      fechaCompleta={formatFechaCompleta(mensaje.fecha)}
    />
  );
}
