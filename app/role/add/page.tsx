"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";

export default function AddRole() {
  const initialFormData = { name: null , description: null};

  const formFields = [
    {
      label: "Role",
      name: "name",
      type: "text",
      required: true,
    },
    {
      label: "Description",
      name: "description",
      type: "text",
      required: true,
    },
  ];

  return (
    <>
      <FormComponent
        slug="/role"
        api="/api/role"
        type="Add"
        method="POST"
        filter="?page=&pageSize=-1&filterName="
        showbreadCrumb={true}
        page="Role"
        formFields={formFields}
        endpoints={[]}
        initialFormData={initialFormData}
      />
    </>
  );
}
