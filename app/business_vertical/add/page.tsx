"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";

export default function AddBusinessVertical() {
  const initialFormData = { entity_id: null, name: null };
  const endpoints = [
    {
      url: "/api/entity",
      name: "Entity",
      link: "entityList",
    },
  ];
  const formFields = [
    {
      label: "Entity",
      name: "entity_id",
      type: "select",
      api: true,
      required: true,
    },
    {
      label: "Business Vertical",
      name: "name",
      type: "text",
      required: true,
    },
  ];

  return (
    <>
      <FormComponent
        slug="/business_vertical"
        api="/api/business-vertical"
        showbreadCrumb={true}
        type="Add"
        page="Business Vertical"
        method="POST"
        formFields={formFields}
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
      />
    </>
  );
}
