"use client";

import AgGridTableComponent from "@/components/AgGridTableComponent";

export default function User() {
  const customColumns = [
    { headerName: "Employee ID", field: "employee_id" },
    { headerName: "First Name", field: "first_name" },
    { headerName: "Last Name", field: "last_name" },
    { headerName: "Email", field: "email" },
    { headerName: "Mobile Number", field: "mobile_no" },
    { headerName: "Business Unit", field: "business_unit", isapi: true },
    { headerName: "Function", field: "function_department", isapi: true },
    { headerName: "Designation", field: "designation", isapi: true },
    { headerName: "Role", field: "role", isapi: true },
  ];

  return (
    <AgGridTableComponent
      slug="/user"
      api="/api/user"
      filter="?page=&pageSize=-1&filterName="
      page="Users"
      importBtn={false}
      actionBtn={true}
      addBtn={true}
      extraActionBtn="Set User Access"
      customColumns={customColumns}
      listname="userList"
    />
  );
}
