import { z } from "zod";
import type { ProductOverride, SeedProduct } from "./catalog";

export const STUDIO_EXPORT_APP = "rue-mira-studio";

const overrideSchema = z
  .object({
    price: z.number().int().min(100).max(99900).optional(),
    stock: z.record(z.string(), z.number().int().min(0).max(999)).optional(),
    hidden: z.boolean().optional(),
  })
  .strict();

export const exportSchema = z
  .object({
    app: z.literal(STUDIO_EXPORT_APP),
    version: z.literal(1),
    exportedAt: z.string().optional(),
    overrides: z.record(z.string().regex(/^rm-\d{3}$/), overrideSchema),
  })
  .strict();

/** Validate overrides against the real catalog: unknown products and sizes are dropped. */
export function sanitizeOverrides(raw: unknown, seed: readonly SeedProduct[]): Record<string, ProductOverride> | null {
  const parsed = z.record(z.string(), overrideSchema).safeParse(raw);
  if (!parsed.success) return null;
  const out: Record<string, ProductOverride> = {};
  for (const [id, o] of Object.entries(parsed.data)) {
    const p = seed.find((s) => s.id === id);
    if (!p) continue;
    const clean: ProductOverride = {};
    if (o.price != null) clean.price = o.price;
    if (o.hidden != null) clean.hidden = o.hidden;
    if (o.stock) {
      const stock: Record<string, number> = {};
      for (const [size, n] of Object.entries(o.stock)) if (p.sizes.includes(size)) stock[size] = n;
      if (Object.keys(stock).length) clean.stock = stock;
    }
    if (Object.keys(clean).length) out[id] = clean;
  }
  return out;
}

export function parseStudioImport(text: string, seed: readonly SeedProduct[]): Record<string, ProductOverride> | null {
  if (text.length > 200_000) return null;
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return null;
  }
  const parsed = exportSchema.safeParse(json);
  if (!parsed.success) return null;
  return sanitizeOverrides(parsed.data.overrides, seed);
}

export function buildStudioExport(overrides: Record<string, ProductOverride>): string {
  return JSON.stringify({ app: STUDIO_EXPORT_APP, version: 1, exportedAt: new Date().toISOString(), overrides }, null, 2);
}
