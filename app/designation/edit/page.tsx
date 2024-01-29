"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";
import { useSearchParams } from "next/navigation";

export default function EditDesignations() {
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
      required: true,
    },
  ];
  return (
    <>
      <FormComponent
        slug="/designation"
        api="/api/designation"
        type="Edit"
        showbreadCrumb={true}
        page="Designation"
        method="PUT"
        filter="?page=&pageSize=-1&filterName="
        formFields={formFields}
        initialFormData={initialFormData}
        endpoints={endpoints}
      />
    </>
  );
}
