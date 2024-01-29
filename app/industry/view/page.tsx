"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";
import { useSearchParams } from "next/navigation";

export default function ViewIndustry() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    name: null,
    status: 1,
  };
  const endpoints = [
    {
      url: "/api/industry/" + id,
      name: "Function",
      link: "industryRow",
    },
  ];
  const formFields = [
    {
      label: "Industry",
      name: "name",
      type: "text",
      disabled: true,
    },
  ];
  return (
    <>
      <FormComponent
        slug="/industry"
        api="/api/industry"
        type="View"
        showbreadCrumb={true}
        page="Industry"
        method="VIEW"
        formFields={formFields}
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
      />
    </>
  );
}
