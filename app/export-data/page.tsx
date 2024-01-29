"use client";

import React from "react";
import BulkExportComponent from "@/components/BulkExportComponent";
import ExpandSearchComponent from "@/components/ExpandSearchComponent";

export default function ExportData() {
  const formFields = [
    {
      label: "Entity :",
      name: "entity_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Demo entity Pvt Ltd" },
        { value: 2, label: "NBFC ltd " },
        { value: 3, label: "JFW ltd" },
        { value: 4, label: "Demo Entity 2 Pvt Ltd" },
      ],
    },
    {
      label: "Unit :",
      name: "unit",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Cooporate Office - Mumbai" },
        { value: 2, label: "Registered Office - Pune" },
      ],
    },
    {
      label: "Function :",
      name: "function",
      type: "select",

      required: false,
      options: [{ value: 1, label: "Compliance" }],
    },
  ];
  const formFields_1 = [
    "Country",
    "State",
    "Law Category",
    "Legislation",
    "Rule",
    "Compliance Activity",
    "Reference",
    "Who",
    "When",
    "Procedure",
    "Description",
    "Frequency",
    "Form No",
    "Activity Type",
    "Statutory Authority",
    "Exemption Criteria",
    "Event",
    "Sub Event",
    "Implication",
    "Imprisonment Duration",
    "Imprisonment Applies To",
    "Fine Amount",
    "Activity impact",
    "Impact On Unit",
    "Impact on organization",
    "Linked Activity Id",
  ];
  const formFields_2 = [
    "Config. Frequency",
    "Entity",
    "Config. Legal Due Date",
    "Unit",
    "Unit Head Date",
    "Function",
    "Function Head Name",
    "Function Head Date",
    "Executor Name",
    "Executor Date",
    "Evaluator Name",
    "Evaluator Date",
    "Status",
  ];
  return (
    <div className="pb-4">
      <ExpandSearchComponent
        slug="/"
        page="Export Data Search"
        formFields={formFields}
      />
      <BulkExportComponent
        slug="/export-data"
        page="Export Activity"
        formfields={formFields_1}
      />
      <BulkExportComponent
        slug="/export-data"
        page="Export Configuration"
        formfields={formFields_2}
      />
    </div>
  );
}
