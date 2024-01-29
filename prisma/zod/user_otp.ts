import * as z from "zod"

export const user_otpModel = z.object({
  id: z.number().int().nullish(),
  user_id: z.number().int(),
  otp: z.string(),
})
