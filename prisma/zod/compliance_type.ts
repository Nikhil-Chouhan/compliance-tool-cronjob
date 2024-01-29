import * as z from "zod"

export const compliance_typeModel = z.object({
  id: z.number().int().nullish(),
  code: z.string().nullish(),
  name: z.string(),
  status: z.number().int().nullish(),
  uuid: z.string().nullish(),
  created_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  updated_at: z.date().nullish(),
})
