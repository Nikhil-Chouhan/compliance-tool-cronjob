import * as z from "zod"

export const standard_commentsModel = z.object({
  id: z.number().int().nullish(),
  name: z.string(),
  status: z.number().int().nullish(),
  created_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  updated_at: z.date().nullish(),
})
