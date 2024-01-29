"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";

export default function AddStandardComment() {
  const initialFormData = { name: null };

  const formFields = [
    {
      label: "Comment",
      name: "name",
      type: "text",
      required: true,
    }
  ];

  return (
    <>
      <FormComponent
        slug="/standard_comment"
        api="/api/standard-comments"
        type="Add"
        method="POST"
        filter="?page=&pageSize=-1&filterName="
        showbreadCrumb={true}
        page="Standard Comment"
        formFields={formFields}
        endpoints={[]}
        initialFormData={initialFormData}
      />
    </>
  );
}
