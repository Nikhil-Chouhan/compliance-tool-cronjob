"use client";

import React from "react";
import ExpandSearchComponent from "@/components/ExpandSearchComponent";
import AgGridTableComponent from "@/components/AgGridTableComponent";

export default function NoticeManagement() {
  const customColumns = [
    { headerName: "Sr No", field: "sr_no" },
    { headerName: "Entity", field: "entity" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Function", field: "function" },
    { headerName: "Show Causes Related To", field: "show_causes" },
    { headerName: "Notice Date", field: "notice_date" },
    { headerName: "Recieved Date", field: "recieved_date" },
    { headerName: "Deadline Date", field: "deadline" },
    { headerName: "Action Taken", field: "action_taken" },
    { headerName: "Responsible Person", field: "responsible_person" },
    { headerName: "Reporting Person", field: "reporitng_person" },
    { headerName: "Remainder Date", field: "remainder_date" },
    { headerName: "Status", field: "status" },
  ];
  const staticData = [
    {
      sr_no: 1,
      entity: "ABC Mining Pvt Ltd",
      unit: "Mining Unit",
      function: "Regulatory  Laws Data",
      show_causes: "Finance	",
      notice_date: "30-12-2021",
      recieved_date: "01-01-2022",
      deadline: "10-02-20223",
      action_taken: "No",
      responsible_person: "Executor Regucheck",
      reporitng_person: "Evaluator Regucheck",
      remainder_date: "12-11-2023",
      status: "Open",
    },
    {
      sr_no: 2,
      entity: "Demo Entity Pvt Ltd",
      unit: "Corporate Office - Mumbai",
      function: "Human Resources",
      show_causes: "Certification",
      notice_date: "01-03-2023",
      recieved_date: "12-07-2023",
      deadline: "12-12-2023",
      action_taken: "Yes",
      responsible_person: "	Function head",
      reporitng_person: "CMT USER",
      remainder_date: "12-11-2023",
      status: "Closed",
    },
    {
      sr_no: 3,
      entity: "NBFC India Ltd",
      unit: "Grupo_Pune",
      function: "Secretarial",
      show_causes: "Board of Meeting",
      notice_date: "01-07-2023",
      recieved_date: "12-07-2023",
      deadline: "12-12-2023",
      action_taken: "No",
      responsible_person: "Regucheck user	",
      reporitng_person: "TANMAY JOSHI",
      remainder_date: "12-11-2023",
      status: "Reply Sent",
    },
    {
      sr_no: 4,
      entity: "ABC Mining Pvt Ltd",
      unit: "Mining Unit",
      function: "Regulatory  Laws Data",
      show_causes: "Finance	",
      notice_date: "30-12-2021",
      recieved_date: "01-01-2022",
      deadline: "10-02-20223",
      action_taken: "No",
      responsible_person: "Executor Regucheck",
      reporitng_person: "Evaluator Regucheck",
      remainder_date: "12-11-2023",
      status: "Open",
    },
    {
      sr_no: 5,
      entity: "Demo Entity Pvt Ltd",
      unit: "Corporate Office - Mumbai",
      function: "Human Resources",
      show_causes: "Certification",
      notice_date: "01-03-2023",
      recieved_date: "12-07-2023",
      deadline: "12-12-2023",
      action_taken: "Yes",
      responsible_person: "	Function head",
      reporitng_person: "CMT USER",
      remainder_date: "12-11-2023",
      status: "Closed",
    },
    {
      sr_no: 6,
      entity: "NBFC India Ltd",
      unit: "Grupo_Pune",
      function: "Secretarial",
      show_causes: "Board of Meeting",
      notice_date: "01-07-2023",
      recieved_date: "12-07-2023",
      deadline: "12-12-2023",
      action_taken: "No",
      responsible_person: "Regucheck user	",
      reporitng_person: "TANMAY JOSHI",
      remainder_date: "12-11-2023",
      status: "Reply Sent",
    },
    {
      sr_no: 7,
      entity: "ABC Mining Pvt Ltd",
      unit: "Mining Unit",
      function: "Regulatory  Laws Data",
      show_causes: "Finance	",
      notice_date: "30-12-2021",
      recieved_date: "01-01-2022",
      deadline: "10-02-20223",
      action_taken: "No",
      responsible_person: "Executor Regucheck",
      reporitng_person: "Evaluator Regucheck",
      remainder_date: "12-11-2023",
      status: "Open",
    },
    {
      sr_no: 8,
      entity: "Demo Entity Pvt Ltd",
      unit: "Corporate Office - Mumbai",
      function: "Human Resources",
      show_causes: "Certification",
      notice_date: "01-03-2023",
      recieved_date: "12-07-2023",
      deadline: "12-12-2023",
      action_taken: "Yes",
      responsible_person: "	Function head",
      reporitng_person: "CMT USER",
      remainder_date: "12-11-2023",
      status: "Closed",
    },
    {
      sr_no: 9,
      entity: "NBFC India Ltd",
      unit: "Grupo_Pune",
      function: "Secretarial",
      show_causes: "Board of Meeting",
      notice_date: "01-07-2023",
      recieved_date: "12-07-2023",
      deadline: "12-12-2023",
      action_taken: "No",
      responsible_person: "Regucheck user	",
      reporitng_person: "TANMAY JOSHI",
      remainder_date: "12-11-2023",
      status: "Reply Sent",
    },
    {
      sr_no: 10,
      entity: "ABC Mining Pvt Ltd",
      unit: "Mining Unit",
      function: "Regulatory  Laws Data",
      show_causes: "Finance	",
      notice_date: "30-12-2021",
      recieved_date: "01-01-2022",
      deadline: "10-02-20223",
      action_taken: "No",
      responsible_person: "Executor Regucheck",
      reporitng_person: "Evaluator Regucheck",
      remainder_date: "12-11-2023",
      status: "Open",
    },
    {
      sr_no: 11,
      entity: "Demo Entity Pvt Ltd",
      unit: "Corporate Office - Mumbai",
      function: "Human Resources",
      show_causes: "Certification",
      notice_date: "01-03-2023",
      recieved_date: "12-07-2023",
      deadline: "12-12-2023",
      action_taken: "Yes",
      responsible_person: "	Function head",
      reporitng_person: "CMT USER",
      remainder_date: "12-11-2023",
      status: "Closed",
    },
    {
      sr_no: 12,
      entity: "NBFC India Ltd",
      unit: "Grupo_Pune",
      function: "Secretarial",
      show_causes: "Board of Meeting",
      notice_date: "01-07-2023",
      recieved_date: "12-07-2023",
      deadline: "12-12-2023",
      action_taken: "No",
      responsible_person: "Regucheck user	",
      reporitng_person: "TANMAY JOSHI",
      remainder_date: "12-11-2023",
      status: "Reply Sent",
    },
  ];

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
      label: "Function : ",
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
  ];

  const handleButtonClick = (responseData) => {
    console.log(responseData);
  };

  return (
    <div>
      <ExpandSearchComponent
        onButtonClick={handleButtonClick}
        slug="/"
        page="Filter"
        formFields={formFields}
      />
      <AgGridTableComponent
        slug="/notice-management"
        page="Notice"
        addBtn={true}
        edit="Edit"
        customColumns={customColumns}
        customRows={staticData}
      />
    </div>
  );
}
