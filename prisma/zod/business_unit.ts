import * as z from "zod"

export const business_unitModel = z.object({
  id: z.number().int().nullish(),
  organization_id: z.number().int().nullish(),
  entity_id: z.number().int().nullish(),
  business_vertical_id: z.number().int().nullish(),
  zone_id: z.number().int().nullish(),
  name: z.string(),
  address1: z.string(),
  address2: z.string().nullish(),
  country: z.string().nullish(),
  state: z.string().nullish(),
  city: z.string().nullish(),
  zipcode: z.string(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  unit_code: z.string().nullish(),
  unit_type_id: z.number().int(),
})
