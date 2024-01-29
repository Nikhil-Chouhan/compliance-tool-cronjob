"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";
import { useSearchParams } from "next/navigation";

export default function EditStandardComment() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    name: null,
  };
  const endpoints = [
    {
      url: "/api/standard-comments/" + id,
      name: "Standard Comment",
      link: "standard_commentsRow",
    },
  ];
  const formFields = [
    {
      label: "Standard Comment",
      name: "name",
      type: "text",
      required: true,
    },
  ];
  return (
    <>
      <FormComponent
        slug="/standard_comment"
        api="/api/standard-comments"
        type="Edit"
        showbreadCrumb={true}
        page="Comment"
        method="PUT"
        formFields={formFields}
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
      />
    </>
  );
}
