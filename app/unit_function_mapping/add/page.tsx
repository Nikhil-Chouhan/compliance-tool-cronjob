"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";

export default function AddUnitFunctionMapping() {
  const initialFormData = {
    business_unit_id: null,
    function_department_ids: [],
  };
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
      name: "function_department_ids",
      type: "multi-select",
      api: true,
      required: true,
    },
  ];
  const endpoints = [
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
  ];

  return (
    <>
      <FormComponent
        title="Map Unit - Function"
        api="/api/unit-function-mapping"
        slug="/unit_function_mapping"
        method="POST"
        type="Add"
        page="Unit - Function Mapping"
        showbreadCrumb={true}
        buttonName="Add"
        filter="?page=&pageSize=-1&filterName="
        formFields={formFields}
        endpoints={endpoints}
        initialFormData={initialFormData}
        removeId="entity_id"
      />
    </>
  );
}
