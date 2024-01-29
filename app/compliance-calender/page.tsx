"use client";

import ExpandSearchComponent from "@/components/ExpandSearchComponent";
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalenderPopup from "@/components/CalenderPopup";

const localizer = momentLocalizer(moment);

export default function ComplianceCalender() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`/api/repository?page=&pageSize=-1&filterStatus=1`)
      .then((response) => response.json())
      .then((data) => {
        const entrylist = data["repositoryFLatList"];

        const mappedData = entrylist.map((item) => {
          const rowData = {
            id: item.id,
            title: item.activity_code,
            start: item.executor_due_date,
            end: item.executor_due_date,
          };
          return rowData;
        });

        setEvents(mappedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const formFields = [
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
    {
      label: "Executor :",
      name: "executor_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "executor" },
        { value: 2, label: "Non Executor" },
        { value: 3, label: "Delayed" },
        { value: 4, label: "N/A" },
      ],
    },
    {
      label: "Evaluator :",
      name: "evaluator_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Severe" },
        { value: 2, label: "Major" },
        { value: 3, label: "Moderate" },
        { value: 4, label: "Low" },
      ],
    },
    {
      label: "Function Head :",
      name: "functionhead_id",
      type: "select",

      required: false,
      options: [
        { value: 1, label: "Function Head" },
        { value: 2, label: "Non Function Head" },
        { value: 3, label: "Delayed" },
        { value: 4, label: "N/A" },
      ],
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedID, setSelectedID] = useState(null);

  const openModal = (event) => {
    console.log(event);
    setSelectedID(event.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedID(null);
  };

  return (
    <>
      {/* <div>
        <ExpandSearchComponent slug="/" page="Filter" formFields={formFields} />
      </div> */}
      <div className="container-fluid">
        <div className="row custom_row bg-white rounded-corner h-100 p-4">
          <div className="col-md-12 px-0">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 580 }}
              onSelectEvent={openModal}
            />
          </div>
        </div>
      </div>
      <CalenderPopup
        filter="?page=&pageSize=-1&filterName="
        api={`/api/repository/${selectedID}`}
        selectedId={selectedID}
        show={showModal}
        onHide={closeModal}
      />
    </>
  );
}
