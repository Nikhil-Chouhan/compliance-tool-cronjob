import * as z from "zod"

export const auditModel = z.object({
  id: z.number().int().nullish(),
  reference_id: z.number().int(),
  reference_type: z.string(),
  created_by_id: z.number().int(),
  updated_by_id: z.number().int(),
  deleted_by_id: z.number().int(),
})
