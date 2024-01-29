"use client";

import React from "react";
import UploadComponent from "@/components/UploadComponent";

export default function ImportFunction() {
  return (
    <>
      <UploadComponent
        slug="/entity-mapping"
        api="/sample-data/SampleCSV.csv"
        type="Upload"
        page="Entity Mapping"
      />
    </>
  );
}
