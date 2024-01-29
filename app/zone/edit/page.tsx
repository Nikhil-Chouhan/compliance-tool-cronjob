"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import FormComponent from "@/components/FormComponent";

export default function EditZone() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    entity_id: null,
    business_vertical_id: null,
    name: null,
    status: 1,
  };
  const endpoints = [
    {
      url: "/api/zone/" + id,
      name: "Zone",
      link: "zoneRow",
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
        slug="/zone"
        api="/api/zone"
        type="Edit"
        page="Zone"
        method="PUT"
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
        formFields={formFields}
      />
    </>
  );
}
