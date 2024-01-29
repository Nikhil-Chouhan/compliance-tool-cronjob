import * as z from "zod"

export const unitModel = z.object({
  id: z.number().int().nullish(),
  uuid: z.string().nullish(),
  entity_id: z.number().int(),
  business_vertical_id: z.number().int().nullish(),
  zone_id: z.number().int().nullish(),
  name: z.string(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
})
