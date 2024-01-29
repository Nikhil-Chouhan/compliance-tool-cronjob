"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";
import { useSearchParams } from "next/navigation";

export default function ViewDesignations() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    name: null,
  };
  const endpoints = [
    {
      url: "/api/designation/" + id,
      name: "Designation",
      link: "designationRow",
    },
  ];
  const formFields = [
    {
      label: "Designation",
      name: "name",
      type: "text",
      disabled: true,
    },
  ];
  return (
    <>
      <FormComponent
        slug="/designation"
        api="/api/designation"
        type="View"
        showbreadCrumb={true}
        page="Designation"
        method="VIEW"
        filter="?page=&pageSize=-1&filterName="
        formFields={formFields}
        initialFormData={initialFormData}
        endpoints={endpoints}
      />
    </>
  );
}
