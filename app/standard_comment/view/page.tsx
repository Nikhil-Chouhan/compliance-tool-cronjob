"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";
import { useSearchParams } from "next/navigation";

export default function ViewStandardComment() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    name: null,
    status: 1,
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
      label: "Comment",
      name: "name",
      type: "text",
      disabled: true,
    },
  ];
  return (
    <>
      <FormComponent
        slug="/standard_comment"
        api="/api/standard-comments"
        type="View"
        showbreadCrumb={true}
        page="Comment"
        method="VIEW"
        formFields={formFields}
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
      />
    </>
  );
}
