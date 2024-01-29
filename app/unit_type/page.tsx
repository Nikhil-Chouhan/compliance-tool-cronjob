"use client";

import AgGridTableComponent from "@/components/AgGridTableComponent";
import React from "react";

export default function UnitType() {
  const customColumns = [{ headerName: "Unit Type", field: "name" }];
  return (
    <>
      <AgGridTableComponent
        slug="/unit_type"
        api="/api/unit-type"
        page="Unit Type"
        filter="?page=&pageSize=-1&filterName="
        actionBtn={true}
        importBtn={false}
        addBtn={true}
        customColumns={customColumns}
        listname="unit_typeList"
      />
    </>
  );
}
