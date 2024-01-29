"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";

export default function AddDesignations() {
  const initialFormData = {
    name: null,
  };
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
        type="Add"
        method="POST"
        filter="?page=&pageSize=-1&filterName="
        showbreadCrumb={true}
        page="Designation"
        formFields={formFields}
        endpoints={[]}
        initialFormData={initialFormData}
      />
    </>
  );
}
