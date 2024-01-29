"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";

export default function AddUnitType() {
  const initialFormData = { name: null };

  const formFields = [
    {
      label: "Unit Type",
      name: "name",
      type: "text",
      required: true,
    },
  ];

  return (
    <>
      <FormComponent
        slug="/unit_type"
        api="/api/unit-type"
        type="Add"
        method="POST"
        filter="?page=&pageSize=-1&filterName="
        showbreadCrumb={true}
        page="Unit Type"
        formFields={formFields}
        endpoints={[]}
        initialFormData={initialFormData}
      />
    </>
  );
}
