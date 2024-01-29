"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import FormComponent from "@/components/FormComponent";

export default function EditEntity() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    organization_id: null,
    name: null,
    short_name: null,
    logo: null,
    cin: null,
    gst: null,
    pan: null,
    tan: null,
    industry_id: null,
    status: 1,
  };
  const endpoints = [
    {
      url: "/api/entity/" + id,
      name: "Entity",
      link: "entityRow",
    },
    {
      url: "/api/organization",
      name: "Organization",
      link: "organizationList",
    },
    {
      url: "/api/industry",
      name: "Industry",
      link: "industryList",
    },
  ];
  const formFields = [
    {
      label: "Organization",
      name: "organization_id",
      type: "select",
      api: true,
      required: true,
    },
    {
      label: "Entity",
      name: "name",
      type: "text",
      required: true,
    },
    {
      label: "Short Name",
      name: "short_name",
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
      label: "PAN (Permanent Account Number)",
      name: "pan",
      type: "text",
      required: false,
    },
    {
      label: "GST (Goods & Service Tax)",
      name: "gst",
      type: "text",
      required: false,
    },
    {
      label: "TAN (Tax deduction and Collection Account Number)",
      name: "tan",
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
  ];
  return (
    <>
      <FormComponent
        slug="/entity"
        api="/api/entity"
        type="Edit"
        showbreadCrumb={true}
        page="Entity"
        method="PUT"
        filter="?page=&pageSize=-1&filterName="
        formFields={formFields}
        initialFormData={initialFormData}
        endpoints={endpoints}
      />
    </>
  );
}
