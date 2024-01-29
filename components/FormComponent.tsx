import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaWpforms } from "react-icons/fa";
import LoadingOverlay from "@/components/LoadingOverlay";
import Toast, { ToastType } from "@/components/Toast_old";
import { BsFileText, BsHouse } from "react-icons/bs";
import { useSession } from "next-auth/react";
import Select from "react-select";

// interface FormComponentInterface {
//   slug: string;
//   api: string;
//   type: string;
//   page: string;
//   method: string;
//   filter: string;
//   initialFormData: [];
//   endpoints: { url: string; name: string; link: string }[];
//   formFields: [];
//   insideModel: boolean;
//   showbreadCrumb: boolean;
//   removeId : string;
// }

export default function FormComponent({
  slug,
  api,
  type,
  page,
  method,
  filter,
  initialFormData,
  endpoints,
  formFields,
  segregate,
  additionalFormFields,
  insideModel,
  colcssClass,
  formheader,
  showbreadCrumb,
  removeId,
  api_name,
  bindToFields,
  onSubmit,
  componentFormData,
  usenum,
  onButtonClick,
}: FormComponentInterface) {
  const [dataStates, setDataStates] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toastRef = useRef<ToastType>();
  const appUrl = process.env.APP_URL || "";
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [effectiveDateValue, seteffectiveDateValue] = useState("");
  const [showchildField, setShowChildField] = useState(false);
  const [documentformData, setDocumentFormData] = useState({
    document: [],
  });

  const [formData, setFormData] = useState(initialFormData);

  const [selectLabelName, setSelectLabelName] = useState(null);
  const [viewDocument, setViewDocument] = useState<{
    document: string[];
  }>({
    document: [],
  });

  const session = useSession();
  const user_id = session.data?.user.id;
  colcssClass = colcssClass ?? "col-md-6";

  if (componentFormData) {
    useEffect(() => {
      componentFormData(formData);
    }, [formData]);
  }
  if (endpoints) {
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        const newDataStates = {};

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(`${endpoint.url}${filter}`);
            const data = await response.json();
            // newDataStates[endpoint.name] = data[endpoint.link];
            if (endpoint.link.includes("Row")) {
              const { ...rowData } = data[endpoint.link];
              const updatedFormData = { ...initialFormData };

              if (rowData.document) {
                setViewDocument((prevDocument) => ({
                  document: [...prevDocument.document, ...rowData.document],
                }));
              }

              for (const key in initialFormData) {
                if (rowData.hasOwnProperty(key)) {
                  if (key === "updated_date") {
                    updatedFormData[key] = new Date(rowData[key])
                      .toISOString()
                      .split("T")[0];
                  } else if (key === "legal_due_date") {
                    updatedFormData[key] = new Date(rowData[key])
                      .toISOString()
                      .split("T")[0];
                  } else if (key === "unit_head_due_date") {
                    updatedFormData[key] = new Date(rowData[key])
                      .toISOString()
                      .split("T")[0];
                  } else if (key === "function_head_due_date") {
                    updatedFormData[key] = new Date(rowData[key])
                      .toISOString()
                      .split("T")[0];
                  } else if (key === "evaluator_due_date") {
                    updatedFormData[key] = new Date(rowData[key])
                      .toISOString()
                      .split("T")[0];
                  } else if (key === "executor_due_date") {
                    updatedFormData[key] = new Date(rowData[key])
                      .toISOString()
                      .split("T")[0];
                  } else if (key === "first_alert") {
                    updatedFormData[key] = new Date(rowData[key])
                      .toISOString()
                      .split("T")[0];
                  } else if (key === "second_alert") {
                    updatedFormData[key] = new Date(rowData[key])
                      .toISOString()
                      .split("T")[0];
                  } else if (key === "third_alert") {
                    updatedFormData[key] = new Date(rowData[key])
                      .toISOString()
                      .split("T")[0];
                  } else if (key === "comments") {
                    updatedFormData[key] = rowData[key];
                    updatedFormData["comments_input"] = rowData["comments"];
                    setShowChildField(true);
                  } else {
                    updatedFormData[key] = rowData[key];
                  }
                }
              }
              if (endpoint.link == "userRow") {
                delete updatedFormData.password;
              }
              setFormData(updatedFormData);
            }
            if (endpoint.bindToFields) {
              newDataStates[endpoint.name] = data[endpoint.link];
            }
            if (endpoint.name == "filerUserRoles") {
              const userData = data[endpoint.link];
              console.log("userData", userData);

              const executor = [];
              const evaluator = [];
              const function_head = [];
              if (userData) {
                for (const user of userData) {
                  if (
                    user.role_id == 1 ||
                    user.role_id == 2 ||
                    user.role_id == 3
                  ) {
                    executor.push(user);
                    newDataStates[user.role.name] = executor;
                  }
                  if (user.role_id == 2 || user.role_id == 3) {
                    evaluator.push(user);
                    newDataStates[user.role.name] = evaluator;
                  }
                  if (user.role_id == 3) {
                    function_head.push(user);
                    newDataStates[user.role.name] = function_head;
                  }
                }
              }
            } else if (endpoint.link == "data") {
              newDataStates[endpoint.name] = [data[endpoint.link]];
            } else {
              newDataStates[endpoint.name] = data[endpoint.link];
            }
          } catch (error) {
            console.error(`Error fetching data from ${endpoint.url}:`, error);
          }
        }
        setDataStates(newDataStates);
        setLoading(false);
      };

      fetchData();
    }, []);
  }

  const handleOpenPdf = async (filename, e) => {
    e.preventDefault();

    const response = await fetch(
      `/api/document-upload-s3?filename=${filename}`
    );
    if (response.ok) {
      const documentResponse = await response.json();
      const url = documentResponse.url;
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.response;
      toastRef.current.show("Error", errorMessage);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let dataToSend = {
        ...formData,
      };

      if (removeId) {
        delete dataToSend[removeId];
      }

      for (const key in dataToSend) {
        if (
          dataToSend.hasOwnProperty(key) &&
          typeof dataToSend[key] === "string"
        ) {
          dataToSend[key] = dataToSend[key].trim().split(/ +/).join(" ");
        }
      }
      if (method === "POST") {
        delete dataToSend.id;
      }

      if (page === "Activity Completion" || page === "Activity Update") {
        if (documentformData.document.length !== 0) {
          dataToSend = {
            ...formData,
            document: [],
          };

          for (const file of documentformData.document) {
            const formData = new FormData();
            formData.append("document", file);
            console.log(file);
            const response = await fetch("/api/document-upload-s3", {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              const responsejson = await response.json();
              const responseMessage = responsejson.response;
              dataToSend.document.push(responseMessage);
            } else {
              const errorResponse = await response.json();
              const errorMessage = errorResponse.response;
            }
          }
        }

        if (dataToSend.comments == "Other") {
          dataToSend.comments = dataToSend.comments_input;
        }

        delete dataToSend.comments_input;
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

        if (page === "Activity Completion" || page === "Activity Update") {
          onButtonClick(1);
        }

        if (slug) {
          router.push(slug);
        }
      } else {
        setLoading(false);
        const errorResponse = await response.json();
        const errorMessage = errorResponse.response;
        toastRef.current.show("Error", errorMessage);
      }
    } catch (error) {
      setLoading(false);
      toastRef.current.show("Error", "An error occured while saving Entry");
    }
  };

  const handleChange = async (event) => {
    const { name } = event.target;

    if (name === "document") {
      setDocumentFormData((prevData) => ({
        ...prevData,
        document: Array.from(event.target.files),
      }));
    } else {
      const { value, type } = event.target;

      let parsedValue = value;

      if (name === "status") {
        let intValue = 1;
        if (value === "2") {
          intValue = 2;
        } else {
          intValue = 1;
        }
        parsedValue = intValue;
      } else if (name.endsWith("_id") && name !== "employee_id") {
        parsedValue = parseInt(value, 10);
      } else if (
        name === "proof_required" ||
        name === "historical" ||
        name === "activity_maker_checker" ||
        name === "back_dates" ||
        name === "due_date_buffer" ||
        name === "alert_prior_days"
      ) {
        parsedValue = parseInt(value, 10);
      }

      if (
        type === "text" ||
        type === "textarea" ||
        type === "email" ||
        type === "number" ||
        type === "tel" ||
        type === "textarea" ||
        type === "password"
      ) {
        const trimmedValue = value.trim();
        if (trimmedValue == "") {
          //parsedValue = null;
          setIsSubmitDisabled(true);
        } else {
          setIsSubmitDisabled(false);
        }
      }
      if (name === "due_date_buffer") {
        const bufferDays = parseInt(value, 10);
        if (!isNaN(bufferDays) && bufferDays !== 0) {
          setFormData((prevData) => {
            const unitHeadDueDate = new Date(prevData.legal_due_date);
            unitHeadDueDate.setDate(unitHeadDueDate.getDate() - bufferDays);
            const unitHeadDateString = unitHeadDueDate
              .toISOString()
              .split("T")[0];

            return {
              ...prevData,
              unit_head_due_date: unitHeadDateString,
            };
          });
          setFormData((prevData) => {
            const functionHeadDueDate = new Date(prevData.unit_head_due_date);
            functionHeadDueDate.setDate(
              functionHeadDueDate.getDate() - bufferDays
            );
            const functionHeadDateString = functionHeadDueDate
              .toISOString()
              .split("T")[0];

            return {
              ...prevData,
              function_head_due_date: functionHeadDateString,
            };
          });
          setFormData((prevData) => {
            const evaluatorDueDate = new Date(prevData.function_head_due_date);
            evaluatorDueDate.setDate(evaluatorDueDate.getDate() - bufferDays);
            const evaluatorDateString = evaluatorDueDate
              .toISOString()
              .split("T")[0];

            const executorDueDate = new Date(prevData.evaluator_due_date);
            executorDueDate.setDate(executorDueDate.getDate() - bufferDays);
            const executorDateString = executorDueDate
              .toISOString()
              .split("T")[0];

            return {
              ...prevData,
              evaluator_due_date: evaluatorDateString,
              executor_due_date: executorDateString,
            };
          });
          setFormData((prevData) => {
            const executorDueDate = new Date(prevData.evaluator_due_date);
            executorDueDate.setDate(executorDueDate.getDate() - bufferDays);
            const executorDateString = executorDueDate
              .toISOString()
              .split("T")[0];

            return {
              ...prevData,
              executor_due_date: executorDateString,
            };
          });
        }
      }

      if (name == "entity_id") {
        await fetchnewData(
          "/api/business-vertical?",
          "Business Vertical",
          "business_verticalList",
          "&filterentityId=" + value
        );
        await fetchnewData(
          "/api/zone?",
          "Zone",
          "zoneList",
          "&filterentityId=" + value
        );
        await fetchnewData(
          "/api/business-unit?",
          "Business Unit",
          "business_unitList",
          "&filterentityId=" + value
        );
      }

      if (name == "comments") {
        if (parsedValue == "Other") {
          setShowChildField(true);
        } else {
          setShowChildField(false);
        }
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]: parsedValue,
      }));
    }
  };

  const handleReactSelectChange = (selectedOption, meta) => {
    const { name } = meta;
    const value = selectedOption ? selectedOption.value : null;
    const type = meta.type; // Add type if needed, you may need to set it in the React Select options.

    let parsedValue = value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  const handleMultiSelectChange = (selectedOptions) => {
    // Update the form data or state with the selected values
    setFormData({
      ...formData,
      function_department_ids: selectedOptions.map((option) => option.value),
    });
  };

  const fetchnewData = async (url, name, link, filterby) => {
    setLoading(true);
    const newDataStates = dataStates;

    try {
      const response = await fetch(`${url}${filter}${filterby}`);
      const data = await response.json();
      newDataStates[name] = data[link];
      setDataStates(newDataStates);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
    setLoading(false);
    return;
  };

  return (
    <>
      <main className="h-100 pb-4">
        <div className="custom_row row h-100">
          {showbreadCrumb && (
            <div className="d-flex justify-content-start align-items-center">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <Link href="/" className=" breadcrumb-item">
                    <BsHouse className="mx-2" />
                  </Link>

                  <Link
                    href={slug}
                    className="text-decoration-none breadcrumb-item"
                  >
                    {page}
                  </Link>
                  <li className="breadcrumb-item active" aria-current="page">
                    {type} {page}
                  </li>
                </ol>
              </nav>
            </div>
          )}
          <form
            className="h-100 px-0 "
            onSubmit={onSubmit ? onSubmit : handleSubmit}
          >
            <div
              className={`row custom_row bg-white rounded-corner ${
                insideModel ? "p-1" : "p-3"
              }`}
            >
              {!insideModel && (
                <div className="col-md-12 mb-2 px-0">
                  <h6 className="fw-strong mt-2 mb-3 ">
                    <BsFileText size={23} className="mx-2" />
                    {page}
                  </h6>
                  <hr></hr>
                </div>
              )}

              {formFields.map((field, index) => (
                <div
                  key={index}
                  className={`${colcssClass} mb-3`}
                  style={{
                    display: field.hidden
                      ? showchildField
                        ? "block"
                        : "none"
                      : "block",
                  }}
                >
                  {field.label != null && (
                    <label
                      htmlFor={field.name}
                      className="form-label text-muted"
                    >
                      {field.label}{" "}
                      {field.required && <span className="text-danger">*</span>}
                    </label>
                  )}
                  {field.type === "select" ? (
                    <select
                      className="form-select form-control input-padding"
                      id={field.name}
                      name={field.name}
                      onChange={handleChange}
                      multiple={field.multiselect}
                      required={field.required}
                      disabled={
                        field.name === "state_id" &&
                        formData["is_federal"] === true
                          ? true
                          : field.disabled
                      }
                      {...(field.multiselect
                        ? {}
                        : { value: formData[field.name] })}
                    >
                      <option
                        selected
                        disabled={
                          field.name === "state_id" &&
                          formData["is_federal"] === true
                            ? false
                            : true
                        }
                      >
                        Select {field.label}
                      </option>
                      {field.api ? (
                        Array.isArray(dataStates[field.label]) &&
                        dataStates[field.label].length > 0 ? (
                          dataStates[field.label].map((item, index) =>
                            field.apitype === "enum" ? (
                              Object.keys(item).map((key) => (
                                <option
                                  key={key}
                                  value={key}
                                  selected={key === formData[field.name]}
                                >
                                  {item[key]}
                                </option>
                              ))
                            ) : field.apitype === "custom" ? (
                              <option
                                key={item.name}
                                value={item.name}
                                selected={item.name === formData[field.name]}
                              >
                                {item.name}
                              </option>
                            ) : (
                              <option
                                key={item.id}
                                value={item.id}
                                selected={
                                  item.id === 104 ||
                                  item.id === formData[field.name]
                                }
                              >
                                {item.name}
                              </option>
                            )
                          )
                        ) : (
                          <option>No data available</option>
                        )
                      ) : field.api_name ? (
                        Array.isArray(dataStates[field.api_name]) &&
                        dataStates[field.api_name].length > 0 &&
                        dataStates[field.api_name].map((item, index) => (
                          <option
                            key={item.id}
                            value={item.id}
                            selected={
                              item.id === 104 ||
                              item.id === formData[field.name]
                            }
                          >
                            {item[field.name]}
                          </option>
                        ))
                      ) : (
                        field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))
                      )}
                    </select>
                  ) : field.type === "searchable-select" ? (
                    <Select
                      id={field.name}
                      name={field.name}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(selectedOption, meta) =>
                        handleReactSelectChange(selectedOption, meta)
                      }
                      required={field.required}
                      isDisabled={
                        field.name === "state_id" &&
                        formData["is_federal"] === true
                      }
                      options={
                        field.api
                          ? Array.isArray(dataStates[field.label]) &&
                            dataStates[field.label].length > 0
                            ? dataStates[field.label].map((item) =>
                                field.apitype === "enum"
                                  ? Object.keys(item).map((key) => ({
                                      value: key,
                                      label: item[key],
                                    }))
                                  : {
                                      value: item.id,
                                      label: item.name,
                                    }
                              )
                            : [{ value: null, label: "No data available" }]
                          : field.api_name
                          ? Array.isArray(dataStates[field.api_name]) &&
                            dataStates[field.api_name].length > 0
                            ? dataStates[field.api_name].map((item) => ({
                                value: item.id,
                                label: item[field.name],
                                isSelected:
                                  item.id === 104 ||
                                  item.id === formData[field.name],
                              }))
                            : [{ value: null, label: "No data available" }]
                          : field.options.map((option) => ({
                              value: option.value,
                              label: option.label,
                            }))
                      }
                      value={
                        formData[field.name]
                          ? {
                              value: formData[field.name],
                              label:
                                dataStates[field.label]?.find(
                                  (item) => item.id === formData[field.name]
                                )?.name || "",
                            }
                          : null
                      }
                    />
                  ) : field.type === "multi-select" ? (
                    <Select
                      className="basic-multi-select"
                      id={field.name}
                      name={field.name}
                      isMulti
                      classNamePrefix="select"
                      onChange={handleMultiSelectChange}
                      required={field.required}
                      options={
                        field.api
                          ? Array.isArray(dataStates[field.label]) &&
                            dataStates[field.label].length > 0
                            ? dataStates[field.label].map((item, index) =>
                                field.apitype === "enum"
                                  ? Object.keys(item).map((key) => ({
                                      value: key,
                                      label: item[key],
                                    }))
                                  : {
                                      value: item.id,
                                      label: item.name,
                                    }
                              )
                            : [{ value: "No data", label: "No data available" }]
                          : field.options.map((option) => ({
                              value: option.key,
                              label: option.value,
                            }))
                      }
                    />
                  ) : field.type === "textarea" ? (
                    <textarea
                      className="form-control input-padding"
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      rows="4"
                      cols="50"
                      required={field.required}
                      disabled={field.disabled}
                    />
                  ) : (
                    <input
                      type={field.type}
                      className={
                        field.name === "date"
                          ? "form-control"
                          : "form-control datecss"
                      }
                      // className="form-control input-padding"
                      id={field.name}
                      name={field.name}
                      value={
                        field.name === "password" && type === "Edit"
                          ? undefined
                          : formData[field.name]
                      }
                      placeholder={
                        field.name === "password" && type === "Edit"
                          ? "Leave blank if you dont want to change the password!"
                          : ""
                      }
                      onChange={handleChange}
                      required={field.required}
                      multiple={field.multiple}
                      disabled={field.disabled}
                    />
                  )}
                </div>
              ))}
              {segregate && (
                <div className="col-md-12 mb-2 mt-3">
                  <h6 className="fw-strong ">{segregate} </h6>
                  <hr></hr>
                </div>
              )}
              {segregate &&
                additionalFormFields &&
                additionalFormFields.length > 0 &&
                additionalFormFields.map((field, index) => (
                  <div
                    key={index}
                    className="col-md-6 mb-3"
                    style={{
                      display: field.hidden
                        ? showchildField
                          ? "block"
                          : "none"
                        : "block",
                    }}
                  >
                    <label
                      htmlFor={field.name}
                      className="form-label text-muted"
                    >
                      {field.label}{" "}
                      {field.required && <span className="text-danger">*</span>}
                    </label>
                    {field.type === "select" ? (
                      <select
                        className="form-select form-control input-padding"
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        multiple={field.multiselect}
                        required={field.required}
                        disabled={
                          field.name === "state_id" &&
                          formData["is_federal"] === true
                            ? true
                            : field.disabled
                        }
                      >
                        <option
                          value=""
                          selected
                          disabled={
                            field.name === "state_id" &&
                            formData["is_federal"] === true
                              ? false
                              : true
                          }
                        >
                          Select {field.label}
                        </option>
                        {field.api ? (
                          Array.isArray(dataStates[field.label]) &&
                          dataStates[field.label].length > 0 ? (
                            dataStates[field.label].map((item, index) =>
                              field.apitype === "enum" ? (
                                Object.keys(item).map((key) => (
                                  <option
                                    key={key}
                                    value={key}
                                    selected={key === formData[field.name]}
                                  >
                                    {item[key]}
                                  </option>
                                ))
                              ) : (
                                <option
                                  key={item.id}
                                  value={item.id}
                                  selected={
                                    item.id === 104 ||
                                    item.id === formData[field.name]
                                  }
                                >
                                  {item.name}
                                </option>
                              )
                            )
                          ) : (
                            <option>No data available</option>
                          )
                        ) : field.api_name ? (
                          Array.isArray(dataStates[field.api_name]) &&
                          dataStates[field.api_name].length > 0 &&
                          dataStates[field.api_name].map((item, index) => (
                            <option
                              key={item.id}
                              value={item.id}
                              selected={
                                item.id === 104 ||
                                item.id === formData[field.name]
                              }
                            >
                              {item[field.name]}
                            </option>
                          ))
                        ) : (
                          field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))
                        )}
                      </select>
                    ) : field.type == "multi-select" ? (
                      // <select
                      //   className="selectpicker"
                      //   multiple
                      //   aria-label="Default select example"
                      //   data-live-search="true"
                      // >
                      //   <option value="1">One</option>
                      //   <option value="2">Two</option>
                      //   <option value="3">Three</option>
                      //   <option value="4">Four</option>
                      // </select>
                      <select
                        className="form-select form-control input-padding"
                        multiple
                        aria-label="multiple select example"
                      >
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        className="form-control input-padding"
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        rows="4"
                        cols="50"
                        required={field.required}
                        disabled={field.disabled}
                      />
                    ) : (
                      <input
                        type={field.type}
                        className={
                          field.name === "date"
                            ? "form-control"
                            : "form-control datecss"
                        }
                        // className="form-control input-padding"
                        id={field.name}
                        name={field.name}
                        value={
                          field.name === "password" && type === "Edit"
                            ? undefined
                            : formData[field.name]
                        }
                        placeholder={
                          field.name === "password" && type === "Edit"
                            ? "Leave blank if you dont want to change the password!"
                            : ""
                        }
                        onChange={handleChange}
                        required={field.required}
                        multiple={field.multiple}
                        disabled={field.disabled}
                      />
                    )}
                  </div>
                ))}

              {/* {viewDocument && viewDocument.document.length > 0 && (
                <div>
                  <label className="form-label text-muted">
                    Document Uploaded
                  </label>
                  {viewDocument.document.map((document, index) => (
                    <button
                      key={index}
                      className="btn btn-primary light mx-2"
                      onClick={(e) => handleOpenPdf(document, e)}
                    >
                      <FaWpforms className="mb-1 mx-1" />
                      View Document {index + 1}
                    </button>
                  ))}
                </div>
              )} */}

              {type === "View" ? (
                <></>
              ) : (
                <div className="col-md-12 text-end">
                  {!insideModel && (
                    <Link
                      href={slug}
                      className="btn btn-outline-dark btn-hover-none btn-active-none mx-1 text-decoration-none text-dark"
                    >
                      Cancel{" "}
                    </Link>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="btn btn-primary light mx-2"
                  >
                    {type} {!insideModel ?? page}
                  </button>
                </div>
              )}
            </div>
          </form>
          {/* </div> */}
        </div>

        <LoadingOverlay isLoading={loading} />
        <Toast ref={toastRef} />
      </main>
    </>
  );
}
