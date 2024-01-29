"use client";

import React, { useState, useRef, useCallback, RefObject } from "react";
import ExpandSearchComponent from "@/components/ExpandSearchComponent";
import AgGridTableComponent from "@/components/AgGridTableComponent";
import { GridApi } from "ag-grid-community";
import ModalForm from "@/components/ModalFormComponent";

export default function ActivateActivity() {
  const [showCheckboxActivity, setShowCheckboxActivity] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [api, setApi] = useState("/api/activity-configuration/");
  const [idsArray, setIdsArray] = useState<any[]>([]);

  // const gridApiRef = useRef(null);
  const gridApiRef = useRef<GridApi | null>(null);

  const today = new Date();
  const date = today.setDate(today.getDate());
  const defaultValue = new Date(date).toISOString().split("T")[0];

  const customColumns = [
    {
      headerName: "CRS Activity ID",
      field: "activity_code",
    },
    {
      headerName: "Unit Activity ID",
      field: "unit_activity_id",
    },
    {
      headerName: "Entity",
      field: "entity_name",
    },
    {
      headerName: "Business Unit",
      field: "business_unit_name",
    },
    {
      headerName: "Function",
      field: "function_name",
    },
    {
      headerName: "Legislation",
      field: "legislation",
    },
    { headerName: "Rule", field: "rule" },
    {
      headerName: "Reference",
      field: "reference",
    },
    { headerName: "Who", field: "who" },
    { headerName: "When", field: "when" },
    {
      headerName: "Activity",
      field: "activity",
    },
    {
      headerName: "Frequency",
      field: "frequency",
    },
    {
      headerName: "Impact",
      field: "impact",
    },
    {
      headerName: "Performer",
      field: "executor_name",
    },
    {
      headerName: "Reviewer",
      field: "evaluator_name",
    },
    {
      headerName: "Function Head",
      field: "function_head_name",
    },
  ];

  const modalendpoints = [
    {
      url: api,
      name: "Activity Configuration",
      link: "activity_configurationRow",
    },
    {
      url: "/api/enum/impact",
      name: "Impact On Entity",
      link: "data",
    },
    {
      url: "/api/enum/impact",
      name: "Impact On Unit",
      link: "data",
    },
    {
      url: "/api/enum/impact",
      name: "Impact",
      link: "data",
    },
    {
      url: "/api/enum/frequency",
      name: "Frequency",
      link: "data",
    },
  ];

  const initialmodalFormData = {
    id: null,
    impact_on_entity: null,
    impact_on_unit: null,
    impact: null,
    frequency: null,
    alert_prior_days: null,
    proof_required: null,
    historical: null,
    due_date_buffer: null,
    activity_maker_checker: null,
    back_dates: null,
    legal_due_date: null,
    unit_head_due_date: null,
    function_head_due_date: null,
    evaluator_due_date: null,
    executor_due_date: null,
    activity_mapping_id: null,
    first_alert: null,
    second_alert: null,
    third_alert: null,
  };

  const modalFieldsForActivityMapping = [
    {
      label: "Impact On Entity",
      name: "impact_on_entity",
      type: "select",
      api: true,
      apitype: "enum",
      required: false,
    },
    {
      label: "Impact On Unit",
      name: "impact_on_unit",
      type: "select",
      api: true,
      apitype: "enum",
      required: false,
    },
    {
      label: "Impact",
      name: "impact",
      type: "select",
      api: true,
      apitype: "enum",
      required: false,
    },
    {
      label: "Frequency",
      name: "frequency",
      type: "select",
      api: true,
      apitype: "enum",
      required: false,
    },
    {
      label: "Proof Required (Document) ",
      name: "proof_required",
      type: "select",
      required: false,
      options: [
        { value: 1, label: "Mandatory" },
        { value: 0, label: "Non-mandatory" },
      ],
    },
    {
      label: "Historical",
      name: "historical",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Yes" },
        { value: 2, label: "No" },
      ],
    },
    {
      label: "Activity Maker Checker",
      name: "activity_maker_checker",
      type: "select",
      required: false,
      options: [
        { value: 1, label: "Allowed" },
        { value: 0, label: "Not Allowed" },
      ],
    },
    {
      label: "Back Dates",
      name: "back_dates",
      type: "select",
      required: false,
      options: [
        { value: 0, label: "Not Allowed" },
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
        { value: 6, label: "6" },
        { value: 7, label: "7" },
        { value: 8, label: "8" },
        { value: 9, label: "9" },
        { value: 10, label: "10" },
      ],
    },
    {
      label: "Alert Prior Days",
      name: "alert_prior_days",
      type: "text",
      required: false,
    },
    {
      label: "Legal Due Date ",
      name: "legal_due_date",
      type: "date",
      required: false,
    },
    {
      label: "Unit Head Due Date ",
      name: "unit_head_due_date",
      type: "date",
      required: false,
    },
    {
      label: "Function Head Due Date",
      name: "function_head_due_date",
      type: "date",
      required: false,
    },
    {
      label: "Reviewer Due Date",
      name: "evaluator_due_date",
      type: "date",
      required: false,
    },
    {
      label: "Performer Due Date",
      name: "executor_due_date",
      type: "date",
      required: false,
    },
  ];

  const configalertformFields = [
    {
      label: "First Alert",
      name: "first_alert",
      type: "date",
      required: false,
    },
    {
      label: "Second Alert",
      name: "second_alert",
      type: "date",
      required: false,
    },
    {
      label: "Third Alert",
      name: "third_alert",
      type: "date",
      required: false,
    },
  ];

  const handleCheckboxSelection = useCallback(() => {
    // console.log("gridapi:", gridApi);
    console.log("gridApiRef", gridApiRef);

    if (gridApiRef) {
      const selectedNodes = gridApiRef.current.getSelectedNodes();

      if (selectedNodes.length > 1) {
        const newidsArray = selectedNodes.map((node) => node.data.id);
        setIdsArray(newidsArray);
        console.log("idsArray:", newidsArray);
        setShowCheckboxActivity(true);
      } else {
        setShowCheckboxActivity(false);
      }
    }
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <>
      {/* <ExpandSearchComponent
        title="Activate Activity"
        slug="/activity-mapping"
        page="Filter"
        formFields={formFieldsForActivityMapping}
      /> */}

      <AgGridTableComponent
        slug="/activity-mapping/activate_activity"
        page="Activities"
        filter="?page=&pageSize=-1&filterName="
        api="/api/activity-configuration"
        listname="activity_configurationFlatList"
        customColumns={customColumns}
        checkBox={true}
        checkboxActivity={showCheckboxActivity}
        edit="Edit"
        activateActionBtn="Activate"
        xs
        propOnGridReady={(api) => {
          // console.log("Grid API is ready:", api);
          gridApiRef.current = api;
          //setGridApi(api);
        }}
        onEditClick={(id) => {
          const updatedApi = `/api/activity-configuration/${id}`;
          setApi(updatedApi);
          setShowModal(true);
        }}
        customCheckboxMethod={handleCheckboxSelection}
        rowClickSelection={true}
      />
      <ModalForm
        api="/api/activity-configuration"
        filter="?page=&pageSize=-1&filterName="
        slug="/activity_mapping/activate_activity"
        page="Activate Activity"
        method="PUT"
        type="Edit"
        show={showModal}
        onHide={closeModal}
        endpoints={modalendpoints}
        initialFormData={initialmodalFormData}
        additionalFormFields={configalertformFields}
        formFields={modalFieldsForActivityMapping}
      />
    </>
  );
}
