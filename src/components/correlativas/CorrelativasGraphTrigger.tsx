"use client";

import { Network } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Carrera } from "@/lib/carreras";
import { CorrelativasGraph } from "./CorrelativasGraph";

interface Props {
  carrera: Carrera;
}

export function CorrelativasGraphTrigger({ carrera }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Estilo igual que el link "Plan oficial" del header de la
       * carrera: text-xs en color primary, sin border, sin background.
       * El icono de red pequeño lo distingue de un link normal. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-primary transition-colors hover:underline"
      >
        <Network className="h-3 w-3" />
        Ver grafo de correlativas
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="!max-w-[95vw] !w-[95vw] !h-[92vh] p-0 sm:!max-w-[95vw]"
          closeLabel="Cerrar"
        >
          <div className="flex h-full max-h-[92vh] flex-col">
            <header className="border-b border-border px-5 py-3 pr-14">
              <DialogTitle className="text-base font-semibold leading-tight text-foreground">
                Correlativas de {carrera.nombre}
              </DialogTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Las flechas indican qué materia hay que aprobar antes de cursar
                la siguiente. Click en una materia para ver su detalle.
              </p>
            </header>
            <div className="min-h-0 flex-1">
              {/* Solo montamos el grafo cuando el modal está abierto.
               * Evita pagar el costo de inicializar React Flow si el
               * usuario no llega a abrir el modal. */}
              {open && <CorrelativasGraph carrera={carrera} />}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
