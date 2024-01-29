"use client";

import UploadComponent from "@/components/UploadComponent";
import React from "react";

export default function ImportEntity() {

  return (
    <>
       <UploadComponent
        slug="/entity"
        api="/sample-data/SampleCSV.csv"
        type="Upload"
        page="Entity"
      />
    </>
  );
}
