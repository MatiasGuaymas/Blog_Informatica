"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string | null;
}

export function ErrorModal({
  open,
  onClose,
  title = "Error",
  message,
}: ErrorModalProps) {
  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-destructive">
            <div className="flex-shrink-0 p-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="leading-tight">{title}</span>
          </DialogTitle>
          <DialogDescription
            render={
              <div className="mt-3 text-sm text-foreground/90 whitespace-pre-wrap break-words leading-relaxed max-h-60 overflow-y-auto scrollbar-thin rounded-lg bg-muted/30 p-3 border border-border/50" />
            }
          >
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-1.5" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
