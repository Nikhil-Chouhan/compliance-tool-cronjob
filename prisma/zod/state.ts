import * as z from "zod"

export const stateModel = z.object({
  id: z.number().int().nullish(),
  code: z.string().nullish(),
  name: z.string(),
  country_id: z.number().int().nullish(),
  status: z.number().int().nullish(),
  created_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  updated_at: z.date().nullish(),
})
