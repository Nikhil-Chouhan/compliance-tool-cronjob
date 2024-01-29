"use client";

import React from "react";
import AgGridTableComponent from "@/components/AgGridTableComponent";

export default function BusinessUnit() {
  const customColumns = [
    { headerName: "Entity", field: "entity", isapi: true },
    {
      headerName: "Business Vertical",
      field: "business_vertical",
      isapi: true,
    },
    {
      headerName: "Zone",
      field: "zone",
      isapi: true,
    },
    { headerName: "Unit", field: "name" },
    { headerName: "Unit Code", field: "unit_code" },
    { headerName: "Unit Type", field: "unit_type", isapi: true },
  ];

  return (
    <>
      <AgGridTableComponent
        slug="/business_unit"
        api="/api/business-unit"
        page="Unit"
        filter="?page=&pageSize=-1&filterName="
        actionBtn={true}
        importBtn={false}
        addBtn={true}
        customColumns={customColumns}
        listname="business_unitList"
      />
    </>
  );
}
