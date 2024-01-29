import * as z from "zod"

export const zoneModel = z.object({
  id: z.number().int().nullish(),
  name: z.string(),
  status: z.number().int().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  business_vertical_id: z.number().int().nullish(),
  entity_id: z.number().int().nullish(),
  organization_id: z.number().int().nullish(),
})
