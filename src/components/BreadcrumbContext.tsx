"use client";

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type BreadcrumbOverrides = Record<string, string>;

interface BreadcrumbContextType {
  overrides: BreadcrumbOverrides;
  setOverride: (segment: string, label: string) => void;
  removeOverride: (segment: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined,
);

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [overrides, setOverrides] = useState<BreadcrumbOverrides>({});

  const setOverride = useCallback((segment: string, label: string) => {
    setOverrides((prev) => {
      if (prev[segment] === label) return prev;
      return { ...prev, [segment]: label };
    });
  }, []);

  const removeOverride = useCallback((segment: string) => {
    setOverrides((prev) => {
      if (!(segment in prev)) return prev;
      const next = { ...prev };
      delete next[segment];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ overrides, setOverride, removeOverride }),
    [overrides, setOverride, removeOverride],
  );

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

/**
 * Override the breadcrumb label for a path segment (e.g. a dynamic ID).
 *
 * Call with the raw segment value and the display label. Pass `undefined`
 * as label while data is loading - the breadcrumb will show "…" instead
 * of the raw ID. Cleans up automatically on unmount.
 *
 * @example
 * const { id } = useParams();
 * const [item, setItem] = useState(null);
 * useBreadcrumbOverride(id, item?.name);
 */
export function useBreadcrumbOverride(
  segment: string | undefined,
  label: string | undefined,
) {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) {
    throw new Error(
      "useBreadcrumbOverride must be used within a BreadcrumbProvider",
    );
  }

  const { setOverride, removeOverride } = ctx;

  useEffect(() => {
    if (!segment) return;
    if (label) {
      setOverride(segment, label);
    }
    return () => {
      removeOverride(segment);
    };
  }, [segment, label, setOverride, removeOverride]);
}

export function useBreadcrumbOverrides(): BreadcrumbOverrides {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) {
    throw new Error(
      "useBreadcrumbOverrides must be used within a BreadcrumbProvider",
    );
  }
  return ctx.overrides;
}
