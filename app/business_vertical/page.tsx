"use client";

import React from "react";
import AgGridTableComponent from "@/components/AgGridTableComponent";

export default function BusinessVerical() {
  const customColumns = [
    { headerName: "Entity", field: "entity", isapi: true },
    { headerName: "Business Vertical", field: "name" },
  ];

  return (
    <>
      <AgGridTableComponent
        actionBtn={true}
        api="/api/business-vertical"
        slug="/business_vertical"
        page="Business Vertical"
        filter="?page=&pageSize=-1&filterName="
        addBtn={true}
        importBtn={false}
        customColumns={customColumns}
        listname="business_verticalList"
      />
    </>
  );
}
