import * as z from "zod"

export const download_activityModel = z.object({
  id: z.number().int().nullish(),
  compliance_activity_id: z.number().int().nullish(),
  download_id: z.number().int().nullish(),
})
