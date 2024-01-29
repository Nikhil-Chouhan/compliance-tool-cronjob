"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import FormComponent from "@/components/FormComponent";

export default function ViewUnitFunctionMapping() {
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
      url: "/api/business-unit",
      name: "Business Unit",
      link: "business_unitList",
    },
    {
      url: "/api/function-department",
      name: "Function",
      link: "function_departmentList",
    },
  ];
  const formFields = [
    {
      label: "Business Unit",
      name: "business_unit_id",
      type: "select",
      api: true,
      disabled: true,
    },
    {
      label: "Function",
      name: "function_department_id",
      type: "select",
      api: true,
      disabled: true,
    },
  ];
  return (
    <>
      <FormComponent
        api="/api/unit-function-mapping"
        slug="/unit_function_mapping"
        method="VIEW"
        type="View"
        page="Unit - Function Mapping"
        showbreadCrumb={true}
        filter="?page=&pageSize=-1&filterName="
        formFields={formFields}
        endpoints={endpoints}
        initialFormData={initialFormData}
      />
    </>
  );
}
