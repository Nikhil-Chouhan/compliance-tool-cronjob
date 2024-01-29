"use client";
import AgGridTableComponent from "@/components/AgGridTableComponent";
import React from "react";

export default function Function() {
  const customColumns = [{ headerName: "Function", field: "name" }];

  return (
    <>
      <AgGridTableComponent
        slug="/function"
        api="/api/function-department"
        page="Function"
        filter="?page=&pageSize=-1&filterName="
        actionBtn={true}
        importBtn={false}
        addBtn={true}
        customColumns={customColumns}
        listname="function_departmentList"
      />
    </>
  );
}
