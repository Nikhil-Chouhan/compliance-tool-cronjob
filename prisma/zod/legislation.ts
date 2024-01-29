import * as z from "zod"
import { law_category, applies } from "@prisma/client"

export const legislationModel = z.object({
  id: z.number().int().nullish(),
  uuid: z.string().nullish(),
  country_id: z.number().int(),
  is_federal: z.boolean(),
  state_id: z.number().int().nullish(),
  law_category: z.nativeEnum(law_category),
  code: z.string().nullish(),
  name: z.string(),
  sources: z.string().nullish(),
  effective_date: z.date().nullish(),
  updated_date: z.date().nullish(),
  documents: z.string().nullish(),
  industry_id: z.number().int().nullish(),
  applies_to: z.nativeEnum(applies),
  status: z.number().int().nullish(),
  created_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  updated_at: z.date().nullish(),
})
