import { z } from "zod";

export const createHeroBannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  category: z.string().optional(),
  badgeText: z.string().optional(),
  badgeDate: z.string().optional(),
  footerText: z.string().optional(),
  plateIndex: z.coerce.number().int().optional(),
  plateTotal: z.coerce.number().int().optional(),
  isActive: z.coerce.boolean().optional(),
  order: z.coerce.number().int().optional(),
});

export const updateHeroBannerSchema = createHeroBannerSchema.partial().extend({
  removeImages: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => (v === undefined ? undefined : Array.isArray(v) ? v : [v])),
});
