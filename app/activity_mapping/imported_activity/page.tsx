"use client";

import AgGridTableComponent from "@/components/AgGridTableComponent";

interface Column {
  headerName: string;
  field: string;
}

export default function ImportedActivity() {
  const customColumns = [
    { headerName: "Activity Code", field: "activity_code" },
    { headerName: "Country", field: "country" },
    { headerName: "State", field: "state" },
    { headerName: "Law Category", field: "law_category" },
    { headerName: "Legislation", field: "legislation" },
    { headerName: "Rule", field: "rule" },
    { headerName: "Title", field: "title" },
    { headerName: "Reference", field: "reference" },
    { headerName: "Who", field: "who" },
    { headerName: "When", field: "when" },
    { headerName: "Activity", field: "activity" },
    { headerName: "Procedure", field: "procedure" },
    { headerName: "Impact", field: "impact" },
    { headerName: "Frequency", field: "frequency" },
    { headerName: "Due Date", field: "legal_due_date" },
    { headerName: "Specific Due Date", field: "specific_due_date" },
  ];

  return (
    <AgGridTableComponent
      slug="/activity_mapping/imported_activity"
      api="/api/crs-activity"
      page="Imported Activities"
      filter="?page=&pageSize=-1&filterName="
      importBtn={true}
      customColumns={customColumns}
      listname="crs_activityList"
    />
  );
}
