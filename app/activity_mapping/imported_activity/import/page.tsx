"use client";

import React from "react";
import UploadComponent from "@/components/UploadComponent";

export default function ImportActivity() {
  return (
    <>
      <UploadComponent
        slug="/activity_mapping/imported_activity"
        api="/api/crs-activity/bulkupload"
        type="Upload"
        page="Activity"
        previousPage="Imported Activity"
        showbreadCrumb={true}
      />
    </>
  );
}
