import * as z from "zod"

export const activity_mappingModel = z.object({
  id: z.number().int().nullish(),
  unit_activity_id: z.string(),
  function_id: z.number().int(),
  executor_id: z.number().int(),
  evaluator_id: z.number().int(),
  function_head_id: z.number().int(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  business_unit_id: z.number().int(),
  crs_activity_id: z.number().int(),
})
