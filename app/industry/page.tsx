"use client";
import AgGridTableComponent from "@/components/AgGridTableComponent";
import React from "react";

export default function Industry() {
  const customColumns = [{ headerName: "Industry", field: "name" }];

  return (
    <>
      <AgGridTableComponent
        slug="/industry"
        api="/api/industry"
        page="Industry"
        filter="?page=&pageSize=-1&filterName="
        actionBtn={true}
        importBtn={false}
        addBtn={true}
        customColumns={customColumns}
        listname="industryList"
      />
    </>
  );
}
