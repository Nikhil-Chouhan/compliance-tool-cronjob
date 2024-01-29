"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import FormComponent from "@/components/FormComponent";
import { useSession } from "next-auth/react";

export default function ViewZone() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    name: null,
    entity_id : null,
    business_vertical_id: null,
    status: 1,
  };
  const endpoints = [
    {
      url: "/api/zone/" + id,
      name: "Zone",
      link: "zoneRow",
    },
    {
      url: "/api/entity/",
      name: "Entity",
      link: "entityList",
    },
    {
      url: "/api/business-vertical/",
      name: "Business Vertical",
      link: "business_verticalList",
    },
  ];
  const formFields = [
    {
      label: "Zone",
      name: "name",
      type: "text",
      required: true,
      disabled: true,
    },
    {
      label: "Business Vertical",
      name: "business_vertical_id",
      type: "select",
      api: true,
      required: true,
      disabled: true,
    },
    {
      label: "Entity",
      name: "entity_id",
      type: "select",
      api:true,
      required: true,
      disabled: true,
    },

  ];
  return (
    <>
      <FormComponent
        slug="/zone"
        api="/api/zone"
        type="View"
        page="Zone"
        method="VIEW"
        filter="?page=&pageSize=-1&filterName="
        showbreadCrumbs = {true}
        initialFormData={initialFormData}
        endpoints={endpoints}
        formFields={formFields}
      />
    </>
  );
}
