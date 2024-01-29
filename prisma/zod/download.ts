import * as z from "zod"
import { law_category } from "@prisma/client"

export const downloadModel = z.object({
  id: z.number().int().nullish(),
  uuid: z.string().nullish(),
  country_id: z.number().int().nullish(),
  state_id: z.number().int().nullish(),
  law_category: z.nativeEnum(law_category),
  legislation_id: z.number().int().nullish(),
  rule_id: z.number().int().nullish(),
  reason: z.string().nullish(),
  approval_status: z.number().int().nullish(),
  approvet_at: z.date().nullish(),
  approved_by: z.number().int().nullish(),
  status: z.number().int().nullish(),
  user_id: z.number().int().nullish(),
  created_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  updated_at: z.date().nullish(),
})
