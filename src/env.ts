import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Vercel KV (Redis) - required in production, optional locally if you mock.
    KV_URL: z.string().url().optional(),
    KV_REST_API_URL: z.string().url().optional(),
    KV_REST_API_TOKEN: z.string().min(1).optional(),
    KV_REST_API_READ_ONLY_TOKEN: z.string().min(1).optional(),

    // Admin auth (placeholder - concrete shape will be defined when we wire auth).
    ADMIN_PASSWORD: z.string().min(8).optional(),
    ADMIN_SESSION_SECRET: z.string().min(32).optional(),
  },
  client: {},
  runtimeEnv: {
    KV_URL: process.env.KV_URL,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
  },
  // KV / admin envs are intentionally optional so `pnpm build` works before
  // they're configured in Vercel. Validate at the call site when accessing them.
});

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV !== "production";
}
