import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { FaFilter, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { BsHouse } from "react-icons/bs";
import LoadingOverlay from "@/components/LoadingOverlay";
import Toast, { ToastType } from "@/components/Toast_old";

export default function ExpandSearchComponent({
  showbreadCrumb,
  slug,
  page,
  formFields,
  advancedFormFields,
  buttonName,
  filterState,
  onButtonClick,
  previousPage,
  title,
  api,
  type,
  method,
  filter,
  initialFormData,
  endpoints,
  onFilterDataCallback,
  listname,
  columnsToFetch,
  bindToFields,
  api_name,
}) {
  filterState = filterState ?? false;
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [showSearchComponent, setShowSearchComponent] = useState(filterState);
  const filterValue = null;

  const [dataStates, setDataStates] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toastRef = useRef<ToastType>();
  const [effectiveDateValue, seteffectiveDateValue] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const handleClick = () => {
    const responseData = true;
    onButtonClick(responseData);
  };

  const toggleAdvancedFields = () => {
    setShowAdvancedFields(!showAdvancedFields);
  };

  const toggleSearchComponent = () => {
    setShowSearchComponent(!showSearchComponent);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const newDataStates = {};

      for (const endpoint of endpoints) {
        console.log("cols:", endpoint.columnsToFetch);
        try {
          const response = await fetch(
            endpoint.columnsToFetch
              ? `${endpoint.url}${filter}${
                  "&columnName=" + endpoint.columnsToFetch.join(",")
                }`
              : `${endpoint.url}${filter}`
          );
          const data = await response.json();
          // newDataStates[endpoint.name] = data[endpoint.link];

          if (endpoint.link.includes("Row")) {
            const { ...rowData } = data[endpoint.link];
            const updatedFormData = { ...initialFormData };

            if (endpoint.link == "userRow") {
              delete updatedFormData.password;
            }
            setFormData(updatedFormData);
          }
          if (endpoint.link == "data") {
            newDataStates[endpoint.name] = [data[endpoint.link]];
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
          } else {
            newDataStates[endpoint.name] = data[endpoint.link];
          }
        } catch (error) {
          console.error(`Error fetching data from ${endpoint.url}:`, error);
        }
      }
      setDataStates(newDataStates);
      setLoading(false);

      console.log(newDataStates);
      console.log(dataStates);
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
      };

      for (const key in dataToSend) {
        if (
          dataToSend.hasOwnProperty(key) &&
          typeof dataToSend[key] === "string"
        ) {
          dataToSend[key] = dataToSend[key].trim().split(/ +/).join(" ");
        }
      }

      let filterValue = "";

      if (dataToSend.legislation) {
        filterValue =
          filterValue + "&filterLegislation=" + dataToSend.legislation;
      }
      if (dataToSend.rule) {
        filterValue = filterValue + "&filterRule=" + dataToSend.rule;
      }

      onFilterDataCallback(filterValue);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toastRef.current.show("Error", "An error occured while saving Entry");
    }
  };

  const handleChange = async (event) => {
    const { name, value, type } = event.target;

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
    }

    if (
      type === "text" ||
      type === "textarea" ||
      type === "email" ||
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

    if (name == "entity_id") {
      await fetchnewData(
        "/api/business-unit?",
        "Business Unit",
        "business_unitList",
        "&filterentityId=" + value
      );
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
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
      <main>
        <div className="d-flex justify-content-between align-items-center">
          {showbreadCrumb && (
            <div className="d-flex justify-content-start align-items-center mb-2">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <Link href="/" className=" breadcrumb-item">
                    <BsHouse className="mb-1 mx-3" />
                  </Link>
                  <Link
                    href={slug}
                    className="text-decoration-none breadcrumb-item"
                  >
                    {previousPage}
                  </Link>
                  <li className="breadcrumb-item active" aria-current="page">
                    {title}
                  </li>
                </ol>
              </nav>
            </div>
          )}
        </div>
        <form className="h-100 px-0" onSubmit={handleSubmit}>
          <div className="row custom_row bg-white rounded-corner p-3">
            <div className="col-md-12 px-0">
              <div className="row justify-content-between align-items-center">
                <div className="col-md-8">
                  <h6 className="text-muted m-0">
                    <FaFilter className="mb-1 mx-3 text-muted" />
                    {page}
                  </h6>
                </div>
                <div className="col-md-1">
                  <button
                    className="btn btn-none fw-strong"
                    onClick={toggleSearchComponent}
                  >
                    {showSearchComponent ? (
                      <FaAngleUp
                        size={20}
                        className="mx-3 text-primary fw-bold"
                      />
                    ) : (
                      <FaAngleDown
                        size={20}
                        className="mx-3 text-primary fw-bold"
                      />
                    )}
                  </button>
                </div>
              </div>

              {showSearchComponent && <hr></hr>}
            </div>

            {showSearchComponent && (
              <div className="row search_component_main">
                {formFields.map((field, index) => (
                  <div
                    key={index}
                    className={
                      field.large === true ? "col-md-12 mb-3" : "col-md-4 mb-3"
                    }
                  >
                    <label
                      htmlFor={field.name}
                      className="form-label text-muted"
                    >
                      {field.label.includes("\n") && <br />}
                      {field.label}{" "}
                      {field.required && <span className="text-danger">*</span>}
                    </label>
                    {field.type === "select" ? (
                      <select
                        className="form-select form-control input-padding"
                        id={field.name}
                        name={field.name}
                        onChange={handleChange}
                        value={formData[field.name]}
                        required={field.required}
                        disabled={field.disabled}
                      >
                        <option value="" selected disabled>
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
                    ) : field.type === "textarea" ? (
                      <textarea
                        className="form-control input-padding"
                        id={field.name}
                        name={field.name}
                        rows="1"
                        cols="50"
                        required={field.required}
                        disabled={field.disabled}
                      />
                    ) : (
                      <input
                        type={field.type}
                        className={
                          field.name === "date"
                            ? "form-control input-padding"
                            : "form-control datecss input-padding"
                        }
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        disabled={field.disabled}
                      />
                    )}
                  </div>
                ))}

                {showAdvancedFields ? (
                  <div className="row">
                    {advancedFormFields.map((field, index) => (
                      <div key={index} className="col-md-4 mb-3">
                        <label
                          htmlFor={field.name}
                          className="form-label text-muted"
                        >
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-danger">*</span>
                          )}
                        </label>
                        {field.type === "select" ? (
                          <select
                            className=" form-select form-control input-padding"
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            disabled={field.disabled}
                          >
                            <option value="" selected disabled>
                              Select {field.label}
                            </option>
                            {field.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "textarea" ? (
                          <textarea
                            className="form-control input-padding"
                            id={field.name}
                            name={field.name}
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
                                ? "form-control input-padding"
                                : "form-control datecss input-padding"
                            }
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            disabled={field.disabled}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div></div>
                )}

                {advancedFormFields ? (
                  <div>
                    <div className=" text-end">
                      <button
                        onClick={handleClick}
                        className="btn light btn-primary mx-1"
                      >
                        {buttonName ? buttonName : "Search"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-info light mx-1"
                        onClick={toggleAdvancedFields}
                      >
                        {showAdvancedFields
                          ? "Collapse Advanced Search"
                          : "Advanced Search"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className=" text-end">
                        <button
                          onClick={handleClick}
                          type="submit"
                          className="btn light btn-primary mx-1"
                        >
                          {buttonName ? buttonName : "Search"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </form>
        <LoadingOverlay isLoading={loading} />
        <Toast ref={toastRef} />
      </main>
    </>
  );
}
