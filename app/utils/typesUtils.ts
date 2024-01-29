export type patchType = {
  id: number;
  type: string;
  status: number;
};
export interface activityImportType {
  law_category: string;
  country: string;
  state: string;
  legislation: string;
  rule: string;
  id: number;
  code: string;
  title: string;
  activity: string;
  reference: string;
  who: string;
  when: string;
  procedure: string;
  description: string;
  frequency: string;
  form_no: string;
  compliance_type: string;
  authority: string;
  exemption_criteria: string;
  event_id: number;
  event: string;
  event_sub_id: number;
  event_sub: string;
  event_question_id: number;
  event_question: string;
  implications: string;
  imprison_duration: string | number;
  imprison_applies_to: string;
  fine: string | number;
  fine_per_day: string;
  impact: string;
  impact_on_unit: string;
  impact_on_organization: string;
  linked_activity_ids: number;
  reference_link: string;
  sources: string;
  documents: string;
  [key: string | number]: string | number; // Index signature to allow string indexing
}

export interface ruleImportType {
  legislation_id: number;
  rule: string;
  legislation: string;
  name: string;
  sources: string;
  effective_date: string;
  updated_date: string;
  status: number;
  applicability: string;
  documents: string;
  [key: string | number]: string | number;
}

export interface legislationImportType {
  law_category: string;
  industry: string;
  country: string;
  state: string;
  country_id: number;
  state_id: number;
  industry_id: number;
  is_federal: string;
  name: string;
  sources: string;
  effective_date: string;
  updated_date: string;
  applies_to: string;
  status: number;
  documents: string;
  [key: string | number]: string | number;
}

export interface countryImportType {
  name: string;
  short_name: string;
  country_code: string;
  timezone: string;
  uts_offset: string;
  status: number;
  [key: string | number]: string | number;
}

export interface stateImportType {
  code: string;
  name: string;
  country: string;
  status: number;
  [key: string | number]: string | number;
}


