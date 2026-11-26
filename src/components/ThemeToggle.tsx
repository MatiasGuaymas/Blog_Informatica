"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = (localStorage.getItem("theme") as ThemeMode | null) || null;
  if (stored === "light" || stored === "dark") return stored;
  // Default to light mode for first-time users
  return "light";
}

type ThemeToggleProps = {
  variant?: "default" | "outlined";
};

export default function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    const root = document.documentElement;
    // Desactivamos transiciones por 1 frame para que el cambio de CSS vars
    // sea instantáneo. Si no, las transitions de los items del sidebar
    // (transition-all 200ms), del body, de hovers, etc. animan los colores
    // sobre los nuevos valores y queda titilando feo.
    root.classList.add("theme-no-transition");
    setTheme((t) => (t === "light" ? "dark" : "light"));
    // Doble rAF: aseguramos que el navegador aplicó el nuevo data-theme
    // y commiteó los nuevos colores ANTES de re-habilitar transitions.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("theme-no-transition");
      });
    });
  }

  const Icon = theme === "dark" ? Sun : Moon;

  const baseClasses =
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border cursor-pointer transition-[background-color,border-color,color,transform] duration-200";
  const variantClasses =
    variant === "outlined"
      ? "border-white/50 bg-transparent text-white hover:bg-white/10"
      : "border-border bg-card text-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary active:scale-95";

  return (
    <button
      type="button"
      aria-label="Cambiar tema"
      onClick={toggleTheme}
      className={`${baseClasses} ${variantClasses}`}
    >
      <Icon className="h-4 w-4 transition-transform duration-200 hover:rotate-12" />
    </button>
  );
}
