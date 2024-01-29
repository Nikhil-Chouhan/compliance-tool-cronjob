"use client";
import React from "react";
import FormComponent from "@/components/FormComponent";

export default function AddOrganization() {
  const initialFormData = {
    name: null,
    logo: null,
    cin: null,
    gst_number: null,
    industry_id: null,
    theme_id: null,
  };
  const endpoints = [
    {
      url: "/api/industry",
      name: "Industry",
      link: "industryList",
    },
    {
      url: "/api/theme",
      name: "Theme",
      link: "themeList",
    },
  ];
  const formFields = [
    {
      label: "Name",
      name: "name",
      type: "text",
      required: true,
    },
    {
      label: "Logo",
      name: "logo",
      type: "file",
      required: false,
    },
    {
      label: "CIN (Company Identification Number)",
      name: "cin",
      type: "text",
      required: false,
    },
    {
      label: "Gst Number",
      name: "gst_number",
      type: "text",
      required: false,
    },
    {
      label: "Industry",
      name: "industry_id",
      type: "select",
      required: false,
      api: true,
    },
    {
      label: "Theme",
      name: "theme_id",
      type: "select",
      required: false,
      api: true,
    },
  ];

  return (
    <>
      <FormComponent
        slug="/organization"
        api="/api/organization"
        type="Add"
        page="Organization"
        method="POST"
        filter="?page=&pageSize=-1&filterName="
        formFields={formFields}
        endpoints={endpoints}
        initialFormData={initialFormData}
      />
    </>
  );
}
