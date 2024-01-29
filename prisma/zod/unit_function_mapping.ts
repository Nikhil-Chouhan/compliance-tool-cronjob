import * as z from "zod"

export const unit_function_mappingModel = z.object({
  id: z.number().int().nullish(),
  business_unit_id: z.number().int(),
  function_department_id: z.number().int(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  zoneId: z.number().int().nullish(),
})
