"use client";

import AgGridTableComponent from "@/components/AgGridTableComponent";
import ExpandSearchComponent from "@/components/ExpandSearchComponent";
import ModalForm from "@/components/ModalFormComponent";
import React, { useState } from "react";

export default function CheckPointCompletion() {
  const getCurrentYear = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2000; year--) {
      years.push(year);
    }
    return years;
  };

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const formFields = [
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
      label: "Completion Date",
      name: "completion_date",
      type: "date",
      required: false,
    },
    {
      label: "Comments: ",
      name: "comments",
      type: "text",
      required: false,
    },
    {
      label: "Document",
      name: "document",
      type: "file",
      required: false,
    },
  ];

  const customColumns = [
    { headerName: "Check Point ID", field: "check_point_id" },
    { headerName: "Category", field: "category" },
    { headerName: "Checkpoint", field: "checkpoint" },
    { headerName: "Risk", field: "risk" },
    { headerName: "Frequency", field: "frequency" },
    {
      headerName: "Final Document Submission Date",
      field: "document_submssion_date",
    },
  ];

  const customRows = [
    {
      check_point_id: "Checkpoint 1",
      category: "Statutory Requirements",
      checkpoint: "Is CCOE License and Drawing at the site available?",
      risk: "Major",
      frequency: "Monthly",
      document_submssion_date: "20/11/2023",
    },
    {
      check_point_id: "Checkpoint 2",
      category: "Non Statutory Requirements",
      checkpoint: "Validity and date of renewal",
      risk: "Major",
      frequency: "Monthly",
      document_submssion_date: "20/11/2023",
    },
    {
      check_point_id: "Checkpoint 3",
      category: "Statutory Requirements",
      checkpoint: "Does the drawing correctly reflect existing facilities?",
      risk: "Major",
      frequency: "Monthly",
      document_submssion_date: "20/11/2023",
    },
    {
      check_point_id: "Checkpoint 4",
      category: "Non Statutory Requirements",
      checkpoint:
        "Are safety message like Telephone. No, Police, Fire brigade, Hospital, Ambulance, Local civic authorities (DM/SDM), Nearby ROs",
      risk: "Major",
      frequency: "Monthly",
      document_submssion_date: "20/11/2023",
    },
    {
      check_point_id: "Checkpoint 5",
      category: "Statutory Requirements",
      checkpoint: "data here",
      risk: "Major",
      frequency: "Monthly",
      document_submssion_date: "20/11/2023",
    },
  ];

  return (
    <>
      <ExpandSearchComponent page="Filter" formFields={formFields} />
      <AgGridTableComponent
        slug="/checkpoint-completion"
        page="CheckPoint List"
        edit="Complete"
        customColumns={customColumns}
        customRows={customRows}
        onButtonClick={openModal}
      />
      <ModalForm
        slug="/auditing"
        page="Complete Checkpoint:"
        type="Submit"
        show={showModal}
        onHide={closeModal}
        formFields={formFields_2}
      />
    </>
  );
}
