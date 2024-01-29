"use client";

import React, { useState } from "react";
import ExpandSearchComponent from "@/components/ExpandSearchComponent";
import { frequency, impact, law_category } from "../utils/modelUtils";
import AgGridTableComponent from "@/components/AgGridTableComponent";
import CalenderPopup from "@/components/CalenderPopup";

export default function ComplianceRepository() {
  const customColumns = [
    {
      headerName: "Unit Activity ID",
      field: "unit_activity_id",
      islink: true,
    },
    {
      headerName: "Entity",
      field: "entity_name",
    },
    {
      headerName: "Unit",
      field: "business_unit_name",
    },
    {
      headerName: "Function",
      field: "function_name",
    },
    {
      headerName: "Legislation",
      field: "legislation",
    },
    {
      headerName: "Rule",
      field: "rule",
    },
    {
      headerName: "Reference",
      field: "reference",
    },
    {
      headerName: "Who",
      field: "who",
    },
    {
      headerName: "When",
      field: "when",
    },
    {
      headerName: "Activity",
      field: "activity",
    },
    {
      headerName: "Procedure",
      field: "procedure",
    },
    {
      headerName: "Compliance Type",
      field: "compliance_type",
    },
    {
      headerName: "Impact",
      field: "impact",
    },
    {
      headerName: "Frequency",
      field: "frequency",
    },
    {
      headerName: "Events",
      field: "event",
    },
    {
      headerName: "Sub Events",
      field: "event_sub",
    },
    {
      headerName: "Legal Due Date",
      field: "legal_due_date",
    },
    {
      headerName: "Performer Due Date",
      field: "executor_due_date",
    },
    {
      headerName: "Performer",
      field: "executor_name",
    },
    {
      headerName: "Reviewer",
      field: "evaluator_name",
    },
    {
      headerName: "Function Head",
      field: "function_head_name",
    },
    {
      headerName: "Status",
      field: "status",
    },
  ];

  // const formFields1 = [
  //   {
  //     label: "Entity :",
  //     name: "entity_id",
  //     type: "select",

  //     required: false,
  //     options: [
  //       { value: 1, label: "Demo entity Pvt Ltd" },
  //       { value: 2, label: "NBFC ltd " },
  //       { value: 3, label: "JFW ltd" },
  //       { value: 4, label: "Demo Entity 2 Pvt Ltd" },
  //       { value: 4, label: "XYZ Private ltd" },
  //     ],
  //   },
  //   {
  //     label: "Unit :",
  //     name: "unit",
  //     type: "select",

  //     required: false,
  //     options: [
  //       { value: 1, label: "Cooporate Office - Mumbai" },
  //       { value: 2, label: "Registered Office - Pune" },
  //     ],
  //   },
  //   {
  //     label: "Function : ",
  //     name: "function_id",
  //     type: "select",

  //     required: false,
  //     options: [
  //       { value: 1, label: "Administration" },
  //       { value: 2, label: "Secretrial" },
  //       { value: 3, label: "Human Resources" },
  //       { value: 4, label: "Information Technology" },
  //     ],
  //   },
  // ];
  // const advancedFormFields = [
  //   {
  //     label: "Executor ",
  //     name: "executor_id",
  //     type: "select",

  //     required: false,
  //     options: [{ value: 1, label: "Executor" }],
  //   },
  //   {
  //     label: "Evaluator  ",
  //     name: "evaluator _id",
  //     type: "select",

  //     required: false,
  //     options: [{ value: 1, label: "Evaluator " }],
  //   },
  //   {
  //     label: "Category of Law ",
  //     name: "category_of_law",
  //     type: "select",

  //     required: false,
  //     options: Object.keys(law_category).map((key) => ({
  //       value: key,
  //       label: law_category[key],
  //     })),
  //   },
  //   {
  //     label: "Impact ",
  //     name: "impact_id",
  //     type: "select",

  //     required: false,
  //     options: Object.keys(impact).map((key) => ({
  //       value: key,
  //       label: impact[key],
  //     })),
  //   },
  //   {
  //     label: "Prohibitive / Prescriptive ",
  //     name: "executor_id",
  //     type: "select",

  //     required: false,
  //     options: [
  //       { value: 1, label: "Prohibitive" },
  //       { value: 2, label: "Prescriptive" },
  //     ],
  //   },
  //   {
  //     label: "Type of Activity ",
  //     name: "executor_id",
  //     type: "select",

  //     required: false,
  //     options: [
  //       { value: 1, label: "Amendment" },
  //       { value: 2, label: "Appointment" },
  //       { value: 3, label: "Disclosure" },
  //       { value: 4, label: "Meeting" },
  //     ],
  //   },
  //   {
  //     label: "Frequency  ",
  //     name: "executor_id",
  //     type: "select",

  //     required: false,
  //     options: Object.keys(frequency).map((key) => ({
  //       value: key,
  //       label: frequency[key],
  //     })),
  //   },
  //   {
  //     label: "Active/Inactive ",
  //     name: "executor_id",
  //     type: "select",

  //     required: false,
  //     options: [
  //       { value: 1, label: "Active" },
  //       { value: 2, label: "Inactive" },
  //     ],
  //   },
  //   {
  //     label: "Legislation ",
  //     name: "executor_id",
  //     type: "select",

  //     required: false,
  //     options: [
  //       { value: 1, label: "Legislation option 1" },
  //       { value: 2, label: "Legislation option 2" },
  //     ],
  //   },
  //   {
  //     label: "Rule  ",
  //     name: "executor_id",
  //     type: "select",

  //     required: false,
  //     options: [
  //       { value: 1, label: "Rule option 1" },
  //       { value: 2, label: "Rule option 2" },
  //     ],
  //   },
  //   {
  //     label: "Events   ",
  //     name: "executor_id",
  //     type: "select",

  //     required: false,
  //     options: [{ value: 1, label: "Events " }],
  //   },
  //   {
  //     label: "Sub Events   ",
  //     name: "executor_id",
  //     type: "select",

  //     required: false,
  //     options: [{ value: 1, label: "Sub Events " }],
  //   },
  // ];

  // const formFields2 = [
  //   {
  //     label: "Activity Id ",
  //     name: "activity_id",
  //     type: "text",
  //     required: false,
  //   },
  // ];

  // const staticData = [
  //   {
  //     client_activity_id: 1,
  //     legislation:
  //       "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013",
  //     rule: "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Rules, 2013",
  //     reference: "Section 19(b)",
  //     who: "Employer of a workplace",
  //     when: "On applicability of the Act",
  //     activity:
  //       "Display penal consequences of sexual harassment and the composition of the Internal Committee (IC) at a conspicuous place at the workplace",
  //     procedure: "NA",
  //     impact: "Moderate",
  //     frequency: "Monthly",
  //     legal_due_date: "26-11-2023",
  //     executor_date: "18-11-2023",
  //   },
  //   {
  //     client_activity_id: 2,
  //     legislation: "The Minimum Wages Act, 1948",
  //     rule: "The Minimum Wages (Tamil Nadu) Rules, 1953",
  //     reference: "Section 12",
  //     who: "Employer ",
  //     when: "On employing an employee in any scheduled employment",
  //     activity:
  //       "Pay minimum rates of wages at a rate not less than the minimum rates of wages fixed of any scheduled employment	",
  //     procedure: "NA",
  //     impact: "Major",
  //     frequency: "Ongoing",
  //     legal_due_date: "26-11-2023",
  //     executor_date: "18-11-2023",
  //   },
  //   {
  //     client_activity_id: 3,
  //     legislation:
  //       "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013",
  //     rule: "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Rules, 2013",
  //     reference: "Section 19(b)",
  //     who: "Employer of a workplace",
  //     when: "On applicability of the Act",
  //     activity:
  //       "Display penal consequences of sexual harassment and the composition of the Internal Committee (IC) at a conspicuous place at the workplace",
  //     procedure: "NA",
  //     impact: "Moderate",
  //     frequency: "Monthly",
  //     legal_due_date: "26-11-2023",
  //     executor_date: "18-11-2023",
  //   },
  //   {
  //     client_activity_id: 4,
  //     legislation:
  //       "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013",
  //     rule: "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Rules, 2013",
  //     reference: "Section 19(b)",
  //     who: "Employer of a workplace",
  //     when: "On applicability of the Act",
  //     activity:
  //       "Display penal consequences of sexual harassment and the composition of the Internal Committee (IC) at a conspicuous place at the workplace",
  //     procedure: "NA",
  //     impact: "Moderate",
  //     frequency: "Monthly",
  //     legal_due_date: "26-11-2023",
  //     executor_date: "18-11-2023",
  //   },
  //   {
  //     client_activity_id: 6,
  //     legislation: "The Minimum Wages Act, 1948",
  //     rule: "The Minimum Wages (Tamil Nadu) Rules, 1953",
  //     reference: "Section 12",
  //     who: "Employer ",
  //     when: "On employing an employee in any scheduled employment",
  //     activity:
  //       "Pay minimum rates of wages at a rate not less than the minimum rates of wages fixed of any scheduled employment	",
  //     procedure: "NA",
  //     impact: "Major",
  //     frequency: "Ongoing",
  //     legal_due_date: "26-11-2023",
  //     executor_date: "18-11-2023",
  //   },
  //   {
  //     client_activity_id: 7,
  //     legislation: "The Minimum Wages Act, 1948",
  //     rule: "The Minimum Wages (Tamil Nadu) Rules, 1953",
  //     reference: "Section 12",
  //     who: "Employer ",
  //     when: "On employing an employee in any scheduled employment",
  //     activity:
  //       "Pay minimum rates of wages at a rate not less than the minimum rates of wages fixed of any scheduled employment	",
  //     procedure: "NA",
  //     impact: "Major",
  //     frequency: "Ongoing",
  //     legal_due_date: "26-11-2023",
  //     executor_date: "18-11-2023",
  //   },
  // ];

  const [showModal, setShowModal] = useState(false);
  const [selectedID, setSelectedID] = useState(null);

  const openModal = (event) => {
    setSelectedID(event.data.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedID(null);
  };

  return (
    <div className="pb-4">
      {/* <ExpandSearchComponent
        slug="/"
        page="Filter"
        formFields={formFields1}
        advancedFormFields={advancedFormFields}
      />
      <ExpandSearchComponent
        page="Filter By Client Activity Id"
        formFields={formFields2}
      /> */}
      <AgGridTableComponent
        slug="/repository"
        page="Repository"
        api="/api/repository"
        filter="?page=&pageSize=-1"
        listname="repositoryFLatList"
        exportBtn={false}
        customColumns={customColumns}
        onItemClick={openModal}
      />
      <CalenderPopup
        filter="?page=&pageSize=-1&filterName="
        api={`/api/repository/${selectedID}`}
        selectedId={selectedID}
        show={showModal}
        onHide={closeModal}
      />
    </div>
  );
}
