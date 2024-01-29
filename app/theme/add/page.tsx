"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";

export default function AddTheme() {
  const initialFormData = { name: null , primary_color: null  , secondary_color: null  , mode: null};

  const formFields = [
    {
      label: "Theme",
      name: "name",
      type: "text",
      required: true,
    },
    {
      label: "Primary Color",
      name: "primary_color",
      type: "color",
      required: true,
    },
    {
      label: "Secondary Color",
      name: "secondary_color",
      type: "color",
      required: true,
    },
    {
      label: "Mode",
      name: "mode",
      type: "text",
      required: true,
    },
  ];
  

  return (
    <>
      <FormComponent
        slug="/theme"
        api="/api/theme"
        type="Add"
        method="POST"
        filter="?page=&pageSize=-1&filterName="
        showbreadCrumb={true}
        page="Theme"
        formFields={formFields}
        endpoints={[]}
        initialFormData={initialFormData}
      />
    </>
  );
}
