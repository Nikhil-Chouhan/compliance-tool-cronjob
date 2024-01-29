"use client";

import React, { useState } from "react";
import ExpandSearchComponent from "@/components/ExpandSearchComponent";
import { FaFileDownload, FaFileAlt, FaSearch } from "react-icons/fa";

export default function DocumentAndRecords() {
  const [searchQuery, setSearchQuery] = useState("");

  const formFields1 = [
    {
      label: "Entity :",
      name: "entity_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Demo entity Pvt Ltd" },
        { value: 2, label: "NBFC ltd " },
        { value: 3, label: "JFW ltd" },
        { value: 4, label: "Demo Entity 2 Pvt Ltd" },
        { value: 4, label: "XYZ Private ltd" },
      ],
    },
    {
      label: "Unit :",
      name: "unit",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Cooporate Office - Mumbai" },
        { value: 2, label: "Registered Office - Pune" },
      ],
    },
    {
      label: "Function : ",
      name: "function_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Administration" },
        { value: 2, label: "Secretrial" },
        { value: 3, label: "Human Resources" },
        { value: 4, label: "Information Technology" },
      ],
    },
  ];
  const advancedFormFields = [
    {
      label: "Evaluator  ",
      name: "evaluator _id",
      type: "select",

      required: false,
      options: [{ value: 1, label: "Evaluator " }],
    },
    {
      label: "Executor ",
      name: "executor_id",
      type: "select",

      required: false,
      options: [{ value: 1, label: "Executor" }],
    },
    {
      label: "Type of Activity ",
      name: "executor_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Amendment" },
        { value: 2, label: "Appointment" },
        { value: 3, label: "Disclosure" },
        { value: 4, label: "Meeting" },
      ],
    },
    {
      label: "Legislation ",
      name: "executor_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Legislation option 1" },
        { value: 2, label: "Legislation option 2" },
      ],
    },
    {
      label: "Rule  ",
      name: "executor_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Rule option 1" },
        { value: 2, label: "Rule option 2" },
      ],
    },
  ];

  const numOfFiles = 11;
  const text = "D22010001132\n1389RC- PF Code Allotment.pdf";

  const fileComponents = [];
  for (let i = 1; i <= numOfFiles; i++) {
    fileComponents.push(
      <div key={i} className="m-3">
        <div className="d-flex flex-column align-items-center">
          <h2>
            <FaFileDownload className="fa-10x" />
          </h2>
          <div className="mt-3 text-center">
            <a href="/sample-data/SamplePDF.pdf" download>
              {text}
            </a>
          </div>
        </div>
      </div>
    );
  }
  const columns = [];
  for (let i = 0; i < fileComponents.length; i += 4) {
    columns.push(
      <div key={i} className="col-md-4">
        {fileComponents.slice(i, i + 4)}
      </div>
    );
  }

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearchButtonClick = () => {
    console.log("Search query:", searchQuery);
  };

  return (
    <div>
      <ExpandSearchComponent
        slug="/"
        page="Filter"
        formFields={formFields1}
        advancedFormFields={advancedFormFields}
      />
      <div className="container-fluid">
        <div className="row custom_row bg-white rounded-corner p-4 align-items-center">
          <div className="col-md-8 px-0">
            <b>
              <h5 className="fw-strong mt-2 mb-3 ">
                <FaFileAlt size={25} className="mb-1 mx-3" />
                Total Documents: {numOfFiles}
              </h5>
            </b>
          </div>
          <div className="col-md-4 pb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <button
                className="btn btn-primary light"
                type="button"
                onClick={handleSearchButtonClick}
              >
                <FaSearch />
              </button>
            </div>
          </div>
          <hr />
          <div className="row">{columns}</div>
        </div>
      </div>
    </div>
  );
}
