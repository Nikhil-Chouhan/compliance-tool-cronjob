import * as z from "zod"
import { legal_status } from "@prisma/client"

export const activity_historyModel = z.object({
  id: z.number().int().nullish(),
  executor_id: z.number().int(),
  evaluator_id: z.number().int(),
  function_head_id: z.number().int(),
  legal_due_date: z.date(),
  unit_head_due_date: z.date(),
  function_head_due_date: z.date(),
  evaluator_due_date: z.date(),
  executor_due_date: z.date(),
  completed_by: z.number().int().nullish(),
  completion_date: z.date().nullish(),
  comments: z.string().nullish(),
  non_compliance_reason: z.string().nullish(),
  reason_for_reopen: z.string().nullish(),
  document: z.string().array(),
  activity_history_status: z.nativeEnum(legal_status).nullish(),
  created_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  deleted_at: z.date().nullish(),
  status: z.number().int(),
  updated_at: z.date().nullish(),
  activity_configuration_id: z.number().int(),
  activity_mapping_id: z.number().int(),
})
