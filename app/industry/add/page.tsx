"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";

export default function AddIndustry() {
  const initialFormData = { name: null };

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
        type="Add"
        method="POST"
        filter="?page=&pageSize=-1&filterName="
        showbreadCrumb={true}
        page="Industry"
        formFields={formFields}
        endpoints={[]}
        initialFormData={initialFormData}
      />
    </>
  );
}
