import React from "react";
import { Modal } from "react-bootstrap";
import FormComponent from "./FormComponent";
import { BsFileText } from "react-icons/bs";

interface ModalField {
  label: string;
  name: string;
  type: string;
  method: string;
  required: boolean;
  options?: { value: string; label: string }[];
}

interface ModalFormInterface {
  api: string;
  filter: string;
  method: string;
  slug: string;
  page: string;
  type: string;
  show: boolean;
  onHide: boolean;
  formFields: ModalField[];
  initialFormData: [];
  endpoints: [];
}

const ModalForm = ({
  slug,
  page,
  type,
  show,
  onHide,
  formFields,
  initialFormData,
  filter,
  api,
  endpoints,
  method,
  additionalFormFields,
  modelCssClass,
  colcssClass,
}: ModalFormInterface) => {
  modelCssClass = modelCssClass ?? "large-modal";
  colcssClass = colcssClass ?? "col-md-6";

  return (
    <Modal show={show} onHide={onHide} dialogClassName={modelCssClass}>
      <Modal.Header closeButton>
        <h6>
          <BsFileText size={23} className="mx-2" />
          {page}
        </h6>
      </Modal.Header>
      <Modal.Body>
        <div className="px-0">
          <FormComponent
            api={api}
            filter={filter}
            method={method}
            type={type}
            slug={slug}
            page={page}
            colcssClass={colcssClass}
            insideModel={true}
            formheader={false}
            initialFormData={initialFormData}
            formFields={formFields}
            additionalFormFields={additionalFormFields}
            endpoints={endpoints}
            onButtonClick={onHide}
          />
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

export default ModalForm;
