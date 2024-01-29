"use client";

import React from "react";
import AgGridTableComponent from "@/components/AgGridTableComponent";
import ExpandSearchComponent from "@/components/ExpandSearchComponent";

export default function AssignAuditCheckPoint() {
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
        { value: 4, label: "XYZ Private ltd" },
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
      label: "Department : ",
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
      label: "Department Head: ",
      name: "department_head_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Administration" },
        { value: 2, label: "Secretrial Head" },
      ],
    },
    {
      label: "Evaluator :",
      name: "evaluator_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Evaluator Person 1" },
        { value: 2, label: "Evaluator Person 2" },
        { value: 3, label: "Evaluator Person 3" },
        { value: 4, label: "Evaluator Person 4" },
        { value: 5, label: "Evaluator Person 5" },
      ],
    },
    {
      label: "Executor / Auditee :",
      name: "executor_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Executor Person 1" },
        { value: 2, label: "Executor Person 2" },
        { value: 3, label: "Executor Person 3" },
        { value: 4, label: "Executor Person 4" },
        { value: 5, label: "Executor Person 5" },
      ],
    },
  ];

  const customColumns = [
    { headerName: "Check Point ID", field: "check_point_id" },
    { headerName: "Category", field: "category" },
    { headerName: "Checkpoint", field: "checkpoint" },
    { headerName: "Risk", field: "risk" },
    { headerName: "Frequency", field: "frequency" },
  ];
  const staticData = [
    {
      check_point_id: "Checkpoint 1",
      category: "Statutory Requirements",
      checkpoint: "Is CCOE License and Drawing at the site available?",
      risk: "Major",
      frequency: "Monthly",
      completed_by: "Rohan",
      completed_on: "20/11/2023",
      documents: "Link to see all submitted documents",
    },
    {
      check_point_id: "Checkpoint 2",
      category: "Statutory Requirements",
      checkpoint: "Validity and date of renewal",
      risk: "Minor",
      frequency: "Yearly",
    },
    {
      check_point_id: "Checkpoint 3",
      category: "Statutory Requirements",
      checkpoint: "Does the drawing correctly reflect existing facilities?",
      risk: "Major",
      frequency: "Daily",
    },
    {
      check_point_id: "Checkpoint 4",
      category: "Statutory Requirements",
      checkpoint:
        "Are safety message like Telephone. No, Police, Fire brigade, Hospital, Ambulance, Local civic authorities (DM/SDM), Nearby ROs, Local Electircal Board and no smoking, T/L under decantation and explosive licence No. displayed?",
      risk: "Major",
      frequency: "One Time",
    },
  ];
  return (
    <>
      <ExpandSearchComponent
        title="Assign Audit CheckPoint"
        previousPage="Audit Admin"
        slug="/audit-management/audit-admin"
        page="Orgonogram"
        buttonName="Assign"
        showbreadCrumb={true}
        formFields={formFields}
      />
      <AgGridTableComponent
        slug="/audit-management/audit-admin/assign-audit-checkpoint"
        page="Audit CheckPoint List"
        checkBox={true}
        // actionBtn={true}
        customColumns={customColumns}
        customRows={staticData}
      />
    </>
  );
}
