"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import FormComponent from "@/components/FormComponent";

export default function EditBusinessVertical() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    organization_id: null,
    entity_id: null,
    name: null,
    status: 1,
  };
  const endpoints = [
    {
      url: "/api/business-vertical/" + id,
      name: "Business Vertical",
      link: "business_verticalRow",
    },
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
    {
      label: "Status",
      name: "status",
      type: "select",
      api: false,
      required: false,
      options: [
        { value: 1, label: "Active" },
        { value: 2, label: "Inactive" },
      ],
    },
  ];
  return (
    <>
      <FormComponent
        slug="/business_vertical"
        api="/api/business-vertical"
        type="Edit"
        showbreadCrumb={true}
        page="Business Vertical"
        method="PUT"
        filter="?page=&pageSize=-1&filterName="
        formFields={formFields}
        initialFormData={initialFormData}
        endpoints={endpoints}
      />
    </>
  );
}
