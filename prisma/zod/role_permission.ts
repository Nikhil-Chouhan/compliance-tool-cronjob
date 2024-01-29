import * as z from "zod"

export const role_permissionModel = z.object({
  id: z.number().int().nullish(),
  role_id: z.number().int().nullish(),
  permission_id: z.number().int().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
})
