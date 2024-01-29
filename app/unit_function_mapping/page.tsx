"use client";

import AgGridTableComponent from "@/components/AgGridTableComponent";
import React from "react";

export default function UnitFunctionMapping() {
  const customColumns = [
    { headerName: "Business Unit", field: "business_unit", isapi: true },
    { headerName: "Function", field: "function", isapi: true },
  ];
  return (
    <>
      <AgGridTableComponent
        slug="/unit_function_mapping"
        api="/api/unit-function-mapping"
        filter="?page=&pageSize=-1&filterName="
        page="Unit Function Mapping"
        actionBtn={true}
        importBtn={false}
        addBtn={true}
        customColumns={customColumns}
        listname="unit_function_mappingList"
      />
    </>
  );
}
