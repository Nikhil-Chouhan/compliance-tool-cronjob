"use client";

import AgGridTableComponent from "@/components/AgGridTableComponent";
import React from "react";

export default function Role() {
  const customColumns = [
    { headerName: "Role", field: "name" },
    { headerName: "Description", field: "description" },
  ];
  return (
    <>
      <AgGridTableComponent
        slug="/role"
        api="/api/role"
        page="Role"
        filter="?page=&pageSize=-1&filterName="
        actionBtn={true}
        importBtn={false}
        addBtn={true}
        pagecustomBtn="Access Control"
        pagecustomSlug="/access-control"
        customColumns={customColumns}
        listname="roleList"
      />
    </>
  );
}
