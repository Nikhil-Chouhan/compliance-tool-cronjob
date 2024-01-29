import * as z from "zod"

export const entityModel = z.object({
  id: z.number().int().nullish(),
  name: z.string(),
  status: z.number().int().nullish(),
  created_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  updated_at: z.date().nullish(),
  organization_id: z.number().int(),
  cin: z.string().nullish(),
  industry_id: z.number().int().nullish(),
  logo: z.string().nullish(),
  gst: z.string().nullish(),
  pan: z.string().nullish(),
  short_name: z.string().nullish(),
  tan: z.string().nullish(),
})
