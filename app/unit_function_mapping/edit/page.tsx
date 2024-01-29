"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import FormComponent from "@/components/FormComponent";

export default function EditEntityMapping() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    business_unit_id: null,
    function_department_id: null,
  };
  const endpoints = [
    {
      url: "/api/unit-function-mapping/" + id,
      name: "Unit Function Mapping",
      link: "unit_function_mappingRow",
    },
    {
      url: "/api/entity",
      name: "Entity",
      link: "entityList",
    },
    {
      url: "/api/function-department",
      name: "Function",
      link: "function_departmentList",
    },
    {
      url: "/api/business-unit",
      name: "Business Unit",
      link: "business_unitList",
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
      label: "Business Unit",
      name: "business_unit_id",
      type: "select",
      api: true,
      required: true,
    },
    {
      label: "Function",
      name: "function_department_id",
      type: "searchable-select",
      api: true,
      required: true,
    },
  ];
  return (
    <>
      <FormComponent
        api="/api/unit-function-mapping"
        slug="/unit_function_mapping"
        method="PUT"
        type="Edit"
        page="Unit - Function Mapping"
        showbreadCrumb={true}
        buttonName="Edit"
        filter="?page=&pageSize=-1&filterName="
        formFields={formFields}
        endpoints={endpoints}
        initialFormData={initialFormData}
      />
    </>
  );
}
