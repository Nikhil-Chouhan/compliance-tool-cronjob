"use client";

import React from "react";
import FormComponent from "@/components/FormComponent";

export default function AddUnit() {
  const initialFormData = {
    entity_id: null,
    business_vertical_id: null,
    unit_type_id: null,
    zone_id: null,
    name: null,
    unit_code: null,
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
      required: true,
    },
    {
      label: "Business Vertical",
      name: "business_vertical_id",
      type: "select",
      api: true,
    },
    {
      label: "Zone",
      name: "zone_id",
      type: "select",
      api: true,
    },

    {
      label: "Business Unit",
      name: "name",
      type: "text",
      required: true,
    },
    {
      label: "Unit Code",
      name: "unit_code",
      type: "text",
      required: false,
    },
    {
      label: "Unit Type",
      name: "unit_type_id",
      type: "select",
      api: true,
      required: true,
    },
    {
      label: "Address 1",
      name: "address1",
      type: "textarea",
      required: true,
    },
    {
      label: "Address 2",
      name: "address2",
      type: "textarea",
      required: false,
    },
    {
      label: "Country",
      name: "country",
      type: "text",
      required: true,
    },
    {
      label: "State",
      name: "state",
      type: "text",
      required: true,
    },
    {
      label: "City",
      name: "city",
      type: "text",
      required: true,
    },
    {
      label: "Zipcode",
      name: "zipcode",
      type: "text",
      required: true,
    },
  ];
  const endpoints = [
    {
      url: "/api/entity",
      name: "Entity",
      link: "entityList",
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
        method="POST"
        type="Add"
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
