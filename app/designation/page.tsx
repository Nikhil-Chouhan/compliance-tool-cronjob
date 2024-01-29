"use client";

import AgGridTableComponent from "@/components/AgGridTableComponent";
import React from "react";

export default function NoticeManagement() {
  const customColumns = [{ headerName: "Designation Name", field: "name" }];
  return (
    <>
      <AgGridTableComponent
        api="/api/designation"
        slug="/designation"
        page="Designation"
        filter="?page=&pageSize=-1&filterName="
        importBtn={false}
        addBtn={true}
        actionBtn={true}
        customColumns={customColumns}
        listname="designationList"
      />
    </>
  );
}
