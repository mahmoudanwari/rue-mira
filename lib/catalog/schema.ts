import { z } from "zod";

export const CATEGORY_IDS = ["dresses", "tops", "bottoms", "outerwear", "handbags", "shoes", "jewellery"] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export const productSchema = z.object({
  id: z.string().regex(/^rm-\d{3}$/),
  slug: z.string().min(1),
  name_en: z.string().min(1),
  category: z.enum(CATEGORY_IDS),
  category_label_en: z.string(),
  price_eur: z.number().positive(),
  color_name_en: z.string(),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  sizes: z.array(z.string()).min(1),
  material_en: z.string(),
  description_en: z.string(),
  tags: z.array(z.string()),
  is_new: z.boolean(),
  stock_by_size: z.record(z.string(), z.number().int().min(0)),
  images: z.array(z.string().startsWith("/images/")).length(2),
});

export const catalogSchema = z.array(productSchema).length(32);

export type SeedProduct = z.infer<typeof productSchema>;

export const imageMapSchema = z.object({
  collections: z.record(z.string(), z.string().startsWith("/images/")),
  campaigns: z.record(z.string(), z.string().startsWith("/images/")),
  lookbook: z
    .array(
      z.object({
        id: z.string(),
        title_en: z.string(),
        image: z.string().startsWith("/images/"),
        product_ids: z.array(z.string()).min(1),
      }),
    )
    .length(6),
});
