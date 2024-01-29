"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";
import { useSearchParams } from "next/navigation";

export default function ViewUnitType() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    name: null,
    status: 1,
  };
  const endpoints = [
    {
      url: "/api/unit-type/" + id,
      name: "Unit Type",
      link: "unit_typeRow",
    },
  ];
  const formFields = [
    {
      label: "Unit Type",
      name: "name",
      type: "text",
      disabled: true,
    },
  ];
  return (
    <>
      <FormComponent
        slug="/unit_type"
        api="/api/unit-type"
        type="View"
        showbreadCrumb={true}
        page="Unit Type"
        method="VIEW"
        formFields={formFields}
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
      />
    </>
  );
}
