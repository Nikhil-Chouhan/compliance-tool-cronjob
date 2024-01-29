"use client";

import React from "react";
import UploadComponent from "@/components/UploadComponent";

export default function ImportFunction() {
  return (
    <>
      <UploadComponent
        slug="/audit-management/audit-admin/audit-checkpoint-library"
        api="/sample-data/SampleCSV.csv"
        type="Upload"
        mainPage="Audit Management"
        previousPage="Audit CheckPoint List"
        page="Audit CheckPoint"
        showbreadCrumb={true}
      />
    </>
  );
}
