"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";

export default function AddUser() {
  const initialFormData = {
    employee_id: null,
    first_name: null,
    middle_name: null,
    last_name: null,
    email: null,
    mobile_no: null,
    password: null,
    business_unit_id: null,
    function_department_id: null,
    designation_id: null,
    role_id: null,
    status: 1,
  };

  const endpoints = [
    {
      url: "/api/business-unit",
      name: "Unit",
      link: "business_unitList",
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
    {
      url: "/api/role",
      name: "Role",
      link: "roleList",
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
      label: "Email",
      name: "email",
      type: "email",
    },
    {
      label: "Mobile Number",
      name: "mobile_no",
      type: "tel",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
    },
    {
      label: "Unit",
      name: "business_unit_id",
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
      label: "Designation",
      name: "designation_id",
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
        type="Add"
        page="User"
        method="POST"
        filter="?page=&pageSize=-1&filterName="
        initialFormData={initialFormData}
        endpoints={endpoints}
        formFields={formFields}
        showbreadCrumb={true}
      />
    </>
  );
}
