import * as z from "zod"

export const business_verticalModel = z.object({
  id: z.number().int().nullish(),
  name: z.string(),
  status: z.number().int().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  entity_id: z.number().int().nullish(),
  organization_id: z.number().int().nullish(),
})
