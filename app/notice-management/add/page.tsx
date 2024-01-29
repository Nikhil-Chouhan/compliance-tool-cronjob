"use client";

import FormComponent from "@/components/FormComponent";
import React from "react";

export default function AddFunction() {
  const formFields = [
    {
      label: "Entity :",
      name: "entity_id",
      type: "select",

      required: true,
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

      required: true,
      options: [
        { value: 1, label: "Cooporate Office - Mumbai" },
        { value: 2, label: "Registered Office - Pune" },
      ],
    },
    {
      label: "Function : ",
      name: "function_id",
      type: "select",

      required: true,
      options: [
        { value: 1, label: "Administration" },
        { value: 2, label: "Secretrial" },
        { value: 3, label: "Human Resources" },
        { value: 4, label: "Information Technology" },
      ],
    },
    {
      label: "Show Cause Related to: ",
      name: "Show Cause Related to",
      type: "text",

      required: false,
    },
    {
      label: "Comments: ",
      name: "Comments",
      type: "textarea",

      required: false,
    },
    {
      label: "Action Taken: ",
      name: "Action Taken",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Yes" },
        { value: 2, label: "No" },
      ],
    },
    {
      label: "Next Action Item: ",
      name: "Next Action Item",
      type: "text",

      required: false,
    },
    {
      label: "Responsible Person: ",
      name: "person_id",
      type: "select",

      required: true,
      options: [
        { value: 1, label: "DBTPL User" },
        { value: 2, label: "MeCard User" },
        { value: 3, label: "Compliance User" },
        { value: 4, label: "Whistle User" },
      ],
    },
    {
      label: "Reporting Person: ",
      name: "Reporting_id",
      type: "select",

      required: true,
      options: [
        { value: 1, label: "DBTPL User" },
        { value: 2, label: "MeCard User" },
        { value: 3, label: "Compliance User" },
        { value: 4, label: "Whistle User" },
      ],
    },
    {
      label: "Notice Dated: ",
      name: "Date",
      type: "date",

      required: false,
    },
    {
      label: "Received On: ",
      name: "Received On",
      type: "date",

      required: false,
    },
    {
      label: "Notice Reply Deadline: ",
      name: "Notice Reply Deadline",
      type: "date",

      required: false,
    },
    {
      label: "Reminder Required on: ",
      name: "Reminder Required on",
      type: "date",

      required: false,
    },
    {
      label: "Reminder Required on: ",
      name: "options",
      type: "date",

      required: false,
    },
    {
      label: "Document : ",
      name: "document",
      type: "file",

      required: false,
    },
  ];
  return (
    <>
      <FormComponent
        title="Show Cause Notices"
        slug="/notice-management"
        page="Notice"
        type="Add"
        buttonName="Add"
        showbreadCrumb={true}
        formFields={formFields}
      />
    </>
  );
}
