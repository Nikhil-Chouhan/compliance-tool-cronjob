import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import FormComponent from "@/components/FormComponent";
import AgGridTableComponent from "@/components/AgGridTableComponent";
import { useSession } from "next-auth/react";
import { BsFileText } from "react-icons/bs";

const ActivityModalFormComponent = ({
  api,
  method,
  type,
  customColumns,
  initialFormData,
  formFields,
  modelcssClass,
  show,
  onHide,
  endpoints,
  filter,
  title,
}) => {
  modelcssClass = modelcssClass ?? "large-modal";

  const modalAction = (response) => {
    console.log("response : ", response);
    if (response === 1) {
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      className="custom_bg"
      dialogClassName={modelcssClass}
    >
      <Modal.Header closeButton>
        <BsFileText size={23} className="mx-2" />

        <h6>{title}</h6>
      </Modal.Header>
      <Modal.Body>
        <div className="px-0">
          <FormComponent
            api={api}
            filter={filter}
            method={method}
            page="Activity Completion"
            type={type}
            slug=""
            insideModel={true}
            colcssClass="col-md-12"
            endpoints={endpoints}
            initialFormData={initialFormData}
            formFields={formFields}
            onButtonClick={onHide}
          />
          {/* <AgGridTableComponent
            checkBox={true}
            page="Select Activity"
            customColumns={customColumns}
          /> */}
        </div>
      </Modal.Body>
      {/* <Modal.Footer>
      <Button variant="primary light">Save changes</Button>
        <Button variant="danger light" onClick={onHide}>
          Submit
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default ActivityModalFormComponent;
