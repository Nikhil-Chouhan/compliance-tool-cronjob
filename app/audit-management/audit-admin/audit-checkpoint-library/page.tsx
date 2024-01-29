"use client";

import React from "react";
import AgGridTableComponent from "@/components/AgGridTableComponent";

export default function AuditCheckPointLibrary() {
  const customColumns = [
    { headerName: "Serial No. ", field: "serial_no" },
    { headerName: "Check Point ID", field: "check_point_id" },
    { headerName: "Category", field: "category" },
    { headerName: "Checkpoint", field: "checkpoint" },
    { headerName: "Risk", field: "risk" },
    { headerName: "Frequency", field: "frequency" },
  ];
  const staticData = [
    {
      serial_no: 1,
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
      serial_no: 2,
      check_point_id: "Checkpoint 2",
      category: "Statutory Requirements",
      checkpoint: "Validity and date of renewal",
      risk: "Minor",
      frequency: "Yearly",
    },
    {
      serial_no: 3,
      check_point_id: "Checkpoint 3",
      category: "Statutory Requirements",
      checkpoint: "Does the drawing correctly reflect existing facilities?",
      risk: "Major",
      frequency: "Daily",
    },
    {
      serial_no: 4,
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
      <AgGridTableComponent
        title="Audit CheckPoint Library"
        slug="/audit-management/audit-admin/audit-checkpoint-library"
        page="Audit CheckPoint List"
        showbreadCrumb={true}
        previousPage="Audit Management"
        importBtn={true}
        //  actionBtn={true}
        customColumns={customColumns}
        customRows={staticData}
      />
    </>
  );
}
