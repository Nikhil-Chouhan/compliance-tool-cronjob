import * as z from "zod"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const action_logModel = z.object({
  id: z.number().int().nullish(),
  action_name: z.string(),
  model_name: z.string(),
  request_data: jsonSchema,
  status: z.number().int().nullish(),
  ip_address: z.string(),
  created_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  updated_at: z.date().nullish(),
  user_id: z.number().int().nullish(),
  record_id: z.number().int().nullish(),
})
