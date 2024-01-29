"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import FormComponent from "@/components/FormComponent";

export default function ViewOrganization() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    name: null,
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
      url: "/api/industry/",
      name: "Industry",
      link: "industryList",
    },
    {
      url: "/api/theme/",
      name: "Theme",
      link: "themeList",
    },
  ];
  const formFields = [
    {
      label: "Organization",
      name: "name",
      type: "text",
      disabled: true,
    },
    {
      label: "CIN (Company Identification Number)",
      name: "cin",
      type: "text",
      disabled: true,
    },
    {
      label: "Gst Number",
      name: "gst_number",
      type: "text",
      disabled: true,
    },
    {
      label: "Industry",
      name: "industry_id",
      type: "select",
      disabled: true,
      api: true,
    },
    {
      label: "Theme",
      name: "theme_id",
      type: "select",
      disabled: true,
      api : true,
    },
    {
      label: "Status",
      name: "status",
      type: "select",
      disabled: true,

      options: [
        { value: 1, label: "Active" },
        { value: 2, label: "Inactive" },
      ],
    },
  ];
  return (
    <>
      <FormComponent
        slug="/organization"
        api="/api/organization"
        type="View"
        page="Organization"
        method="VIEW"
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
        formFields={formFields}
      />
    </>
  );
}
