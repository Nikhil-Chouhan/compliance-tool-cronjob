"use client";

import AgGridTableComponent from "@/components/AgGridTableComponent";

interface Column {
  headerName: string;
  field: string;
}

export default function Organization() {
  const customColumns = [
    { headerName: "Name", field: "name" },
    { headerName: "CIN", field: "cin" },
    { headerName: "GST Number", field: "gst_number" },
    { headerName: "Industry", field: "industry", isapi: true },
  ];

  return (
    <AgGridTableComponent
      slug="/organization"
      api="/api/organization"
      page="Organization"
      filter="?page=&pageSize=-1&filterName="
      actionBtn={true}
      importBtn={false}
      addBtn={true}
      customColumns={customColumns}
      listname="organizationList"
    />
  );
}
