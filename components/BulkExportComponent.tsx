import React, { useState, useRef } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import Toast, { ToastType } from "@/components/Toast_old";

export default function BulkExportComponent({ slug, page, formfields }) {
  // const [fields, setFields] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedFieldIndices, setSelectedFieldIndices] = useState([]);
  const [loading] = useState(false);
  const toastRef = useRef<ToastType>();
  const fields = [...formfields];

  const handleCheckboxChangeAll = () => {
    setSelectAllChecked(!selectAllChecked);
    if (selectAllChecked) {
      setSelectedFieldIndices([]);
    } else {
      const indicesArray = fields.map((_, index) => index);
      setSelectedFieldIndices(indicesArray);
    }
  };
  const handleCheckboxChange = (index) => {
    if (selectedFieldIndices.includes(index)) {
      setSelectedFieldIndices(selectedFieldIndices.filter((i) => i !== index));
    } else {
      setSelectedFieldIndices([...selectedFieldIndices, index]);
    }
  };
  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   selectedFieldIndices.sort((a, b) => a - b);

  //   const selectedFields = selectedFieldIndices.map((index) => fields[index]);
  //   const requestData = {
  //     fields: selectedFields,
  //   };

  //   fetch(`${api}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(requestData),
  //   })
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = "data.csv";
  //       document.body.appendChild(a);
  //       a.click();
  //       a.remove();
  //     })
  //     .catch((error) => {
  //       console.error("Error downloading data:", error);
  //     });
  // };

  return (
    <>
      <main>
        <div className="row custom_row bg-white rounded-corner p-4 h-100">
          <form>
            <div className="row">
              <div className="col-md-12 px-0 mb-2">
                <h5 className="fw-strong">
                  <FaCheckCircle className="mx-1" />
                  Select Fields to {page}
                </h5>
              </div>
              <hr></hr>
              <div className="col-md-12 mt-2 mb-2">
                <input
                  type="checkbox"
                  name="select_all"
                  checked={selectAllChecked}
                  onChange={handleCheckboxChangeAll}
                />
                <label className="mx-2 custom_checkbox ">
                  <h6 onClick={handleCheckboxChangeAll}>Select All</h6>
                </label>
              </div>

              {/* {fields.map((field, index) => (
                  <div className="col-md-3 mb-2" key={field}>
                    <input
                      type="checkbox"
                      name={field}
                      checked={selectedFieldIndices.includes(index)}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    <label className="mx-2 custom_checkbox">{field}</label>
                  </div>
                ))} */}

              {fields.map((field, index) => (
                <div className="col-md-3 mb-2" key={field}>
                  <div className="d-flex align-items-center p-2 border border-1 rounded">
                    <span>
                      <input
                        className="custom-checkbox-border"
                        type="checkbox"
                        name={field}
                        checked={selectedFieldIndices.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                      <label
                        className="mx-2 custom_checkbox"
                        onClick={() => handleCheckboxChange(index)}
                      >
                        {field}
                      </label>
                    </span>
                  </div>
                </div>
              ))}

              <div className="row custom_row justify-content-end align-center bg-white mt-3 mb-3 p-3">
                <div className="col-md-12 text-end">
                  <Link
                    href={slug}
                    className="text-decoration-none btn btn-danger light"
                  >
                    Cancel{" "}
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary light mx-1"
                    disabled={selectedFieldIndices.length === 0}
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <LoadingOverlay isLoading={loading} />
        <Toast ref={toastRef} />
      </main>
    </>
  );
}
