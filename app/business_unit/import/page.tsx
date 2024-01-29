"use client";

import UploadComponent from "@/components/UploadComponent";
import React from "react";

export default function ImportUnit() {
 
  return (
    <>
       <UploadComponent
        slug="/unit"
        api="/sample-data/SampleCSV.csv"
        type="Upload"
        page="Unit"
      />
    </>
  );
}
