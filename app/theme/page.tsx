"use client";

import AgGridTableComponent from "@/components/AgGridTableComponent";
import React from "react";

export default function Theme() {
  const customColumns = [
    { headerName: "Theme Name", field: "name" },
    { headerName: "Primary Color", field: "primary_color" },
    { headerName: "Secondary Color", field: "secondary_color" },
    { headerName: "Mode", field: "mode" },
  ];
  return (
    <>
      <AgGridTableComponent
        slug="/theme"
        api="/api/theme"
        page="Theme"
        filter="?page=&pageSize=-1&filterName="
        actionBtn={true}
        importBtn={false}
        addBtn={true}
        customColumns={customColumns}
        listname="themeList"
      />
    </>
  );
}
