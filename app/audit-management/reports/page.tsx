"use client";

import React from "react";
import ExpandSearchComponent from "@/components/ExpandSearchComponent";

export default function Report() {
  const formFields = [
    {
      label: "From Date",
      name: "from_date",
      type: "date",
      required: false,
    },
    {
      label: "To Date",
      name: "to_date",
      type: "date",
      required: false,
    },
    {
      label: "Entity",
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
      label: "Unit",
      name: "unit",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Cooporate Office - Mumbai" },
        { value: 2, label: "Registered Office - Pune" },
      ],
    },
    {
      label: "Function",
      name: "function_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Administration" },
        { value: 2, label: "Secretrial" },
        { value: 3, label: "Human Resources" },
        { value: 4, label: "Information Technology" },
      ],
    },
    {
      label: "Complied/Non-Complied",
      name: "complied_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Complied" },
        { value: 2, label: "Non Complied" },
        { value: 3, label: "Delayed" },
        { value: 4, label: "N/A" },
      ],
    },
    {
      label: "Impact",
      name: "impact_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Severe" },
        { value: 2, label: "Major" },
        { value: 3, label: "Moderate" },
        { value: 4, label: "Low" },
      ],
    },
    {
      label: "Check Point Category",
      name: "check_point_category",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Statuary Requirements" },
        { value: 2, label: "Non Statuary Requirements" },
      ],
    },
    {
      label: "Completed By",
      name: "completed_by",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Pratham" },
        { value: 2, label: "Nikhil" },
        { value: 2, label: "Rohan" },
        { value: 2, label: "Sandeep" },
      ],
    },
  ];
  return (
    <>
      <ExpandSearchComponent
        slug="/compliance-report"
        filterState={true}
        page="Filter Audit Reports"
        buttonName="Generate Report"
        formFields={formFields}
      />
    </>
  );
}