"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";
import { useSearchParams } from "next/navigation";

export default function EditIndustry() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    name: null,
    // status: 1, 
  };
  const endpoints = [
    {
      url: "/api/industry/" + id,
      name: "Industry",
      link: "industryRow",
    },
  ];
  const formFields = [
    {
      label: "Industry",
      name: "name",
      type: "text",
      required: true,
    },
  ];
  return (
    <>
      <FormComponent
        slug="/industry"
        api="/api/industry"
        type="Edit"
        showbreadCrumb={true}
        page="Industry"
        method="PUT"
        formFields={formFields}
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
      />
    </>
  );
}
