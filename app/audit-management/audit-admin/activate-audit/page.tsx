"use client";

import React from "react";
import ExpandSearchComponent from "@/components/ExpandSearchComponent";

export default function ActivateAudit() {
  const getCurrentYear = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2015; year--) {
      years.push(year);
    }
    return years;
  };

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
      name: "unit_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Cooporate Office - Mumbai" },
        { value: 2, label: "Registered Office - Pune" },
      ],
    },
    {
      label: "Department :",
      name: "department_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Secretrial" },
        { value: 2, label: "Management" },
        { value: 3, label: "Human Resources" },
        { value: 4, label: "Information Technology" },
      ],
    },
    {
      label: "Year",
      name: "from_year",
      type: "select",
      required: false,
      options: getCurrentYear().map((year) => ({
        label: year.toString(),
        value: year,
      })),
    },
    {
      label: "Month",
      name: "month_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "January" },
        { value: 2, label: "February " },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 4, label: "May" },
        { value: 4, label: "June" },
        { value: 4, label: "July" },
        { value: 4, label: "August" },
        { value: 4, label: "September" },
        { value: 4, label: "October" },
        { value: 4, label: "November" },
        { value: 4, label: "December" },
      ],
    },
    {
      label: "Audit Completion Date :",
      name: "audit_completion_date",
      type: "date",
    },
    {
      label: " \n Final Document Submission Date:",
      name: "final_document_submission_date",
      type: "date",
    },
    {
      label: "Last Document Submission Date for Department Head :",
      name: "last_document_submission_date_for_department_head",
      type: "date",
    },
    {
      label: "Last Document Submission Date for Executor/Auditee :",
      name: "last_document_submission_date_for_executor",
      type: "date",
    },
  ];
  return (
    <>
      <ExpandSearchComponent
        title="Activate Audit"
        slug="/audit-management/audit-admin"
        page="Audits"
        previousPage="Audit Admin"
        showbreadCrumb={true}
        buttonName="Activate"
        filterState={true}
        formFields={formFields}
      />
    </>
  );
}
