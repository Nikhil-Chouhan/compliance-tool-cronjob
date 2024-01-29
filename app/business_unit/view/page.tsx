"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";
import { useSearchParams } from "next/navigation";

export default function EditUnit() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const initialFormData = {
    id: null,
    // organization_id: 1,

    entity_id: null,
    business_vertical_id: null,
    zone_id: null,
    name: null,
    unit_code: null,
    unit_type: null,
    address1: null,
    address2: null,
    country: null,
    state: null,
    city: null,
    zipcode: null,
  };
  const formFields = [
    {
      label: "Entity",
      name: "entity_id",
      type: "select",
      api: true,
      disabled: true,
    },
    {
      label: "Business Vertical",
      name: "business_vertical_id",
      type: "select",
      api : true,
      disabled: true,
    },
    {
      label: "Zone",
      name: "zone_id",
      type: "select",
      api : true,
      disabled: true,
    },

    {
      label: "Business Unit",
      name: "name",
      type: "text",
      disabled: true,
    },
    {
      label: "Unit Code",
      name: "unit_code",
      type: "text",
      disabled: true,
    },
    {
      label: "Unit Type",
      name: "unit_type",
      type: "select",
      api: true,
      disabled : true
    },
    {
      label: "Address 1",
      name: "address1",
      type: "textarea",
      disabled: true,
    },
    {
      label: "Address 2",
      name: "address2",
      type: "textarea",
      disabled: true,
    },
    {
      label: "Country",
      name: "country",
      type: "text",
      disabled: true,
    },
    {
      label: "State",
      name: "state",
      type: "text",
      disabled: true,
    },
    {
      label: "City",
      name: "city",
      type: "text",
      disabled: true,
    },
    {
      label: "Zipcode",
      name: "zipcode",
      type: "text",
      disabled: true,
    },
  ];
  const endpoints = [
    {
      url: "/api/business-unit/" + id,
      name: "Business Unit",
      link: "business_unitRow",
    },
    {
      url: "/api/entity",
      name: "Entity",
      link: "entityList",
    },
    {
      url: "/api/zone",
      name: "Zone",
      link: "zoneList",
    },
    {
      url: "/api/business-vertical",
      name: "Business Vertical",
      link: "business_verticalList",
    },
    {
      url: "/api/unit-type",
      name: "Unit Type",
      link: "unit_typeList",
    },
  ];
  return (
    <>
      <FormComponent
        slug="/business_unit"
        api="/api/business-unit"
        method="VIEW"
        type="View"
        showbreadCrumb={true}
        page="Business Unit"
        filter="?page=&pageSize=-1&filterName="
        formFields={formFields}
        endpoints={endpoints}
        initialFormData={initialFormData}
      />
    </>
  );
}
