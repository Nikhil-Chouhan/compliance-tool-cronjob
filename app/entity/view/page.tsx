"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import FormComponent from "@/components/FormComponent";
import { useSession } from "next-auth/react";

export default function ViewEntity() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    organization_id: null,
    name: null,
    short_name : null,
    industry_id: null,
    cin: null,
    gst: null,
    pan: null,
    tan: null,
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
      disabled: true,
      required: true,
    },
    {
      label: "Entity",
      name: "name",
      type: "text",
      disabled: true,
      required: true,
    },
    {
      label: "Short Name",
      name: "short_name",
      type: "text",
      disabled: true,
      required: true,
    },
    {
      label: "Industry",
      name: "industry_id",
      type: "select",
      api: true,
      disabled: true,
      required: true,
    },
    {
      label: "CIN (Company Identification Number)",
      name: "cin",
      type: "text",
      disabled: true,
      required: true,
    },
    {
      label: "PAN (Permanent Account Number)",
      name: "pan",
      type: "text",
      disabled: true,
      required: true,
    },
    {
      label: "GST (Goods & Service Tax)",
      name: "gst",
      type: "text",
      disabled: true,
      required: true,
    },
    {
      label: "TAN (Tax deduction and Collection Account Number)",
      name: "tan",
      type: "text",
      disabled: true,
      required: true,
    },

    // {
    //   label: "Status",
    //   name: "status",
    //   type: "select",
    //   api: false,
    //   disabled: true,
    //   required: false,
    //   options: [
    //     { value: 1, label: "Active" },
    //     { value: 2, label: "Inactive" },
    //   ],
    // },
  ];
  return (
    <>
      <FormComponent
        slug="/entity"
        api="/api/entity"
        type="View"
        page="Entity"
        method="VIEW"
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
        formFields={formFields}
      />
    </>
  );
}
