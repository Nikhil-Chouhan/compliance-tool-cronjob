import * as z from "zod"

export const userModel = z.object({
  id: z.number().int().nullish(),
  employee_id: z.string(),
  first_name: z.string(),
  middle_name: z.string().nullish(),
  last_name: z.string(),
  email: z.string(),
  mobile_no: z.string(),
  password: z.string(),
  role_id: z.number().int().nullish(),
  status: z.number().int(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  password_changed_at: z.date().nullish(),
  designation_id: z.number().int().nullish(),
  function_department_id: z.number().int().nullish(),
  business_unit_id: z.number().int().nullish(),
  profile_picture: z.string().nullish(),
})
