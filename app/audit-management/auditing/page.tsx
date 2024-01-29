"use client";

import AgGridTableComponent from "@/components/AgGridTableComponent";
import ExpandSearchComponent from "@/components/ExpandSearchComponent";
import ModalForm from "@/components/ModalFormComponent";
import React, { useState } from "react";

export default function Auditing() {
  const getCurrentYear = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2000; year--) {
      years.push(year);
    }
    return years;
  };
 
  const formFields_1 = [
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
  ];

  const formFields_2 = [
    {
      label: "Date",
      name: "date",
      type: "date",
      required: false,
    },
    {
      label: "Status",
      name: "status",
      type: "select",
      required: false,
      options: [
        { value: "Complied", label: "Complied" },
        { value: "Non Complied", label: "Non Complied " },
      ],
    },
    {
      label: "Due Date",
      name: "due_date",
      type: "date",
      required: false,
      hidden: true,
    },
    {
      label: "Auditors Remarks",
      name: "auditor_remark",
      type: "text",
      required: false,
    },
  ];

  const customColumns = [
    { headerName: "Check Point ID", field: "check_point_id" },
    { headerName: "Category", field: "category" },
    { headerName: "Checkpoint", field: "checkpoint" },
    { headerName: "Risk", field: "risk" },
    { headerName: "Frequency", field: "frequency" },
    { headerName: "Completed By", field: "completed_by" },
    { headerName: "Completed On", field: "completed_on" },
    { headerName: "Documents", field: "documents", islink: true  },
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
      completed_by: "Nikhil",
      completed_on: "20/11/2023",
      documents: "Link to see all submitted documents",
    },
    {
      check_point_id: "Checkpoint 3",
      category: "Statutory Requirements",
      checkpoint: "Does the drawing correctly reflect existing facilities?",
      risk: "Major",
      frequency: "Daily",
      completed_by: "Sandeep",
      completed_on: "20/11/2023",
      documents: "Link to see all submitted documents",
    },
    {
      check_point_id: "Checkpoint 4",
      category: "Statutory Requirements",
      checkpoint:
        "Are safety message like Telephone. No, Police, Fire brigade, Hospital, Ambulance, Local civic authorities (DM/SDM), Nearby ROs, Local Electircal Board and no smoking, T/L under decantation and explosive licence No. displayed?",
      risk: "Major",
      frequency: "One Time",
      completed_by: "Pratham",
      completed_on: "20/11/2023",
      documents: "Link to see all submitted documents",
    },
  ];

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <ExpandSearchComponent page="Filter" formFields={formFields_1} />
      <AgGridTableComponent
        slug="/auditing"
        page="List of Completed Checkpoints"
        checkBox={true}
        customColumns={customColumns}
        customRows={staticData}
        customBtn="Remark"
        onButtonClick={openModal}
      />
      <ModalForm
        slug="/auditing"
        page="Audit Remarks"
        type="Submit"
        show={showModal}
        onHide={closeModal}
        formFields={formFields_2}
      />
    </>
  );
}
