"use client";

import React, { useState, useRef, useCallback } from "react";
import ExpandSearchComponent from "@/components/ExpandSearchComponent";
import AgGridTableComponent from "@/components/AgGridTableComponent";
import FormComponent from "@/components/FormComponent";
import { GridApi } from "ag-grid-community";
import Toast, { ToastType } from "@/components/Toast_old";

// import { law_category } from "../../utils/modelUtils";
interface FormData2 {
  business_unit_id: null;
  function_id: null;
  executor_id: null;
  evaluator_id: null;
  function_head_id: null;
  crs_activity_ids?: number[];
}

export default function AssignActivity() {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [response, setResponse] = useState(false);
  const [filterValue, setfilterValue] = useState(
    "?page=&pageSize=-1&filterName="
  );
  const toastRef = useRef<ToastType>();
  const [loading, setLoading] = useState(false);
  const [idsArray, setIdsArray] = useState<any[]>([]);

  const initialFormDataFilter = {
    country_id: null,
    is_federal: null,
    state_id: null,
    legislation: null,
    rule: null,
  };

  const initialFormData_2: FormData2 = {
    business_unit_id: null,
    function_id: null,
    executor_id: null,
    evaluator_id: null,
    function_head_id: null,
  };
  const [updatedFormData_2, setFormData_2] = useState(initialFormData_2);
  const api = "/api/activity-mapping";
  const method = "POST";

  const handleDataFetched = (data) => {
    if (data) {
      console.log(data);
      setfilterValue((prevFilterValue) => prevFilterValue + data);
    }
    console.log("filter value:", filterValue);
  };

  const handleCheckboxSelection = useCallback(() => {
    console.log("grid:", gridApi);
    if (gridApi) {
      const selectedNodes = gridApi.getSelectedNodes();
      if (selectedNodes.length > 0) {
        const newidsArray = selectedNodes.map((node) => node.data.id);
        setIdsArray(newidsArray);

        setFormData_2((prevFormData) => ({
          ...prevFormData,
          crs_activity_ids: idsArray,
        }));
        setResponse(true);
      } else {
        setResponse(false);
      }
    }
  }, [gridApi]);

  const endpoints_1 = [
    {
      url: "/api/crs-activity",
      name: "crs_activity",
      link: "crs_activityList",
      columnsToFetch: ["legislation", "rule"],
      bindToFields: true,
    },
  ];

  const endpoints_2 = [
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

  const customColumns = [
    { headerName: "Activity Code", field: "activity_code" },
    { headerName: "Country", field: "country" },
    { headerName: "State", field: "state" },
    { headerName: "Law Category", field: "law_category" },
    { headerName: "Legislation", field: "legislation" },
    { headerName: "Rule", field: "rule" },
    { headerName: "Title", field: "title" },
    { headerName: "Reference", field: "reference" },
    { headerName: "Who", field: "who" },
    { headerName: "When", field: "when" },
    { headerName: "Activity", field: "activity" },
    { headerName: "Procedure", field: "procedure" },
    { headerName: "Impact", field: "impact" },
    { headerName: "Frequency", field: "frequency" },
    { headerName: "Due Date", field: "legal_due_date" },
    { headerName: "Specific Due Date", field: "specific_due_date" },
  ];

  const formFieldsFilter = [
    {
      label: "Country :",
      name: "country_id",
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
      label: "Is Federal : ",
      name: "is_federal",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Yes" },
        { value: 2, label: "No" },
      ],
    },
    {
      label: "State :",
      name: "state_id",
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
  ];

  const formFields_2 = [
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
      required: true,
      api: true,
    },
    {
      label: "Reviewer",
      name: "evaluator_id",
      type: "select",
      required: false,
      api: true,
    },
    {
      label: "Function Head",
      name: "function_head_id",
      type: "select",
      required: false,
      api: true,
    },
  ];

  const handleButtonClick = (responseData) => {
    console.log(responseData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log("yes");
    try {
      const dataToSend = {
        ...updatedFormData_2,
        crs_activity_ids: idsArray,
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
      if (dataToSend["entity_id"]) {
        delete dataToSend["entity_id"];
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
  };
  return (
    <div>
      {/* <ExpandSearchComponent
        slug="/activity-mapping"
        filter="?page=&pageSize=-1&filterName="
        endpoints={endpoints_1}
        page="Filter"
        filterState={true}
        onButtonClick={handleButtonClick}
        formFields={formFieldsFilter}
        initialFormData={initialFormDataFilter}
        onFilterDataCallback={handleDataFetched}
      /> */}
      {response ? (
        <>
          <FormComponent
            slug="/activity-mapping"
            filter="?page=&pageSize=-1&filterName="
            endpoints={endpoints_2}
            page="Compliance Activity"
            type="Assign"
            formFields={formFields_2}
            onSubmit={handleSubmit}
            initialFormData={initialFormData_2}
            componentFormData={(data) => setFormData_2(data)}
          />
        </>
      ) : (
        <></>
      )}
      <AgGridTableComponent
        slug="/assign_activity"
        api="/api/crs-activity"
        page="Compliance Activity"
        filter={filterValue}
        checkBox={true}
        customColumns={customColumns}
        listname="crs_activityList"
        propOnGridReady={(api) => setGridApi(api)}
        customCheckboxMethod={handleCheckboxSelection}
      />

      <Toast ref={toastRef} />
    </div>
  );
}
function useEffect(arg0: () => void, arg1: undefined[]) {
  throw new Error("Function not implemented.");
}
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
