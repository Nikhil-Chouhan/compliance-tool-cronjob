"use client";

import AgGridTableComponent from "@/components/AgGridTableComponent";

interface Column {
  headerName: string;
  field: string;
}

export default function Zone() {
  const customColumns = [
    { headerName: "Zone", field: "name" },
    { headerName: "Entity", field: "entity", isapi: true },
    {
      headerName: "Business Vertical",
      field: "business_vertical",
      isapi: true,
    },
  ];

  return (
    <AgGridTableComponent
      slug="/zone"
      api="/api/zone"
      page="Zone"
      filter="?page=&pageSize=-1&filterName="
      actionBtn={true}
      importBtn={false}
      addBtn={true}
      customColumns={customColumns}
      listname="zoneList"
    />
  );
}
