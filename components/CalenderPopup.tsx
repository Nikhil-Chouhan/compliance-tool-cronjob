import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button, Nav } from "react-bootstrap";
import AgGridTableComponent from "@/components/AgGridTableComponent";
import ActivityModalForm from "@/components/ActivityModalFormComponent";
import {
  BsClipboardCheck,
  BsBuildings,
  BsBuilding,
  BsTextIndentLeft,
  BsPersonCheck,
} from "react-icons/bs";
import { ToastType } from "./Toast_old";
import { useSession } from "next-auth/react";
import ModalForm from "./ModalFormComponent";

export default function CalenderPopup({
  filter,
  show,
  onHide,
  selectedId,
  api,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toastRef = useRef<ToastType>();
  const [newDataStates, setNewDataStates] = useState({});
  const [selectedHistoryID, setSelectedHistoryID] = useState(null);

  const [activePage, setActivePage] = useState("activityDetails");

  const [showCompleteModal, setCompleteModal] = useState(false);
  const [showUpdateModal, setUpdateModal] = useState(false);
  const [showNonComplianceModal, setNonComplianceModal] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  let dataOrganogram, dataActivity;
  if (newDataStates) {
    dataOrganogram = [
      {
        label: "Unit Activity ID",
        value: newDataStates.unit_activity_id,
        icon: <BsClipboardCheck className="mx-2" size={15} />,
      },
      {
        label: "Entity",
        value: newDataStates.entity_name,
        icon: <BsBuildings className="mx-2" size={15} />,
      },
      {
        label: "Unit",
        value: newDataStates.business_unit_name,
        icon: <BsBuilding className="mx-2" size={15} />,
      },
      {
        label: "Function",
        value: newDataStates.function_name,
        icon: <BsTextIndentLeft className="mx-2" size={15} />,
      },
      {
        label: "Performer",
        value: newDataStates.executor_name,
        icon: <BsPersonCheck className="mx-2" size={15} />,
      },
      {
        label: "Reviewer",
        value: newDataStates.evaluator_name,
        icon: <BsPersonCheck className="mx-2" size={15} />,
      },
      {
        label: "Function Head",
        value: newDataStates.function_head_name,
        icon: <BsPersonCheck className="mx-2" size={15} />,
      },
    ];

    dataActivity = [
      {
        label: "Legislation",
        value: newDataStates.legislation,
      },
      { label: "Rule ", value: newDataStates.rule },
      { label: "Reference ", value: newDataStates.reference },
      { label: "Who ", value: newDataStates.who },
      {
        label: "When ",
        value: newDataStates.when,
      },
      {
        label: "Compliance Activity ",
        value: newDataStates.actitvy,
      },
      { label: "Procedure ", value: newDataStates.procedure },
      { label: "Prohibitive / Prescriptive ", value: "Prescriptive" },
      { label: "Frequency ", value: newDataStates.frequency },
      // { id: "Form No ", value: "Form GST CMP-04" },
      { label: "Due date ", value: newDataStates.legal_due_date },
      // { id: "Specific due date ", value: "NA" },
      { label: "Compiance Type ", value: newDataStates.compliance_type },
      // { id: "Responsibility  ", value: "NA" },
      // { id: "Corporate Level or Unit Level  ", value: "Corporate Level" },
      // { id: "Exemption Criteria ", value: "NA" },
      { label: "Events  ", value: newDataStates.event },
      { label: "Sub Event ", value: newDataStates.event_sub },
      {
        label: "Implications  ",
        value: "Penalty up to twenty-five thousand rupees ",
      },
      // { id: "Imprisonment Duration ", value: "NA" },
      // { id: "Imprisonment Applies to ", value: "NA" },
      // { id: "Fine amount  ", value: " 25000" },
      // { id: "Subsequent Amount per Day ", value: "0" },
      { label: "Impact  ", value: "Moderate" },
      // { id: "Impact on Unit ", value: event.data.event_sub },
      // { id: "Impact on organization ", value: "Low" },
      // { id: "Interlinkage ", value: "NA" },
      // { id: "Linked Activity ID ", value: "NA" },
      // { id: "Weblink ", value: "NA" },
      // { id: "ReguCheck Activity ID ", value: "T0022166" },
    ];
  }

  const session = useSession();
  const user_id = session.data?.user.id;

  const today = new Date();
  const date = today.setDate(today.getDate());
  const defaultValue = new Date(date).toISOString().split("T")[0];

  const initialActivityCompleteFormData = {
    id: selectedHistoryID,
    completed_by: user_id,
    completion_date: defaultValue,
    comments: null,
    type: "complete",
  };

  const initialActivityUpdateFormData = {
    id: selectedHistoryID,
    completion_date: null,
    comments: null,
    non_compliance_reason: null,
    type: "update",
  };

  const initialNonComplianceFormData = {
    id: selectedHistoryID,
    non_compliance_reason: null,
    type: "noncompliance",
  };

  const activityHistoryColumns = [
    { headerName: "Performer Date", field: "executor_due_date" },
    { headerName: "Reviewer Date", field: "evaluator_due_date" },
    { headerName: "Function Head Date", field: "function_head_due_date" },
    { headerName: "Unit Head Date", field: "unit_head_due_date" },
    { headerName: "Legal Date", field: "legal_due_date" },
    { headerName: "Completed By", field: "first_name" },
    { headerName: "Completed On", field: "completion_date" },
    { headerName: "Comments", field: "comments" },
    {
      headerName: "Activity Legal Status",
      field: "activity_history_status",
      isenum: true,
    },
    {
      headerName: "Document",
      field: "document",
      download: true,
    },
  ];

  const linkedActivityColumns = [
    { headerName: "Client Activity ID", field: "client_id", islink: true },
    { headerName: "Legislation", field: "legislation" },
    { headerName: "Rule", field: "rule" },
    { headerName: "Reference", field: "reference" },
    { headerName: "Who", field: "who" },
    { headerName: "When", field: "when" },
    { headerName: "Activity", field: "activity" },
    { headerName: "Procedure", field: "procedure" },
    { headerName: "Impact", field: "impact" },
    { headerName: "Frequency", field: "frequency" },
    { headerName: "Legal Due date", field: "legal_due_date" },
    { headerName: "Performer Date", field: "executor_date" },
  ];

  const activityCompleteFormFields = [
    {
      label: "Completion Date",
      name: "completion_date",
      type: "date",
      disabled: false,
      required: true,
    },
    {
      label: "Comments",
      name: "comments",
      type: "select",
      api: true,
      apitype: "custom",
      required: false,
    },
    {
      name: "comments_input",
      type: "text",
      required: false,
      hidden: true,
    },
    {
      label: "Upload proof of Compliance",
      name: "document",
      type: "file",
      multiple: true,
      required: false,
    },
  ];

  const activityUpdateFormFields = [
    {
      label: "Completion Date",
      name: "completion_date",
      type: "date",
      disabled: true,
      required: true,
    },
    {
      label: "Comments",
      name: "comments",
      type: "select",
      api: true,
      apitype: "custom",
      required: false,
    },
    {
      name: "comments_input",
      type: "text",
      required: false,
      hidden: true,
    },
    {
      label: "Reason For Non Complaince",
      name: "non_compliance_reason",
      type: "textarea",
      required: false,
    },
    {
      label: "Upload proof of Compliance",
      name: "document",
      type: "file",
      multiple: true,
      required: false,
    },
  ];

  const nonComplianceFormFields = [
    {
      label: "Reason For Non Complaince",
      name: "non_compliance_reason",
      type: "textarea",
      required: true,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        console.log("api:", api);

        const response = await fetch(`${api}${filter}`);
        const data = await response.json();
        console.log("data:", data);

        setNewDataStates(data.flattenedData);
      } catch (error) {
        console.error(`Error fetching data from ${api}:`, error);
      }

      setLoading(false);
    };

    fetchData();
  }, [api]);

  const openModal = (responsekey) => {
    console.log("responsekey : ", responsekey);
    if (responsekey === 0) {
      setCompleteModal(true);
    } else if (responsekey === 1) {
      setUpdateModal(true);
    } else if (responsekey === 2) {
      setNonComplianceModal(true);
    }
  };

  const activityUpdateEndpoints = [
    {
      url: "/api/activity-history/" + selectedHistoryID,
      name: "Activity History",
      link: "activity_historyRow",
    },
    {
      url: "/api/standard-comments",
      name: "Comments",
      link: "standard_commentsList",
    },
  ];
  const activityCompleteEndpoints = [
    {
      url: "/api/standard-comments",
      name: "Comments",
      link: "standard_commentsList",
    },
  ];

  return (
    <Modal size="xl" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <h6>{"Activity Details"}</h6>
      </Modal.Header>
      <Modal.Body>
        <Nav variant="tabs" defaultActiveKey="activityDetails">
          <Nav.Item>
            <Nav.Link
              eventKey="activityDetails"
              onClick={() => handlePageChange("activityDetails")}
            >
              Activity Details
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="activityHistory"
              onClick={() => handlePageChange("activityHistory")}
            >
              Activity History
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <>
          {activePage === "activityDetails" && (
            <>
              {newDataStates && (
                <div className="card mt-3">
                  <div className="card-body ">
                    <h6 className="card-title mb-3">Organogram Information</h6>
                    <hr></hr>
                    {dataOrganogram.map((item, index) => (
                      <div className="row mb-1" key={index}>
                        <div className="col-md-4">
                          <p className="p-1">
                            {item.icon}
                            {item.label}:
                          </p>
                        </div>
                        <div className="col-md-8">
                          <p className="fw-600 p-1">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card-body">
                    <h6 className="card-title mb-3">Activity Details</h6>
                    <hr></hr>
                    {dataActivity.map((item, index) => (
                      <div className="row mb-1" key={index}>
                        <div className="col-md-4">
                          <p className="p-1">
                            {/* {item.icon} */}
                            {item.label}:
                          </p>
                        </div>
                        <div className="col-md-8">
                          <p className="fw-600 p-1">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {activePage === "activityHistory" && (
            <>
              <div className="mt-3">
                <AgGridTableComponent
                  key={tableKey}
                  api="/api/activity-history"
                  page="Activity History"
                  filter={`?page=&pageSize=-1&filterConfigID=${selectedId}`}
                  listname="activity_historyFlatList"
                  actionBtn={false}
                  edit="ActivityAction"
                  refreshAGGrid={true}
                  customColumns={activityHistoryColumns}
                  onButtonClick={(id, responsekey) => {
                    setSelectedHistoryID(id);
                    openModal(responsekey);
                  }}
                />
                {showCompleteModal && (
                  <ActivityModalForm
                    api="/api/activity-history"
                    filter="?page=&pageSize=-1&filterName="
                    method="PUT"
                    type="Submit"
                    title="Activity Completion"
                    // selectedHistoryId={selectedHistoryID}
                    customColumns={linkedActivityColumns}
                    endpoints={activityCompleteEndpoints}
                    formFields={activityCompleteFormFields}
                    initialFormData={initialActivityCompleteFormData}
                    show={showCompleteModal}
                    modelcssClass="medium-modal modal-dialog-centered"
                    onHide={() => {
                      setCompleteModal(false);
                      setTableKey((prevKey) => prevKey + 1);
                    }}
                  />
                )}

                {showUpdateModal && (
                  <ActivityModalForm
                    api="/api/activity-history"
                    filter="?page=&pageSize=-1&filterName="
                    method="PUT"
                    type="Update"
                    // selectedHistoryId={selectedHistoryID}
                    title="Activity Update"
                    customColumns={linkedActivityColumns}
                    endpoints={activityUpdateEndpoints}
                    formFields={activityUpdateFormFields}
                    initialFormData={initialActivityUpdateFormData}
                    show={showUpdateModal}
                    modelcssClass="medium-modal modal-dialog-centered"
                    onHide={() => {
                      setUpdateModal(false);
                      setTableKey((prevKey) => prevKey + 1);
                    }}
                  />
                )}
                {showNonComplianceModal && (
                  <ModalForm
                    api="/api/activity-history"
                    filter="?page=&pageSize=-1&filterName="
                    // slug="/activity_history/"
                    page="Reason for Non Compliance"
                    method="PUT"
                    type="Submit"
                    modelCssClass="medium-modal modal-dialog-centered"
                    colcssClass="col-md-12"
                    show={showNonComplianceModal}
                    initialFormData={initialNonComplianceFormData}
                    formFields={nonComplianceFormFields}
                    onHide={() => {
                      setNonComplianceModal(false);
                      setTableKey((prevKey) => prevKey + 1);
                    }}
                  />
                )}
              </div>
            </>
          )}
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger light" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
