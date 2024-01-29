import * as z from "zod"

export const countryModel = z.object({
  id: z.number().int().nullish(),
  name: z.string(),
  short_name: z.string(),
  country_code: z.string().nullish(),
  timezone: z.string().nullish(),
  uts_offset: z.string().nullish(),
  status: z.number().int().nullish(),
  created_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  updated_at: z.date().nullish(),
})
