import * as z from "zod"

export const roleModel = z.object({
  id: z.number().int().nullish(),
  name: z.string(),
  description: z.string().nullish(),
  status: z.number().int().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
})
