"use client";

import React, { useState, useCallback, useRef } from "react";
import DownloadComponent from "@/components/DownloadComponent";
import AgGridTableComponent from "@/components/AgGridTableComponent";

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
import { Doughnut, Bar } from "react-chartjs-2";
import { Button, Modal } from "react-bootstrap";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const gridApiRef = useRef(null);

  const [selectedOption, setSelectedOption] = useState("Overall");

  const overallData = {
    labels: ["Complied", "Non-Complied", "Re-Opened"],
    datasets: [
      {
        data: Array.from({ length: 3 }, () => Math.floor(Math.random() * 1000)),
        backgroundColor: [
          "rgba(3, 197, 35, 0.5)",
          "rgba(245, 54, 54, 0.5)",
          "rgba(245, 176, 65, 0.5)",
        ],
        borderColor: [
          "rgba(3, 197, 35, 1)",
          "rgba(245, 54, 54, 1)",
          "rgba(245, 176, 65, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const legalEntityData = {
    labels: [
      "Demo Entity Pvt Ltd",
      "ABC Mining Pvt Ltd	",
      "JFW Limited",
      "R Ltd",
    ],
    datasets: [
      {
        label: "Complied",
        data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 1000)),
        backgroundColor: "rgba(3, 197, 35, 0.5)",
      },
      {
        label: "Non-Complied",
        data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 1000)),
        backgroundColor: "rgba(245, 54, 54, 0.5)",
      },
      {
        label: "Re-Opened",
        data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 1000)),
        backgroundColor: "rgba(245, 176, 65, 0.5)",
      },
    ],
  };

  const unitData = {
    labels: [
      "Corporate Office - Mumbai",
      "Mining Unit",
      "Registered Office - Pune",
      "JFW pune",
    ],
    datasets: [
      {
        label: "Complied",
        data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 1000)),
        backgroundColor: "rgba(3, 197, 35, 0.5)",
      },
      {
        label: "Non-Complied",
        data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 1000)),
        backgroundColor: "rgba(245, 54, 54, 0.5)",
      },
      {
        label: "Re-Opened",
        data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 1000)),
        backgroundColor: "rgba(245, 176, 65, 0.5)",
      },
    ],
  };

  const functionData = {
    labels: [
      "Secretarial",
      "Regulatory Laws",
      "Human Resources",
      "Maintenance",
    ],
    datasets: [
      {
        label: "Complied",
        data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 1000)),
        backgroundColor: "rgba(3, 197, 35, 0.5)",
      },
      {
        label: "Non-Complied",
        data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 1000)),
        backgroundColor: "rgba(245, 54, 54, 0.5)",
      },
      {
        label: "Re-Opened",
        data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 1000)),
        backgroundColor: "rgba(245, 176, 65, 0.5)",
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

  const handleButtonClick = (option) => {
    setSelectedOption(option);
  };

  const getDataForGraph = () => {
    switch (selectedOption) {
      case "Overall":
        return overallData;
      case "Legal Entity":
        return legalEntityData;
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
        ? { headerName: additionalColumn.header, field: additionalColumn.field }
        : null,
      { headerName: "Complied", field: "complied" },
      { headerName: "Non Complied", field: "non_complied" },
      { headerName: "Re-Opened", field: "re_opened" },
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

  const overallrowData = [
    {
      sr_no: 1,
      complied: 2,
      non_complied: 6,
      re_opened: 15,
    },
  ];

  const entityrowData = [
    {
      sr_no: 1,
      entity: "Demo Entity Pvt Ltd",
      complied: 2,
      non_complied: 260,
      re_opened: 0,
    },
  ];

  const unitrowData = [
    {
      sr_no: 1,
      unit: 2,
      complied: 2,
      non_complied: 6,
      re_opened: 15,
    },
  ];

  const functionrowData = [
    {
      sr_no: 1,
      function_name: "test",
      complied: 2,
      non_complied: 6,
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
      case "Unit / Location":
        return unitrowData;
      case "Function":
        return functionrowData;
      default:
        return overallrowData;
    }
  };

  const customColumns = [
    { headerName: "Check Point ID", field: "check_point_id" },
    { headerName: "Category", field: "category" },
    { headerName: "Checkpoint", field: "checkpoint" },
    { headerName: "Risk", field: "risk" },
    { headerName: "Frequency", field: "frequency" },
    {
      headerName: "Final Document Submission Date",
      field: "document_submssion_date",
    },
  ];

  const customRows = [
    {
      check_point_id: "Checkpoint 1",
      category: "Statutory Requirements",
      checkpoint: "Is CCOE License and Drawing at the site available?",
      risk: "Major",
      frequency: "Monthly",
      document_submssion_date: "20/11/2023",
    },
    {
      check_point_id: "Checkpoint 2",
      category: "Non Statutory Requirements",
      checkpoint: "Validity and date of renewal",
      risk: "Major",
      frequency: "Monthly",
      document_submssion_date: "20/11/2023",
    },
    {
      check_point_id: "Checkpoint 3",
      category: "Statutory Requirements",
      checkpoint: "Does the drawing correctly reflect existing facilities?",
      risk: "Major",
      frequency: "Monthly",
      document_submssion_date: "20/11/2023",
    },
    {
      check_point_id: "Checkpoint 4",
      category: "Non Statutory Requirements",
      checkpoint:
        "Are safety message like Telephone. No, Police, Fire brigade, Hospital, Ambulance, Local civic authorities (DM/SDM), Nearby ROs",
      risk: "Major",
      frequency: "Monthly",
      document_submssion_date: "20/11/2023",
    },
    {
      check_point_id: "Checkpoint 5",
      category: "Statutory Requirements",
      checkpoint: "data here",
      risk: "Major",
      frequency: "Monthly",
      document_submssion_date: "20/11/2023",
    },
  ];

  const handleRowClick = useCallback(() => {
    setShowModal(true);
  }, []);

  return (
    <div>
      <div className="container-fluid">
        <div className="row custom_row rounded-corner justify-content-center">
          <div className="col-xl-3 col-sm-6 col-md-12 mb-4">
            <div className="row rounded-corner bg-white custom_row ">
              <div className="p-2 ">
                <h3 className="danger text-center">67</h3>
              </div>

              <div className=" p-3 bg-light-green rounded-bottomm">
                <h6 className="text-muted text-center ">Complied</h6>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 col-12 mb-4">
            <div className="row rounded-corner bg-white custom_row">
              <div className="p-2 ">
                <h3 className="danger text-center">154</h3>
              </div>

              <div className="bg-light-red p-3 rounded-bottomm">
                <h6 className="text-muted text-center ">Non Complied</h6>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 col-12 mb-4">
            <div className="row rounded-corner bg-white custom_row">
              <div className="p-2 ">
                <h3 className="danger text-center">5</h3>
              </div>

              <div className="bg-light-orange p-3 rounded-bottomm">
                <h6 className="text-muted text-center ">Re-Opened</h6>
              </div>
            </div>
          </div>
        </div>

        <div className="row d-flex justify-content-start align-items-center p-2 mt-2">
          <div className="col-md-2 justify-content-center">
            <select
              className="form-select form-control input-padding btn btn-primary light"
              id="year"
              name="Year"
            >
              <option value="">Year</option>
              <option value="2023">2023</option>
              <option value="2023">2024</option>
              <option value="2023">2025</option>
              <option value="2023">2026</option>
              <option value="2023">2027</option>
              <option value="2023">2028</option>
            </select>
          </div>
          <div className="col-md-2 justify-content-center">
            <select
              className="form-select form-control input-padding btn btn-primary light"
              id="month"
              name="Month"
            >
              <option value="">Month</option>
              <option value="January">January</option>
              <option value="2023">February</option>
              <option value="2023">March</option>
              <option value="2023">April</option>
              <option value="2023">May</option>
              <option value="2023">June</option>
              <option value="2023">July</option>
              <option value="2023">August</option>
              <option value="2023">September</option>
              <option value="2023">October</option>
              <option value="2023">November</option>
              <option value="2023">December</option>
            </select>
          </div>
          <div className="col-md-2 justify-content-center">
            <select
              className="form-select form-control input-padding btn btn-primary light"
              id="year"
              name="Year"
            >
              <option value="">Risk</option>
              <option value="Severe">Severe</option>
              <option value="2023">Non Complied</option>
              <option value="2023">Moderate</option>
              <option value="2023">Low</option>
            </select>
          </div>
        </div>

        <div className="row d-flex justify-content-space-between align-items-center mb-2">
          <div className="col-md-7">
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
            <DownloadComponent
              url={"/sample-data/SampleCSV.csv"}
              text={"Export"}
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="row custom_row justify-content-center bg-white rounded-corner p-4">
            {selectedOption === "Overall" ? (
              <div className="col-md-4 p-4 ">
                <Doughnut
                  options={{
                    responsive: true,
                  }}
                  data={getDataForGraph()}
                />
              </div>
            ) : (
              <div className="col-md-8 p-4 ">
                <Bar options={getGraphOption()} data={getDataForGraph()} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <AgGridTableComponent
          aggridHeight={getHeight()}
          customColumns={getColData()}
          customRows={getRowData()}
          handleRowClick={handleRowClick}
          gridApiRef={gridApiRef}
          rowClickSelection={true}
        />
      </div>
      <Modal show={showModal} onHide={closeModal} dialogClassName="large-modal">
        <Modal.Header closeButton>
          <h5>{"CheckPoints"}</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <AgGridTableComponent
              slug="/activity_history"
              aggridPadding="p-0"
              page="CheckPoint List"
              customColumns={customColumns}
              customRows={customRows}
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
