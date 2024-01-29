import * as z from "zod"

export const activity_configurationModel = z.object({
  id: z.number().int().nullish(),
  due_date_buffer: z.number().int().nullish(),
  legal_due_date: z.date(),
  unit_head_due_date: z.date(),
  function_head_due_date: z.date(),
  evaluator_due_date: z.date(),
  executor_due_date: z.date(),
  back_dates: z.number().int().nullish(),
  first_alert: z.date().nullish(),
  second_alert: z.date().nullish(),
  third_alert: z.date().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  deleted: z.boolean().nullish(),
  alert_prior_days: z.number().int().nullish(),
  historical: z.number().int().nullish(),
  status: z.number().int().nullish(),
  impact_on_entity: z.string().nullish(),
  impact_on_unit: z.string().nullish(),
  impact: z.string().nullish(),
  frequency: z.string().nullish(),
  activity_maker_checker: z.number().int(),
  proof_required: z.number().int().nullish(),
  activity_mapping_id: z.number().int(),
})
