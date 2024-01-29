"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Popup from 'reactjs-popup';
import DownloadComponent from "@/components/DownloadComponent";
import AgGridTableComponent from "@/components/AgGridTableComponent";
import html2canvas from 'html2canvas';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Pie, Bar } from "react-chartjs-2";
import { Button, Modal } from "react-bootstrap";
import Image from "next/image";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type DashboardCounts = {
  activityHistoryLegalStatusCount: {
    CompliedCount: number;
    EscalatedCount: number;
    Non_CompliedCount: number;
    DelayedCount: number;
    Delayed_ReportedCount: number;
    Approval_PendingCount: number;
    Re_AssignedCount: number;
  };
  impactResult: {
    Super_CriticalCount: number;
    CriticalCount: number;
    HighCount: number;
    ModerateCount: number;
    LowCount: number;
  };
};

// Need to optimize this function
export default function Dashboard() {
  const [dashboardCounts, setDashboardCounts] = useState<DashboardCounts | null>(null);
  const [dashboardEntityBarCounts, setDashboardEntityBarCounts] = useState(null);
  const [dashboardUnitBarCounts, setDashboardUnitBarCounts] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [dashboardFunctionBarCounts, setDashboardFunctionBarCounts] = useState(null);
  const [agGridSelectedLegalStatus, setAgGridSelectedLegalStatus] = useState(null);
  const [agGridSelectedEntity, setAgGridSelectedEntity] = useState(null);
  const [agGridSelectedUnit, setAgGridSelectedUnit] = useState(null);
  const [agGridSelectedFunction, setAgGridSelectedFunction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [refreshGrid, setRefreshGrid] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const gridApiRef = useRef(null);

  const [selectedOption, setSelectedOption] = useState("Overall");

  const overallData = {
    labels: [
      "Complied",
      "Escalated",
      "Non-Complied",
      "Delayed",
      "Delayed Reported",
      "Approval Pending",
      "Re-Assigned",
    ],
    datasets: [
      {
        data: [
          dashboardCounts?.activityHistoryLegalStatusCount.CompliedCount || 0,
          dashboardCounts?.activityHistoryLegalStatusCount.EscalatedCount || 0,
          dashboardCounts?.activityHistoryLegalStatusCount.Non_CompliedCount ||
            0,
          dashboardCounts?.activityHistoryLegalStatusCount.DelayedCount || 0,
          dashboardCounts?.activityHistoryLegalStatusCount
            .Delayed_ReportedCount || 0,
          dashboardCounts?.activityHistoryLegalStatusCount
            .Approval_PendingCount || 0,
          dashboardCounts?.activityHistoryLegalStatusCount.Re_AssignedCount ||
          0,
        ],
        backgroundColor: [
          "#00bf00",
          "hsl(43, 84%, 65%)",
          "#FF0000",
          "#9400d3",
          "#0000ff",
          "hsl(195, 74%, 62%)",
          "#ff7f00",
        ],
        borderColor: [
          "#00bf00",
          "hsl(43, 84%, 65%)",
          "#FF0000",
          "#9400d3",
          "#0000ff",
          "hsl(195, 74%, 62%)",
          "#ff7f00",
        ],
        borderWidth: 1,
      },
    ],
  };

  const riskData = {
    labels: ["Super Critical", "Critical", "High", "Moderate", "Low"],
    datasets: [
      {
        data: [
          dashboardCounts
            ? dashboardCounts?.impactResult.Super_CriticalCount
            : 0,
          dashboardCounts ? dashboardCounts?.impactResult.CriticalCount : 0,
          dashboardCounts ? dashboardCounts?.impactResult.HighCount : 0,
          dashboardCounts ? dashboardCounts?.impactResult.ModerateCount : 0,
          dashboardCounts ? dashboardCounts?.impactResult.LowCount : 0,
        ],
        backgroundColor: [
          "#ce141e",
          "#ff0000",
          "#fb6363",
          "#f89191",
          "#fcb3b3",
        ],
        borderColor: ["#ce141e", "#ff0000", "#fb6363", "#f89191", "#fcb3b3"],
        borderWidth: 1,
      },
    ],
  };

  const legalEntityData = {
    labels: dashboardEntityBarCounts?.entities.map(entity => entity.name) || [],
    datasets: [
      {
        label: "Complied",
        data: dashboardEntityBarCounts?.entityLegalStatusCounts.map(entityData =>
          entityData.statusCounts["Complied"] || 0
        ),
        backgroundColor: "#00bf00",
      },
      {
        label: "Escalated",
        data:dashboardEntityBarCounts?.entityLegalStatusCounts.map(entityData =>
          entityData.statusCounts["Escalated"] || 0
        ),
        backgroundColor: "hsl(43, 84%, 65%)",
      },
      {
        label: "Non-Complied",
        data:dashboardEntityBarCounts?.entityLegalStatusCounts.map(entityData =>
          entityData.statusCounts["Non_Complied"] || 0
        ),
        backgroundColor: "#FF0000",
      },
      {
        label: "Delayed",
        data:dashboardEntityBarCounts?.entityLegalStatusCounts.map(entityData =>
          entityData.statusCounts["Delayed"] || 0
        ),
        backgroundColor: "#9400d3",
      },
      {
        label: "Delayed Reported",
        data:dashboardEntityBarCounts?.entityLegalStatusCounts.map(entityData =>
          entityData.statusCounts["Delayed_Reported"] || 0
        ),
        backgroundColor: "#0000ff",
      },
      {
        label: "Approval Pending",
        data:dashboardEntityBarCounts?.entityLegalStatusCounts.map(entityData =>
          entityData.statusCounts["Approval_Pending"] || 0
        ),
        backgroundColor: "hsl(195, 74%, 62%)",
      },
      {
        label: "Re-Assigned",
        data:dashboardEntityBarCounts?.entityLegalStatusCounts.map(entityData =>
          entityData.statusCounts["Re_Assigned"] || 0
        ),
        backgroundColor: "#ff7f00",
      },
    ],
  };

  const unitData = {
    labels: dashboardUnitBarCounts?.businessUnit.map(unit => unit.name) || [],
    datasets: [
      {
        label: "Complied",
        data: dashboardUnitBarCounts?.businessUnitStatusCounts.map(unitData =>
          unitData.statusCounts["Complied"] || 0
        ),
        backgroundColor: "#00bf00",
      },
      {
        label: "Escalated",
        data:dashboardUnitBarCounts?.businessUnitStatusCounts.map(unitData =>
          unitData.statusCounts["Escalated"] || 0
        ),
        backgroundColor: "hsl(43, 84%, 65%)",
      },
      {
        label: "Non-Complied",
        data:dashboardUnitBarCounts?.businessUnitStatusCounts.map(unitData =>
          unitData.statusCounts["Non_Complied"] || 0
        ),
        backgroundColor: "#FF0000",
      },
      {
        label: "Delayed",
        data:dashboardUnitBarCounts?.businessUnitStatusCounts.map(unitData =>
          unitData.statusCounts["Delayed"] || 0
        ),
        backgroundColor: "#9400d3",
      },
      {
        label: "Delayed Reported",
        data:dashboardUnitBarCounts?.businessUnitStatusCounts.map(unitData =>
          unitData.statusCounts["Delayed_Reported"] || 0
        ),
        backgroundColor: "#0000ff",
      },
      {
        label: "Approval Pending",
        data:dashboardUnitBarCounts?.businessUnitStatusCounts.map(unitData =>
          unitData.statusCounts["Approval_Pending"] || 0
        ),
        backgroundColor: "hsl(195, 74%, 62%)",
      },
      {
        label: "Re-Assigned",
        data:dashboardUnitBarCounts?.businessUnitStatusCounts.map(unitData =>
          unitData.statusCounts["Re_Assigned"] || 0
        ),
        backgroundColor: "#ff7f00",
      },
    ],
  };

  const functionData = {
    labels:dashboardFunctionBarCounts?.functionDepartmentList.map(department => department.name) || [],
    datasets: [
      {
        label: "Complied",
        data: dashboardFunctionBarCounts?.functionDepartmentStatusCounts.map(departmentData =>
          departmentData.statusCounts["Complied"] || 0
        ),
        backgroundColor: "#00bf00",
      },
      {
        label: "Escalated",
        data: dashboardFunctionBarCounts?.functionDepartmentStatusCounts.map(departmentData =>
          departmentData.statusCounts["Escalated"] || 0
        ),
        backgroundColor: "hsl(43, 84%, 65%)",
      },
      {
        label: "Non-Complied",
        data: dashboardFunctionBarCounts?.functionDepartmentStatusCounts.map(departmentData =>
          departmentData.statusCounts["Non_Complied"] || 0
        ),
        backgroundColor: "#FF0000",
      },
      {
        label: "Delayed",
        data: dashboardFunctionBarCounts?.functionDepartmentStatusCounts.map(departmentData =>
          departmentData.statusCounts["Delayed"] || 0
        ),
        backgroundColor: "#9400d3",
      },
      {
        label: "Delayed Reported",
        data: dashboardFunctionBarCounts?.functionDepartmentStatusCounts.map(departmentData =>
          departmentData.statusCounts["Delayed_Reported"] || 0
        ),
        backgroundColor: "#0000ff",
      },
      {
        label: "Approval Pending",
        data: dashboardFunctionBarCounts?.functionDepartmentStatusCounts.map(departmentData =>
          departmentData.statusCounts["Approval_Pending"] || 0
        ),
        backgroundColor: "hsl(195, 74%, 62%)",
      },
      {
        label: "Re-Assigned",
        data: dashboardFunctionBarCounts?.functionDepartmentStatusCounts.map(departmentData =>
          departmentData.statusCounts["Re_Assigned"] || 0
        ),
        backgroundColor: "#ff7f00",
      },
    ],
  };

  const unitOptions = {
    responsive: true,

    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  // const regionData = {
  //   labels: ["January", "February", "March", "April", "May", "June", "July"],
  //   datasets: [
  //     {
  //       label: "Dataset 1",
  //       data: [752, 421, 635, 189, 874, 567, 321],
  //       borderColor: "rgb(255, 99, 132)",
  //       backgroundColor: "rgba(255, 99, 132, 0.5)",
  //     },
  //     {
  //       label: "Dataset 2",
  //       data: [456, 789, 234, 567, 890, 123, 678],
  //       borderColor: "rgb(53, 162, 235)",
  //       backgroundColor: "rgba(53, 162, 235, 0.5)",
  //     },
  //   ],
  // };

  // const stateData = {
  //   labels: ["January", "February", "March", "April", "May", "June", "July"],
  //   datasets: [
  //     {
  //       label: "Dataset 1",
  //       data: [325, 789, 456, 123, 567, 890, 234],
  //       backgroundColor: "rgb(255, 99, 132)",
  //     },
  //     {
  //       label: "Dataset 2",
  //       data: [325, 789, 456, 123, 567, 890, 234],
  //       backgroundColor: "rgb(75, 192, 192)",
  //     },
  //     {
  //       label: "Dataset 3",
  //       data: [456, 789, 234, 567, 890, 123, 678],
  //       backgroundColor: "rgb(53, 162, 235)",
  //     },
  //   ],
  // };

  // const legalEntityOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "top" as const,
  //     },
  //     title: {
  //       display: true,
  //       text: "Legal Entity",
  //     },
  //   },
  // };

  // const regionOptions = {
  //   indexAxis: "y" as const,
  //   elements: {
  //      : {
  //       borderWidth: 2,
  //     },
  //   },
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "right" as const,
  //     },
  //     title: {
  //       display: true,
  //       text: "Chart.js Horizontal Bar Chart",
  //     },
  //   },
  // };

  // const stateOptions = {
  //   plugins: {
  //     title: {
  //       display: true,
  //       text: "Chart.js Bar Chart - Stacked",
  //     },
  //   },
  //   responsive: true,
  //   scales: {
  //     x: {
  //       stacked: true,
  //     },
  //     y: {
  //       stacked: true,
  //     },
  //   },
  // };

  // const functionOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "top" as const,
  //     },
  //     title: {
  //       display: true,
  //       text: "Chart.js Bar Chart",
  //     },
  //   },
  // };

  const handleButtonClick = (option) => {
    setSelectedOption(option);
  };

  const getDataForGraph = () => {
    switch (selectedOption) {
      case "Overall":
        return overallData;
      case "Legal Entity":
        return legalEntityData;
      // case "Region":
      //   return regionData;
      // case "State":
      //   return stateData;
      case "Unit / Location":
        return unitData;
      case "Function":
        return functionData;
      default:
        return overallData;
    }
  };

  const getGraphOption = () => {
    switch (selectedOption) {
      case "Legal Entity":
        return unitOptions;
      // case "Region":
      //   return unitOptions;
      // case "State":
      //   return unitOptions;
      case "Unit / Location":
        return unitOptions;
      case "Function":
        return unitOptions;
      default:
        return unitOptions;
    }
  };

  const generateColumnData = (additionalColumn = {}) =>
    [
      { headerName: "Sr No", field: "sr_no" },
      additionalColumn.header
        ? {
            headerName: additionalColumn.header,
            field: additionalColumn.field,
          }
        : null,
      { headerName: "Complied", field: "Complied" },
      { headerName: "Escalated", field: "Escalated" },
      { headerName: "Non Complied", field: "Non_Complied" },
      { headerName: "Delayed", field: "Delayed" },
      { headerName: "Delayed Reported", field: "Delayed_Reported" },
      { headerName: "Approval Pending", field: "Approval_Pending" },
      { headerName: "Re-Assigned", field: "Re_Assigned" },
    ].filter(Boolean);

  const overallColData = generateColumnData();
  const entityColData = generateColumnData({
    header: "Entity",
    field: "entity",
  });
  const unitColData = generateColumnData({ header: "Unit", field: "unit" });
  const functionColData = generateColumnData({
    header: "Function Name",
    field: "function_name",
  });

  const regionColData = generateColumnData({
    header: "Function Name",
    field: "function_name",
  });

  const stateColData = generateColumnData({
    header: "Function Name",
    field: "function_name",
  });

  const overallrowData = [
    {
      sr_no: 1,
      Complied: dashboardCounts?.activityHistoryLegalStatusCount.CompliedCount || 0,
      Escalated: dashboardCounts?.activityHistoryLegalStatusCount.EscalatedCount || 0,
      Non_Complied:dashboardCounts?.activityHistoryLegalStatusCount.Non_CompliedCount || 0,
      Delayed:dashboardCounts?.activityHistoryLegalStatusCount.DelayedCount || 0,
      Delayed_Reported:dashboardCounts?.activityHistoryLegalStatusCount.Delayed_ReportedCount || 0,
      Approval_Pending:dashboardCounts?.activityHistoryLegalStatusCount.Approval_PendingCount || 0,
      Re_Assigned:dashboardCounts?.activityHistoryLegalStatusCount.Re_AssignedCount || 0,
    },
  ];

  const entityrowData = dashboardEntityBarCounts?.entityLegalStatusCounts.map((entityStatus) => ({
    sr_no: dashboardEntityBarCounts?.entityLegalStatusCounts.indexOf(entityStatus) + 1,
    entity: entityStatus.entityName,
    Complied: entityStatus.statusCounts.Complied || 0,
    Escalated: entityStatus.statusCounts.Escalated || 0,
    Non_Complied: entityStatus.statusCounts.Non_Complied || 0,
    Delayed: entityStatus.statusCounts.Delayed || 0,
    Delayed_Reported: entityStatus.statusCounts.Delayed_Reported || 0,
    Approval_Pending: entityStatus.statusCounts.Approval_Pending || 0,
    Re_Assigned: entityStatus.statusCounts.Re_Assigned || 0,
  }));

  const unitrowData = dashboardUnitBarCounts?.businessUnitStatusCounts.map((unitStatus) => ({
    sr_no: dashboardUnitBarCounts?.businessUnitStatusCounts.indexOf(unitStatus) + 1,
    unit: unitStatus.businessUnitName,
    Complied: unitStatus.statusCounts.Complied || 0,
    Escalated: unitStatus.statusCounts.Escalated || 0,
    Non_Complied: unitStatus.statusCounts.Non_Complied || 0,
    Delayed: unitStatus.statusCounts.Delayed || 0,
    Delayed_Reported: unitStatus.statusCounts.Delayed_Reported || 0,
    Approval_Pending: unitStatus.statusCounts.Approval_Pending || 0,
    Re_Assigned: unitStatus.statusCounts.Re_Assigned || 0,
  }));
  
  const functionrowData = dashboardFunctionBarCounts?.functionDepartmentStatusCounts.map((functionStatus) => ({
    sr_no: dashboardFunctionBarCounts?.functionDepartmentStatusCounts.indexOf(functionStatus) + 1,
    function_name: functionStatus.functionDepartmentName,
    Complied: functionStatus.statusCounts.Complied || 0,
    Escalated: functionStatus.statusCounts.Escalated || 0,
    Non_Complied: functionStatus.statusCounts.Non_Complied || 0,
    Delayed: functionStatus.statusCounts.Delayed || 0,
    Delayed_Reported: functionStatus.statusCounts.Delayed_Reported || 0,
    Approval_Pending: functionStatus.statusCounts.Approval_Pending || 0,
    Re_Assigned: functionStatus.statusCounts.Re_Assigned || 0,
  }));

  const regionrowData = [
    {
      sr_no: 1,
      function_name: "test",
      Complied: 2,
      posing: 4,
      Non_Complied: 6,
      Delayed: 8,
      Delayed_Reported: 10,
      wfa: 12,
      re_opened: 15,
    },
  ];

  const staterowData = [
    {
      sr_no: 1,
      function_name: "test",
      Complied: 2,
      posing: 4,
      Non_Complied: 6,
      Delayed: 8,
      Delayed_Reported: 10,
      wfa: 12,
      re_opened: 15,
    },
  ];

  const getHeight = () => {
    switch (selectedOption) {
      case "Overall":
        return "250px";
      default:
        return "550px";
    }
  };

  const getColData = () => {
    switch (selectedOption) {
      case "Overall":
        return overallColData;
      case "Legal Entity":
        return entityColData;
      case "Region":
        return regionColData;
      case "State":
        return stateColData;
      case "Unit / Location":
        return unitColData;
      case "Function":
        return functionColData;
      default:
        return overallColData;
    }
  };

  const getRowData = () => {
    switch (selectedOption) {
      case "Overall":
        return overallrowData;
      case "Legal Entity":
        return entityrowData;
      case "Region":
        return regionrowData;
      case "State":
        return staterowData;
      case "Unit / Location":
        return unitrowData;
      case "Function":
        return functionrowData;
      default:
        return overallrowData;
    }
  };

  const customColumns = [
    { headerName: "ID", field: "id" },
    { headerName: "Activity Code", field: "activity_code" },
    { headerName: "Title", field: "title" },
    { headerName: "Legislation", field: "legislation" },
    { headerName: "Rule", field: "rule" },
    { headerName: "Reference", field: "reference" },
    { headerName: "Who", field: "who" },
    { headerName: "When", field: "when" },
    { headerName: " Activity", field: "activity" },
    { headerName: "Procedure", field: "procedure" },
    { headerName: "Description", field: "description" },
    { headerName: "Frequency", field: "frequency" },
    { headerName: "Form No", field: "form_no" },
    { headerName: "Compliance Type", field: "compliance_type" },
    { headerName: "Authority", field: "authority" },
    { headerName: "Exemption Criteria", field: "exemption_criteria" },
    { headerName: "Event", field: "event" },
    { headerName: "Event Sub", field: "entity_sub" },
    { headerName: "Event Question", field: "entity_question" },
    { headerName: "Implications", field: "implications" },
    { headerName: "Imprison Duration", field: "imprison_duration" },
    { headerName: "Imprison Applies_to", field: "imprison_applies_to" },
    { headerName: "Currency", field: "currency" },
    { headerName: "Fine", field: "fine" },
    { headerName: "Fine Per Day", field: "fine_per_day" },
    { headerName: "Impact", field: "impact" },
    { headerName: "Impact on Unit", field: "impact_on_unit" },
    { headerName: "Impact on Organsation", field: "impact_on_organization" },
    { headerName: "Reference Link", field: "reference_link" },
    { headerName: "Sources", field: "sources" },
    { headerName: "Documents", field: "documents" },
    { headerName: "Status", field: "status" },
    { headerName: "Created At", field: "created_at" },
    { headerName: "Updated At", field: "updated_at" },
    { headerName: "Deleted At", field: "deleted_at" },
    { headerName: "Deleted", field: "deleted" },
  ];

  const getDataForGrid = () => {
    if(agGridSelectedLegalStatus){
      if(agGridSelectedLegalStatus && agGridSelectedEntity){
        return `/api/dashboard-aggrid?gridLegalStatusActivity=${agGridSelectedLegalStatus}&gridEntity=${agGridSelectedEntity}&filterStartDate=${fromDate}&filterEndDate=${toDate}`
      } else if(agGridSelectedLegalStatus && selectedUnit && agGridSelectedFunction){
        // console.log("selectedUnit------------>>>>>>>>>>" ,selectedUnit);
        // console.log("agGridSelectedFunction------------>>>>>>>>>>" ,agGridSelectedFunction);
        return `/api/dashboard-aggrid?gridLegalStatusActivity=${agGridSelectedLegalStatus}&gridUnit=${selectedUnit}&gridFunction=${agGridSelectedFunction}&filterStartDate=${fromDate}&filterEndDate=${toDate}`
      } else if(agGridSelectedLegalStatus && agGridSelectedUnit){
        return `/api/dashboard-aggrid?gridLegalStatusActivity=${agGridSelectedLegalStatus}&gridUnit=${agGridSelectedUnit}&filterStartDate=${fromDate}&filterEndDate=${toDate}`
      }else{
        return `/api/dashboard-aggrid?gridLegalStatusActivity=${agGridSelectedLegalStatus}&filterStartDate=${fromDate}&filterEndDate=${toDate}`
      }
   } 
  };

  const staticData = [
    {
      client_task_id: "D03040000273",
      entity: "ABC Mining Pvt Ltd",
      unit: "Corporate Office - Mumbai",
      function: "Secretarial",
      legislation: "The Customs Act, 1962",
      rule: "The Special Economic Zones (Customs Procedures) Regulations, 2003	",
      reference: "Rule 13(2)",
      who: "Zone Unit",
      when: "On export of goods by special economic zone unit",
      activity:
        "Export goods by post subject to the normal procedure applicable to export through Foreign Post Office",
      impact: "Low",
      executor: "Regucheck user",
      legal_due_date: "08-11-2023	",
      ttrn_id: "12916",
      comments: "Complied",
      event_not_occured: "Open",
    },
  ];

  const handleExport = () => {
    const graphContainer = document.getElementById('graph-container');
    if (graphContainer) {
      html2canvas(graphContainer).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'graph.png';
        link.click();
      });
    }
  };

  const handleRowClick = useCallback(() => {
    setShowModal(true);
  }, []);
  
  const handleCellClick = (event) => {
    const selectedStatusCellValue = event.colDef.field
    const selectedEntityCellValue = event.data.entity
    const selectedUnitCellValue = event.data.unit
    const selectedFunctionCellValue = event.data.function_name 
    setAgGridSelectedLegalStatus(selectedStatusCellValue)
    setAgGridSelectedEntity(selectedEntityCellValue)
    setAgGridSelectedUnit(selectedUnitCellValue)
    setAgGridSelectedFunction(selectedFunctionCellValue)
  };

  const handleEntityChange = (event) => {
    setSelectedEntity(event.target.value);
  };

  const handleUnitChange = (event) => {
    setSelectedUnit(event.target.value);
  };

  const handleDateFilter = () => {
    const fromDateValue = (document.getElementById('fromDateInput') as HTMLInputElement)?.value
    const toDateValue =(document.getElementById('toDateInput') as HTMLInputElement)?.value
    setFromDate(fromDateValue)
    setToDate(toDateValue)
    document.getElementById('fromDateInput').value = ''
    document.getElementById('toDateInput').value = ''
  }
  const handleResetDateFilter = () => {
    setFromDate("")
    setToDate("")
  };

  useEffect(() => {
    fetch(`/api/dashboard-count?filterStartDate=${fromDate}&filterEndDate=${toDate}`)
      .then((response) => response.json())
      .then((data) => {
        setDashboardCounts(data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard counts:", error);
      });

    fetch(`/api/dashboard-entity-count?filterStartDate=${fromDate}&filterEndDate=${toDate}`)
      .then((response) => response.json())
      .then((data) => {
        setDashboardEntityBarCounts(data);
        setSelectedEntity(data.entities[0].name);
      })
      .catch((error) => {
        console.error("Error fetching dashboard counts:", error);
      });
  }, [ toDate ]);

  useEffect(() => {
    fetch(`/api/dashboard-unit-count?filterEntity=${selectedEntity}&filterStartDate=${fromDate}&filterEndDate=${toDate}`)
      .then((response) => response.json())
      .then((data) => {
        setDashboardUnitBarCounts(data);
        setSelectedUnit(data.businessUnit[0].name);
      })
      .catch((error) => {
        console.error("Error fetching dashboard counts:", error);
      });
  }, [selectedEntity, selectedOption , toDate]);

  useEffect(() => {
    fetch(
      `/api/dashboard-function-count?filterEntity=${selectedEntity}&filterUnit=${selectedUnit}&filterStartDate=${fromDate}&filterEndDate=${toDate}`)
      .then((response) => response.json())
      .then((data) => {
        setDashboardFunctionBarCounts(data);
        // console.log("fetching data here ---->" , data)
      })
      .catch((error) => {
        console.error("Error fetching dashboard counts:", error);
      });
  }, [selectedEntity, selectedUnit , toDate]);

  useEffect(() => {
    const delay = 900;
    const timeoutId = setTimeout(() => {
      setRefreshGrid((prevRefreshGrid) => !prevRefreshGrid);
    }, delay);
    return () => clearTimeout(timeoutId);
  }, [selectedOption, selectedEntity, selectedUnit , dashboardEntityBarCounts]);

  return (
    <div className="pb-4">
      <div className="container-fluid">
        <div className="custom-dashboard container">
          <div className="row justify-content-center">
            {/* <div className="col-xl-3 col-sm-6 col-md-12 mb-4 "> */}
            <div className="col-md-3 mb-4">
              <div className="card green">
                <div className="card-icon">
                  {" "}
                  <Image
                    className="logo "
                    src="/checked.png"
                    alt="compliance"
                    width="40"
                    height="40"
                  />
                </div>
                <div className="card-info">
                  <div className="card-hrs-wrapper">
                    <div className="card-hrs text-green">
                      {dashboardCounts
                        ? dashboardCounts.activityHistoryLegalStatusCount
                            .CompliedCount
                        : "0"}
                    </div>
                    <div className="card-prev text-green">Complied</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card yellow">
                <div className="card-icon">
                  <Image
                    className="logo "
                    src="/exclamation-bulb.png"
                    alt="compliance"
                    width="40"
                    height="40"
                  />
                </div>
                <div className="card-info">
                  <div className="card-hrs-wrapper">
                    <div className="card-hrs text-warning">
                      {dashboardCounts
                        ? dashboardCounts.activityHistoryLegalStatusCount
                            .EscalatedCount
                        : "0"}
                    </div>
                    <div className="card-prev text-warning">Escalated</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card red">
                <div className="card-icon">
                  <Image
                    className="logo "
                    src="/exclamation_alert.png"
                    alt="compliance"
                    width="35"
                    height="35"
                  />
                </div>
                <div className="card-info">
                  <div className="card-hrs-wrapper">
                    <div className="card-hrs text-red">
                      {dashboardCounts
                        ? dashboardCounts.activityHistoryLegalStatusCount
                            .Non_CompliedCount
                        : "0"}
                    </div>
                    <div className="card-prev text-red">Non Complied</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card voilet">
                <div className="card-icon">
                  <Image
                    className="logo "
                    src="/watch.png"
                    alt="compliance"
                    width="40"
                    height="40"
                  />
                </div>
                <div className="card-info">
                  <div className="card-hrs-wrapper">
                    <div className="card-hrs text-voilet">
                      {dashboardCounts
                        ? dashboardCounts.activityHistoryLegalStatusCount
                            .DelayedCount
                        : "0"}
                    </div>
                    <div className="card-prev text-voilet">Delayed</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card peach">
                <div className="card-icon">
                  <Image
                    className="logo "
                    src="/order-history.png"
                    alt="compliance"
                    width="40"
                    height="40"
                  />
                </div>
                <div className="card-info">
                  <div className="card-hrs-wrapper">
                    <div className="card-hrs text-navy-blue">
                      {dashboardCounts
                        ? dashboardCounts.activityHistoryLegalStatusCount
                            .Delayed_ReportedCount
                        : "0"}
                    </div>
                    <div className="card-prev text-navy-blue">
                      Delayed Reported
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card blue">
                <div className="card-icon">
                  <Image
                    className="logo "
                    src="/order-history.png"
                    alt="compliance"
                    width="40"
                    height="40"
                  />
                </div>
                <div className="card-info">
                  <div className="card-hrs-wrapper">
                    <div className="card-hrs text-info">
                      {dashboardCounts
                        ? dashboardCounts.activityHistoryLegalStatusCount
                            .Approval_PendingCount
                        : "0"}
                    </div>
                    <div className="card-prev text-info">Approval Pending</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card orange">
                <div className="card-icon">
                  <Image
                    className="logo "
                    src="/reuse.png"
                    alt="compliance"
                    width="35"
                    height="35"
                  />
                </div>
                <div className="card-info">
                  <div className="card-hrs-wrapper">
                    <div className="card-hrs text-orange">
                      {dashboardCounts
                        ? dashboardCounts.activityHistoryLegalStatusCount
                            .Re_AssignedCount
                        : "0"}
                    </div>
                    <div className="card-prev text-orange">Re-Assigned</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 bg-white rounded-corner mt-4">
          <div className="d-flex justify-content-space-between align-items-center p-2">
            <div className="col-md-6  px-0">
              <button
                className={`btn btn-primary light m-2 ${
                  selectedOption === "Overall" ? "active" : ""
                }`}
                onClick={() => handleButtonClick("Overall")}
              >
                Overall
              </button>
              <button
                className={`btn btn-primary light m-2 ${
                  selectedOption === "Legal Entity" ? "active" : ""
                }`}
                onClick={() => handleButtonClick("Legal Entity")}
              >
                Legal Entity
              </button>
              <button
                className={`btn btn-primary light m-2 ${
                  selectedOption === "Unit / Location" ? "active" : ""
                }`}
                onClick={() => handleButtonClick("Unit / Location")}
              >
                Unit / Location
              </button>
              <button
                className={`btn btn-primary light m-2 ${
                  selectedOption === "Function" ? "active" : ""
                }`}
                onClick={() => handleButtonClick("Function")}
              >
                Function
              </button>
            </div>
            <div className="col-md-5 text-end">
              <Popup 
              trigger={<button className="btn btn-primary light m-2">Filter Date</button>}>
                <div className="bg-light p-3 rounded">
                  <div className="mb-3">
                    <label className="form-label">From Date</label>
                    <input
                    id="fromDateInput"
                    type="date"
                    className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">To Date</label>
                    <input
                    id="toDateInput"
                    type="date"
                    className="form-control"
                    />
                  </div>
                  <div>
                      <button className="btn btn-primary light m-2 " onClick={handleDateFilter}>Filter</button>
                      <button className="btn btn-primary light m-2 " onClick={handleResetDateFilter}>Reset</button>
                  </div>
                </div>
              </Popup>
              {/* <DownloadComponent
                url={"/sample-data/SampleCSV.csv"}
                text={"Export"}
              /> */}
              <button className="btn btn-primary light m-2 " onClick={handleExport}>
                Export Graph
              </button>
            </div>
          </div>

          <div className="row custom_row justify-content-center p-4">
            {selectedOption === "Overall" ? (
              <div className="row justify-content-space-evenly ">
                <div className="col-md-4">
                  <h5 className="px-0 mb-2 text-center text-muted fw-bold">
                    <u>Status-Wise</u>
                  </h5>

                  <Doughnut
                  id="graph-container"
                    options={{
                      responsive: true,
                    }}
                    data={getDataForGraph()}
                  />
                </div>
                <div className="col-md-4 p-2 ">
                  <h5 className="px-0 mb-2 text-center text-muted fw-bold">
                    <u>Impact-Wise</u>
                  </h5>

                  <Pie
                  id="graph-container"
                    options={{
                      responsive: true,
                    }}
                    data={riskData}
                  />
                </div>
              </div>
            ) : (
              <>
                {selectedOption === "Unit / Location" ? (
                  <div className="row custom_row justify-content-center px-0 mb-4">
                    <div className="col-md-2 ">
                      <select className="form-select btn light btn-primary"
                      onChange={handleEntityChange}>
                        {
                        dashboardEntityBarCounts?.entities.map(entity => (
                        <option key={entity.id} value={entity.name}>{entity.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {selectedOption === "Function" ? (
                  <div className="row custom_row justify-content-center px-0 mb-4">
                    <div className="col-md-2 ">
                      <select className="form-select btn light btn-primary" onChange={handleEntityChange}>
                      {
                        dashboardEntityBarCounts?.entities.map(entity => (
                        <option key={entity.id} value={entity.name}>{entity.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2 ">
                      <select className="form-select btn light btn-primary" onChange={handleUnitChange}>
                      {
                        dashboardUnitBarCounts?.businessUnit.map(unit => (
                        <option key={unit.id} value={unit.name}>{unit.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="row custom_row px-0 justify-content-center">
                  <div className="col-md-8 p-3">
                    <Bar  id="graph-container" options={getGraphOption()} data={getDataForGraph()} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div>
        {dashboardCounts? <AgGridTableComponent
          aggridHeight={getHeight()}
          customColumns={getColData()}
          customRows={getRowData()}
          handleRowClick={handleRowClick}
          handleCellClick={handleCellClick}
          gridApiRef={gridApiRef}
          rowClickSelection={true}
          key={refreshGrid}
        /> : <></>
        }
      </div>
      <Modal show={showModal} onHide={closeModal} dialogClassName="large-modal">
        <Modal.Header closeButton>
          <h5>Activities</h5>
        </Modal.Header>
        <Modal.Body className="p-4">
          {/* <Nav variant="tabs" defaultActiveKey="mainActivities">
            <Nav.Item>
              <Nav.Link
                eventKey="mainActivities"
                onClick={() => handlePageChange("mainActivities")}
              >
                Main Activities
              </Nav.Link>
            </Nav.Item>
          </Nav> */}

          <div className="card">
            <AgGridTableComponent
              slug="/activity_history"
              aggridPadding="p-0"
              api= {getDataForGrid()}
              filter=""
              // page="Main Activities"
              customColumns={customColumns}
              listname="formattedCrsActivity"
              // customRows={GridLegalStatus}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="primary light">Save changes</Button> */}
          <Button variant="danger light" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

