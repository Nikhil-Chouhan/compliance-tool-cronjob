import * as z from "zod"

export const locationModel = z.object({
  id: z.number().int().nullish(),
  entity_id: z.number().int().nullish(),
  name: z.string(),
  status: z.number().int().nullish(),
  uuid: z.string().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
})
