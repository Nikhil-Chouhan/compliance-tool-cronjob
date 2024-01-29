"use client";
import React from "react";
import FormComponent from "@/components/FormComponent";

export default function AddZone() {
  const initialFormData = {
    entity_id: null,
    business_vertical_id: null,
    name: null,
  };
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
      name: "business_vertical_id",
      type: "select",
      api: true,
    },
    {
      label: "Zone",
      name: "name",
      type: "text",
      required: true,
    },
  ];

  return (
    <>
      <FormComponent
        slug="/zone"
        api="/api/zone"
        type="Add"
        page="Zone"
        method="POST"
        filter="?page=&pageSize=-1&filterName="
        formFields={formFields}
        endpoints={endpoints}
        initialFormData={initialFormData}
      />
    </>
  );
}
