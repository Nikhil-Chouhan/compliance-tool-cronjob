"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";
import { useSearchParams } from "next/navigation";

export default function ViewTheme() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    name: null ,
    primary_color: null  ,
    secondary_color: null  ,
    mode: null,
  };
  const endpoints = [
    {
      url: "/api/theme/" + id,
      name: "Theme",
      link: "themeRow",
    },
  ];
  const formFields = [
    {
      label: "Theme",
      name: "name",
      type: "text",
      required: true,
      disabled: true,
    },
    {
      label: "Primary Color",
      name: "primary_color",
      type: "color",
      required: true,
      disabled: true,
    },
    {
      label: "Secondary Color",
      name: "secondary_color",
      type: "color",
      required: true,
      disabled: true,
    },
    {
      label: "Mode",
      name: "mode",
      type: "text",
      required: true,
      disabled: true,
    },
  ];
  return (
    <>
      <FormComponent
        slug="/theme"
        api="/api/theme"
        type="View"
        showbreadCrumb={true}
        page="Theme"
        method="VIEW"
        formFields={formFields}
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
      />
    </>
  );
}
