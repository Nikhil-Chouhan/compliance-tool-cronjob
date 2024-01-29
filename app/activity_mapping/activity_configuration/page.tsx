"use client";

import React, { useState, useRef, useCallback } from "react";
import ExpandSearchComponent from "@/components/ExpandSearchComponent";
import AgGridTableComponent from "@/components/AgGridTableComponent";
import FormComponent from "@/components/FormComponent";
import { GridApi } from "ag-grid-community";
import Toast, { ToastType } from "@/components/Toast_old";

import { law_category } from "@/app/utils/modelUtils";

interface ConfigFormData {
  activity_mapping_ids?: number[];
  impact_on_entity: null;
  impact_on_unit: null;
  impact: null;
  proof_required: null;
  historical: null;
  frequency: null;
  due_date_buffer: null;
  alert_prior_days: null;
  legal_due_date: String;
  unit_head_due_date: String;
  function_head_due_date: String;
  evaluator_due_date: String;
  executor_due_date: String;
  back_dates: null;
  activity_maker_checker: null;
  first_alert: null;
  second_alert: null;
  third_alert: null;
  status: number;
}
export default function ActivityConfiguration() {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const gridApiRef = useRef<GridApi | null>(null);

  const [showDiv, setShowDiv] = useState(false);
  const [response, setResponse] = useState(false);

  const toastRef = useRef<ToastType>();
  const [loading, setLoading] = useState(false);

  const api = "/api/activity-configuration";
  const method = "POST";
  let filterValue = "";
  const [idsArray, setIdsArray] = useState<any[]>([]);

  const today = new Date();
  const date = today.setDate(today.getDate());
  const defaultValue = new Date(date).toISOString().split("T")[0];

  const initialConfigFormData: ConfigFormData = {
    status: 0,
    impact_on_entity: null,
    impact_on_unit: null,
    impact: null,
    proof_required: null,
    historical: null,
    frequency: null,
    due_date_buffer: null,
    alert_prior_days: null,
    legal_due_date: defaultValue,
    unit_head_due_date: defaultValue,
    function_head_due_date: defaultValue,
    evaluator_due_date: defaultValue,
    executor_due_date: defaultValue,
    first_alert: null,
    second_alert: null,
    third_alert: null,
    back_dates: null,
    activity_maker_checker: null,
  };
  const [updatedConfigFormData, setConfigFormData] = useState(
    initialConfigFormData
  );

  const initialFilterFormData = {
    country_id: null,
    is_federal: null,
    state_id: null,
    legislation: null,
    rule: null,
    business_unit_id: null,
    function_id: null,
    executor_id: null,
    evaluator_id: null,
  };

  const endpoints_1 = [
    {
      url: "/api/crs-activity",
      name: "crs_activity",
      link: "crs_activityList",
      columnsToFetch: ["legislation", "rule"],
      bindToFields: true,
    },
    {
      url: "/api/entity",
      name: "Entity",
      link: "entityList",
    },
    {
      url: "/api/function-department",
      name: "Function",
      link: "function_departmentList",
    },
    {
      url: "/api/user",
      name: "filerUserRoles",
      link: "userList",
    },
  ];

  const formFieldsFilter = [
    {
      label: "Country ",
      name: "countryy_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "India" },
        { value: 2, label: "Pakistan " },
        { value: 3, label: "Nepal" },
        { value: 4, label: "Sri Lanka" },
      ],
    },
    {
      label: "Is Federal ",
      name: "is_federal",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Yes" },
        { value: 2, label: "No" },
      ],
    },
    {
      label: "State ",
      name: "state",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Maharashtra" },
        { value: 2, label: "Uttar Pradesh " },
        { value: 3, label: "Gujrat" },
        { value: 4, label: "Madhya Pradesh" },
      ],
    },
    // {
    //   label: "Category of Law ",
    //   name: "category_of_law",
    //   type: "select",

    //   required: false,
    //   options: Object.keys(law_category).map((key) => ({
    //     value: key,
    //     label: law_category[key],
    //   })),
    // },
    {
      label: "Legislation",
      name: "legislation",
      type: "select",
      required: false,
      api_name: "crs_activity",
    },
    {
      label: "Rule",
      name: "rule",
      type: "select",
      api_name: "crs_activity",
      required: false,
    },
    {
      label: "Entity",
      name: "entity_id",
      type: "select",
      required: false,
      api: true,
    },
    {
      label: "Business Unit",
      name: "business_unit_id",
      type: "select",
      required: false,
      api: true,
    },
    {
      label: "Function",
      name: "function_id",
      type: "select",
      required: false,
      api: true,
    },

    {
      label: "Performer",
      name: "executor_id",
      type: "select",
      required: false,
      api: true,
    },
    {
      label: "Reviewer",
      name: "evaluator_id",
      type: "select",
      required: false,
      api: true,
    },
  ];

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
      headerName: "Country",
      field: "country",
    },
    {
      headerName: "State",
      field: "state",
    },
    {
      headerName: "Law Category",
      field: "law_category",
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
      headerName: "Impact On Unit",
      field: "impact_on_unit",
    },
    {
      headerName: "Impact On Organization",
      field: "impact_on_organization",
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

  const endpoints = [
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

  const configformFields = [
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
      label: "Proof Required (Document)",
      name: "proof_required",
      type: "select",
      required: false,
      options: [
        { value: 1, label: "Mandatory" },
        { value: 0, label: "Non-mandatory" },
      ],
    },
    {
      label: "Historical ",
      name: "historical",
      type: "select",
      required: false,
      options: [
        { value: 1, label: "Yes" },
        { value: 0, label: "No" },
      ],
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
      label: "Due Date Buffer",
      name: "due_date_buffer",
      type: "number",
      required: false,
    },
    {
      label: "Prior Days For Alerts",
      name: "alert_prior_days",
      type: "number",
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
    {
      label: "Activity Maker Checker",
      name: "activity_maker_checker",
      type: "select",
      required: true,
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

  const handleDataFetched = (data) => {
    if (data) {
      console.log("data:", data);
      filterValue = "?page=&pageSize=-1&filterName=" + data;
      // setfilterValue((prevFilterValue) => prevFilterValue + data);
    }
    console.log("filter value:", filterValue);
  };

  const handleCheckboxSelection = useCallback(() => {
    // console.log("gridapi:", gridApi);
    console.log("gridApiRef", gridApiRef);

    if (gridApiRef) {
      const selectedNodes = gridApiRef.current.getSelectedNodes();

      if (selectedNodes.length > 0) {
        const newidsArray = selectedNodes.map((node) => node.data.id);
        setIdsArray(newidsArray);
        setShowDiv(true);
        console.log("idsArray:", idsArray);

        setConfigFormData((prevFormData) => ({
          ...prevFormData,
          activity_mapping_ids: idsArray,
        }));
      } else {
        setShowDiv(false);
      }
    }
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);

      try {
        console.log("updatedConfigFormData:", updatedConfigFormData);

        const dataToSend = {
          ...updatedConfigFormData,
          legal_due_date: updatedConfigFormData.legal_due_date
            ? new Date(updatedConfigFormData.legal_due_date).toISOString()
            : null,
          unit_head_due_date: updatedConfigFormData.unit_head_due_date
            ? new Date(updatedConfigFormData.unit_head_due_date).toISOString()
            : null,
          function_head_due_date: updatedConfigFormData.function_head_due_date
            ? new Date(
                updatedConfigFormData.function_head_due_date
              ).toISOString()
            : null,
          evaluator_due_date: updatedConfigFormData.evaluator_due_date
            ? new Date(updatedConfigFormData.evaluator_due_date).toISOString()
            : null,
          executor_due_date: updatedConfigFormData.executor_due_date
            ? new Date(updatedConfigFormData.executor_due_date).toISOString()
            : null,
          first_alert: updatedConfigFormData.first_alert
            ? new Date(updatedConfigFormData.first_alert).toISOString()
            : null,
          second_alert: updatedConfigFormData.second_alert
            ? new Date(updatedConfigFormData.second_alert).toISOString()
            : null,
          third_alert: updatedConfigFormData.third_alert
            ? new Date(updatedConfigFormData.third_alert).toISOString()
            : null,
          activity_mapping_ids: idsArray,
        };

        console.log("Data to Send:", dataToSend);

        for (const key in dataToSend) {
          if (
            dataToSend.hasOwnProperty(key) &&
            typeof dataToSend[key] === "string"
          ) {
            dataToSend[key] = dataToSend[key].trim().split(/ +/).join(" ");
          }
        }

        const response = await fetch(`${api}`, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
          setLoading(false);
          toastRef.current.show("Success", "Entry Saved Successfully");
          // router.push(slug);
        } else {
          setLoading(false);
          // console.log(response);
          const errorResponse = await response.json();
          const errorMessage = errorResponse.response;
          toastRef.current.show("Error", errorMessage);
        }
      } catch (error) {
        console.log("Error:", error);
        setLoading(false);
        toastRef.current.show("Error", "An error occured while saving Entry");
      }
    },
    [idsArray, updatedConfigFormData, setLoading, toastRef]
  );

  return (
    <div>
      {/* <ExpandSearchComponent
        slug="/activity-mapping"
        filter="?page=&pageSize=-1&filterName="
        endpoints={endpoints_1}
        page="Filter"
        filterState={true}
        formFields={formFieldsFilter}
        initialFormData={initialFilterFormData}
        onFilterDataCallback={handleDataFetched}
        onButtonClick={handleButtonClick}
      /> */}

      {showDiv && (
        <div>
          <FormComponent
            slug="/config"
            filter="?page=&pageSize=-1&filterName="
            type="Save"
            page="Configure Activity"
            initialFormData={initialConfigFormData}
            endpoints={endpoints}
            formFields={configformFields}
            additionalFormFields={configalertformFields}
            onSubmit={handleSubmit}
            componentFormData={(data) => setConfigFormData(data)}
            segregate="Extra Alerts"
          />
        </div>
      )}
      <AgGridTableComponent
        slug="/activity-mapping/activity-configuration"
        api="/api/activity-mapping"
        page="Activity Configuration"
        filter="?page=&pageSize=-1&filterName="
        checkBox={true}
        customColumns={customColumns}
        listname="activity_mappingFlatList"
        propOnGridReady={(api) => {
          // console.log("Grid API is ready:", api);
          gridApiRef.current = api;
          //setGridApi(api);
        }}
        customCheckboxMethod={handleCheckboxSelection}
        //rowClickSelection={true}
      />
      <Toast ref={toastRef} />
    </div>
  );
}
