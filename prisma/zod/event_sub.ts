import * as z from "zod"

export const event_subModel = z.object({
  id: z.number().int().nullish(),
  event_id: z.number().int(),
  code: z.string().nullish(),
  name: z.string(),
  status: z.number().int().nullish(),
  uuid: z.string().nullish(),
  created_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  updated_at: z.date().nullish(),
})
