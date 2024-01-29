import * as z from "zod"

export const user_function_mappingModel = z.object({
  id: z.number().int().nullish(),
  user_id: z.number().int(),
  entity_id: z.number().int(),
  business_unit_id: z.number().int(),
  function_department_id: z.number().int(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
})
