"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";
import { useSearchParams } from "next/navigation";

export default function ViewRole() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    name: null,
    description: null,
    status: 1,
  };
  const endpoints = [
    {
      url: "/api/role/" + id,
      name: "Role",
      link: "roleRow",
    },
  ];
  const formFields = [
    {
      label: "Role",
      name: "name",
      type: "text",
      disabled: true,
    },
    {
      label: "Description",
      name: "description",
      type: "text",
      disabled: true,
    },
  ];
  return (
    <>
      <FormComponent
        slug="/role"
        api="/api/role"
        type="View"
        showbreadCrumb={true}
        page="Role"
        method="VIEW"
        formFields={formFields}
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
      />
    </>
  );
}
