"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";
import { useSearchParams } from "next/navigation";

export default function EditRole() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    name: null,
    description: null,
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
      required: true,
    },
    {
      label: "Description",
      name: "description",
      type: "text",
      required: true,
    },
  ];
  return (
    <>
      <FormComponent
        slug="/role"
        api="/api/role"
        type="Edit"
        showbreadCrumb={true}
        page="Role"
        method="PUT"
        formFields={formFields}
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
      />
    </>
  );
}
