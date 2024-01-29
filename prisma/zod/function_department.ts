import * as z from "zod"

export const function_departmentModel = z.object({
  id: z.number().int().nullish(),
  name: z.string(),
  created_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  updated_at: z.date().nullish(),
})
