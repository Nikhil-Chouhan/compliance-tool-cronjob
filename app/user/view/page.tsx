"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import FormComponent from "@/components/FormComponent";

export default function ViewUser() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    employee_id: null,
    first_name: null,
    middle_name: null,
    last_name: null,
    designation_id: null,
    email: null,
    mobile_no: null,
    password: null,
    address: null,
    country_id: null,
    zipcode: null,
    state_id: null,
    entity_id: null,
    unit_id: null,
    function_department_id: null,
    role_id: null,
    status: null,
  };
  const endpoints = [
    { url: "/api/user/" + id, name: "User", link: "userRow" },
    {
      url: "/api/country",
      name: "Country",
      link: "countriesList",
    },
    {
      url: "/api/state",
      name: "State",
      link: "stateList",
    },
    {
      url: "/api/role",
      name: "Role",
      link: "roleList",
    },
    {
      url: "/api/entity",
      name: "Entity",
      link: "entityList",
    },
    {
      url: "/api/unit",
      name: "Unit",
      link: "unitList",
    },
    {
      url: "/api/function-department",
      name: "Function Department",
      link: "function_departmentList",
    },
    {
      url: "/api/designation",
      name: "Designation",
      link: "designationList",
    },
  ];
  const formFields = [
    {
      label: "Employee ID",
      name: "employee_id",
      type: "text",
    },
    {
      label: "First Name",
      name: "first_name",
      type: "text",
    },
    {
      label: "Middle Name",
      name: "middle_name",
      type: "text",
    },
    {
      label: "Last Name",
      name: "last_name",
      type: "text",
    },
    {
      label: "Designation",
      name: "designation_id",
      type: "select",
      api: true,
      required: true,
    },
    {
      label: "Email",
      name: "email",
      type: "email",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
    },
    {
      label: "Mobile Number",
      name: "mobile_no",
      type: "tel",
    },
    {
      label: "Address",
      name: "address",
      type: "textarea",
    },
    {
      label: "Country",
      name: "country_id",
      type: "select",
      api: true,
      required: true,
    },
    {
      label: "State",
      name: "state_id",
      type: "select",
      api: true,
      required: true,
    },
    {
      label: "Zip Code",
      name: "zipcode",
      type: "text",
    },

    {
      label: "Entity",
      name: "entity_id",
      type: "select",
      api: true,
      required: true,
    },
    {
      label: "Unit",
      name: "unit_id",
      type: "select",
      api: true,
      required: true,
    },
    {
      label: "Function Department",
      name: "function_department_id",
      type: "select",
      api: true,
      required: true,
    },
    {
      label: "Role",
      name: "role_id",
      type: "select",
      api: true,
      required: true,
    },
  ];
  return (
    <>
      <FormComponent
        slug="/user"
        api="/api/user"
        type="View"
        page="User"
        method="VIEW"
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
        formFields={formFields}
        showbreadCrumb={true}
      />
    </>
  );
}
