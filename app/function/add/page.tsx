"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";

export default function AddFunction() {
  const initialFormData = { name: null };

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
        type="Add"
        method="POST"
        filter="?page=&pageSize=-1&filterName="
        showbreadCrumb={true}
        page="Function"
        formFields={formFields}
        endpoints={[]}
        initialFormData={initialFormData}
      />
    </>
  );
}
