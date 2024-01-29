"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import FormComponent from "@/components/FormComponent";
import AgGridTableComponent from "@/components/AgGridTableComponent";

// interface FormData {
//   user_id: number;
//   entity_id: null;
//   business_unit_id: null;
//   function_department_ids: number[];
// }

export default function SetUserAccess() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    user_id: Number(id),
    entity_id: null,
    business_unit_id: null,
    function_department_ids: [],
  };

  const endpoints = [
    // { url: "/api/user/" + id, name: "User", link: "userRow" },
    {
      url: "/api/entity",
      name: "Entity",
      link: "entityList",
    },
    {
      url: "/api/function-department",
      name: "Function Department",
      link: "function_departmentList",
    },
  ];
  const formFields = [
    // {
    //   label: "Employee ID",
    //   name: "employee_id",
    //   type: "text",
    //   disabled: true,
    // },
    // {
    //   label: "Name",
    //   name: "first_name",
    //   type: "text",
    //   disabled: true,
    // },
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
      label: "Function Department",
      name: "function_department_id",
      type: "multi-select",
      api: true,
      required: true,
    },
  ];

  const customColumns = [
    { headerName: "User Name", field: "user_name" },
    { headerName: "Entity", field: "entity_name" },
    { headerName: "Business Unit", field: "business_unit_name" },
    { headerName: "Function", field: "function_name" },
  ];
  return (
    <>
      <FormComponent
        slug="/user"
        api="/api/user-function-mapping"
        type="Add"
        page="User"
        method="POST"
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
        formFields={formFields}
        showbreadCrumb={true}
      />

      <AgGridTableComponent
        slug="/user"
        api="/api/user-function-mapping"
        filter={`?page=&pageSize=-1&filteruserId=${id}`}
        page="User Access"
        edit={"Delete"}
        customColumns={customColumns}
        listname="user_function_mappingFlatList"
      />
    </>
  );
}
