import * as z from "zod"

export const themeModel = z.object({
  id: z.number().int().nullish(),
  name: z.string(),
  primary_color: z.string(),
  secondary_color: z.string().nullish(),
  mode: z.string(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
})
