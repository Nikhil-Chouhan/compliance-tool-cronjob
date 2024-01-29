import * as z from "zod"

export const organizationModel = z.object({
  id: z.number().int().nullish(),
  name: z.string(),
  status: z.number().int().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  cin: z.string().nullish(),
  gst_number: z.string().nullish(),
  industry_id: z.number().int().nullish(),
  logo: z.string().nullish(),
  theme_id: z.number().int().nullish(),
})
