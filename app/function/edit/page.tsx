"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";
import { useSearchParams } from "next/navigation";

export default function EditFunction() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    name: null,
  };
  const endpoints = [
    {
      url: "/api/function-department/" + id,
      name: "Function",
      link: "function_departmentRow",
    },
  ];
  const formFields = [
    {
      label: "Function",
      name: "name",
      type: "text",
      required: true,
    },
  ];
  return (
    <>
      <FormComponent
        slug="/function"
        api="/api/function-department"
        type="Edit"
        showbreadCrumb={true}
        page="Function"
        method="PUT"
        formFields={formFields}
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
      />
    </>
  );
}
