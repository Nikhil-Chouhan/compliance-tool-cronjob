"use client";

import AgGridTableComponent from "@/components/AgGridTableComponent";
import React from "react";

export default function StandardComment() {
  const customColumns = [
    { headerName: "Comments", field: "name" },
  ];
  return (
    <>
      <AgGridTableComponent
        slug="/standard_comment"
        api="/api/standard-comments"
        page="Standard Comment"
        filter="?page=&pageSize=-1&filterName="
        actionBtn={true}
        // importBtn={true}
        addBtn={true}
        customColumns={customColumns}
        listname="standard_commentsList"
      />
    </>
  );
}
