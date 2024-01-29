"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import FormComponent from "@/components/FormComponent";

export default function EditOrganization() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    name: null,
    logo: null,
    cin: null,
    gst_number: null,
    industry_id: null,
    theme_id: null,
    status: 1,
  };
  const endpoints = [
    {
      url: "/api/organization/" + id,
      name: "Organization",
      link: "organizationRow",
    },
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
      api : true,
    },
  ];
  return (
    <>
      <FormComponent
        slug="/organization"
        api="/api/organization"
        type="Edit"
        page="Organization"
        method="PUT"
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
        formFields={formFields}
      />
    </>
  );
}
