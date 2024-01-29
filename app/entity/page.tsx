"use client";

import React from "react";
import AgGridTableComponent from "@/components/AgGridTableComponent";

export default function Entity() {
  const customColumns = [
    { headerName: "Organization", field: "organization", isapi: true },
    { headerName: "Entity", field: "name" },
    { headerName: "Short Name", field: "short_name" },
    { headerName: "Industry", field: "industry", isapi: true },
    { headerName: "CIN", field: "cin" },
    { headerName: "GST", field: "gst" },
    { headerName: "PAN", field: "pan" },
    { headerName: "TAN", field: "tan" },
  ];

  return (
    <>
      <AgGridTableComponent
        actionBtn={true}
        api="/api/entity"
        slug="/entity"
        page="Entity List"
        filter="?page=&pageSize=-1&filterName="
        addBtn={true}
        importBtn={false}
        customColumns={customColumns}
        listname="entityList"
      />
    </>
  );
}
