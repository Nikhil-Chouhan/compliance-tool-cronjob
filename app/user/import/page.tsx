"use client";

import UploadComponent from "@/components/UploadComponent";
import React from "react";

export default function ImportUser() {
  return (
    <>
         <UploadComponent
        slug="/user"
        api="/sample-data/SampleCSV.csv"
        type="Upload"
        page="User"
      />
    </>
  );
}
