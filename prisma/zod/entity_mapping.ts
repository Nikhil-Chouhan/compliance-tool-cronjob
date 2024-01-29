import * as z from "zod"

export const entity_mappingModel = z.object({
  id: z.number().int().nullish(),
  uuid: z.string().nullish(),
  entity_id: z.number().int(),
  business_vertical_id: z.number().int().nullish(),
  zone_id: z.number().int().nullish(),
  unit_id: z.number().int(),
  function_id: z.number().int(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
})
