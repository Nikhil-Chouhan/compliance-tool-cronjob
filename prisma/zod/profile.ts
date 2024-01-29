import * as z from "zod"

export const profileModel = z.object({
  id: z.number().int().nullish(),
  user_id: z.number().int().nullish(),
  theme: z.string().nullish(),
  timezone: z.string().nullish(),
  photo_path: z.string().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  uuid: z.string().nullish(),
})
