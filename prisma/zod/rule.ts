import * as z from "zod"

export const ruleModel = z.object({
  id: z.number().int().nullish(),
  uuid: z.string().nullish(),
  legislation_id: z.number().int().nullish(),
  code: z.string().nullish(),
  name: z.string(),
  applicability: z.string().nullish(),
  sources: z.string().nullish(),
  effective_date: z.date().nullish(),
  updated_date: z.date().nullish(),
  documents: z.string(),
  status: z.number().int().nullish(),
  created_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  updated_at: z.date().nullish(),
})
