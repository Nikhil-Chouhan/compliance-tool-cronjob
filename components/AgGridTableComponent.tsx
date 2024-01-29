import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { GridApi, ColDef, GridReadyEvent } from "ag-grid-community";
import { FaPlus } from "react-icons/fa";
import {
  BsCardList,
  BsPencil,
  BsTrash,
  BsEye,
  BsCheck2Circle,
  BsXCircle,
  BsHouse,
  BsPersonLock,
} from "react-icons/bs";

import Link from "next/link";
import Toast, { ToastType } from "@/components/Toast_old";
import AgGridLoader from "@/components/AgGridLoader";
import { Button, Modal } from "react-bootstrap";
import { removeUnderscoreAndAddSpace } from "@/app/utils/modelUtils";
import { boolean } from "zod";

interface Column {
  tablefield: any;
  headerName: string;
  field: string;
  parentapi: string;
  isapi: boolean;
  ischildapi: boolean;
  isenum: boolean;
  flex: number;
  table: string;
  child_table: string;
  innerchild_table: string;
  download: boolean;
}

interface GridComponentProps {
  slug: string;
  api: string;
  page: string;
  customColumns: Column[];
  modalData: [];
  edit: string;
  aggridHeight: string;
  aggridPadding: string;
  actionBtn: boolean;
  importBtn: boolean;
  exportBtn: boolean;
  addBtn: boolean;
  customBtn: string;
  pagecustomBtn: string;
  pagecustomSlug: string;
  checkBox: boolean;
  checkboxActivity: boolean;
  extraActionBtn: string;
  activateActionBtn: string;
  customCheckboxMethod: string;
  gridApiRef: string;
  rowClickSelection: boolean;
  handleRowClick: string;
  handleCellClick: string;
  showbreadCrumb: boolean;
  previousPage: string;
  filter: string;
  listname: string;
  refreshAGGrid: boolean;
  customGridReady: string;
}

export default function AgGridTableComponent({
  slug,
  api,
  page,
  customColumns,
  customRows,
  edit,
  modalData,
  aggridHeight,
  aggridPadding,
  actionBtn,
  importBtn,
  exportBtn,
  addBtn,
  customBtn,
  pagecustomBtn,
  pagecustomSlug,
  onButtonClick,
  onItemClick,
  checkBox,
  checkboxActivity,
  extraActionBtn,
  activateActionBtn,
  customCheckboxMethod,
  gridApiRef,
  rowClickSelection,
  handleRowClick,
  handleCellClick,
  showbreadCrumb,
  filter,
  listname,
  refreshAGGrid,
  propOnGridReady,
  onEditClick,
}: GridComponentProps) {
  const handleCheckboxMethod = customCheckboxMethod;
  aggridHeight = aggridHeight ?? "670px";
  aggridPadding = aggridPadding ?? "p-3";
  const toastRef = useRef<ToastType>();
  const [rowData, setRowData] = useState(customRows ? customRows : []);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [paginationPageSize] = useState(10);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showAuditConfirmationModal, setshowAuditConfirmationModal] =
    useState(false);
  const [itemToModify, setItemToModify] = useState(null);
  const [refreshGrid, setRefreshGrid] = useState(refreshAGGrid ?? false);
  const [viewDocument, setViewDocument] = useState({
    document: [],
  });
  const viewDocumentRef = useRef(viewDocument);

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
    setGridApi(params.api);
    if (propOnGridReady && params.api) {
      console.log("params.api:", params.api);

      propOnGridReady(params.api);
    }
  };

  const showConfirmation = (item) => {
    setItemToModify(item);
    setShowConfirmationModal(true);
  };

  const confirmAction = () => {
    if (itemToModify) {
      if (itemToModify.status !== undefined) {
        handleStatusChange(itemToModify.id, itemToModify.status);
      } else {
        handleDelete(itemToModify.id);
      }
    }
    setShowConfirmationModal(false);
  };

  const handleClick = () => {
    const responseData = true;
    const responseKey = true;

    onButtonClick(responseData, responseKey);
  };

  const handleCompleteConfirmation = () => {
    setShowConfirmationModal(false);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmationModal(false);
  };

  const columnDefs = (showCheckbox) => {
    const columns = customColumns.map((column) => {
      return {
        headerName: column.headerName,
        field: column.field,
        flex: column.flex,
        filter: "agTextColumnFilter",
        minWidth: 200,
        cellClass: "custom-cell centered-cell",
        cellRenderer: (params) => {
          const fieldtext = params.data[column.field];
          return (
            <div
              title={fieldtext}
              className={` ${
                column.islink ? "text-primary text-decoration-underline" : ""
              }`}
            >
              {fieldtext}
            </div>
          );
        },
      };
    });

    if (showCheckbox) {
      columns.unshift({
        headerName: "Select",
        headerCheckboxSelection: true,
        checkboxSelection: true,
        cellClass: "custom-cell centered-cell",
        width: 120,
        filter: false,
        editable: false,
        sortable: false,
        resizable: false,
        floatingFilter: false,
      });
    }

    if (edit || activateActionBtn) {
      let activity_history_status;
      columns.push({
        headerName: "Action",
        cellClass: "custom-cell centered-align-cell",
        cellRenderer: (params) => {
          const rowId = params.data.id;
          const status = params.data.status;
          const completed_by = params.data.first_name
            ? params.data.first_name
            : "";
          const completed_on = params.data.completion_date
            ? params.data.completion_date
            : "";
          activity_history_status = params.data.activity_history_status
            ? params.data.activity_history_status
            : "";
          return (
            <>
              <div className="justify-content-center align-items-center">
                {edit === "Edit" ? (
                  <>
                    <button
                      className="btn btn-link text-center text-decoration-none fs-14 p-1"
                      onClick={() => onEditClick(rowId)}
                    >
                      <BsPencil className="text-primary mx-1" />
                    </button>
                  </>
                ) : edit === "ActivityAction" ? (
                  completed_by && completed_on ? (
                    <div className="text-center mt-1">
                      <button
                        className="btn btn-info light"
                        onClick={() => onButtonClick(rowId, 1)}
                      >
                        Update
                      </button>
                      {activity_history_status === "Non Complied" ? (
                        <button
                          className="btn btn-danger light mt-1 mb-1"
                          style={{ whiteSpace: "nowrap" }}
                          onClick={() => onButtonClick(rowId, 2)}
                        >
                          Non Compliance Reason
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <button
                      className="btn btn-success light "
                      onClick={() => onButtonClick(rowId, 0)}
                    >
                      Complete
                    </button>
                  )
                ) : (
                  <button className="btn btn-primary light ">{edit}</button>
                )}
                {activateActionBtn && (
                  <>
                    {status === 0 ? (
                      <button
                        className="d-flex align-items-center btn btn-success light "
                        onClick={() =>
                          showConfirmation({
                            id: params.data.id,
                            status: 1,
                          })
                        }
                      >
                        <BsCheck2Circle className="mx-1" />
                        Activate
                      </button>
                    ) : (
                      <button
                        className="d-flex align-items-center btn btn-danger light "
                        onClick={() =>
                          showConfirmation({
                            id: params.data.id,
                            status: 0,
                          })
                        }
                      >
                        <BsXCircle className="mx-1" /> Deactivate
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          );
        },
        width: 190,
        editable: false,
        sortable: false,
        resizable: false,
        floatingFilter: false,
        pinned: "right",
      });
    }
    // if (extraActionBtn && !edit) {
    //   columns.push({
    //     headerName: "",
    //     cellClass: "custom-cell centered-align-cell",
    //     cellRenderer: () => {
    //       return (
    //         <>
    //           {extraActionBtn === "Deactivate" ? (
    //             <Link className="text-decoration-none" href={``}>
    //               <BsXCircle className="m1-1 mx-1" />
    //             </Link>
    //           ) : (
    //             <button className="btn btn-primary light ">
    //               {extraActionBtn}
    //             </button>
    //           )}
    //         </>
    //       );
    //     },
    //     width: 105,
    //     editable: false,
    //     sortable: false,
    //     resizable: false,
    //     floatingFilter: false,
    //     pinned: "right",
    //   });
    // }

    if (actionBtn || extraActionBtn) {
      columns.push({
        headerName: "Action",
        cellClass: "custom-cell centered-align-cell",
        cellRenderer: (params) => {
          const entryId = params.data.id;
          const status = params.data.status;

          return (
            <>
              <div className="d-flex justify-content-center align-items-center">
                <button
                  title={`Change Status to ${
                    status === 1 ? "Inactive" : "Active"
                  }`}
                  className="btn btn-link text-decoration-none fs-14 p-1"
                  onClick={() =>
                    showConfirmation({
                      id: params.data.id,
                      status: status === 1 ? 2 : 1,
                    })
                  }
                >
                  {status === 1 ? (
                    <BsXCircle className="text-decoration-none" />
                  ) : (
                    <BsCheck2Circle className="text-decoration-none" />
                  )}
                </button>

                {extraActionBtn === "Set User Access" && (
                  <button className="btn btn-link text-decoration-none fs-14 p-1">
                    <Link
                      title="Set User Access"
                      className="text-decoration-none"
                      href={`${slug}/user_access?id=${entryId}`}
                    >
                      <BsPersonLock className="text-decoration-none" />
                    </Link>
                  </button>
                )}

                <button className="btn btn-link text-decoration-none fs-14 p-1">
                  <Link
                    title="View"
                    className="text-decoration-none"
                    href={`${slug}/view?id=${entryId}`}
                  >
                    <BsEye className="text-decoration-none" />
                  </Link>
                </button>

                <button className="btn btn-link text-decoration-none fs-14 p-1">
                  <Link
                    title="Edit"
                    className="text-decoration-none"
                    href={`${slug}/edit?id=${entryId}`}
                  >
                    <BsPencil className="text-decoration-none" />
                  </Link>
                </button>

                <button
                  title="Delete"
                  className="btn btn-link text-decoration-none fs-14 p-1"
                  onClick={() => showConfirmation({ id: entryId })}
                >
                  <BsTrash className="text-decoration-none" />
                </button>
              </div>
            </>
          );
        },
        width: extraActionBtn ? 120 : 105,
        filter: false,
        editable: false,
        sortable: false,
        resizable: false,
        floatingFilter: false,
        pinned: "right",
      });
    }

    return columns;
  };

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: true,
      sortable: true,
      editable: false,
      headerClass: "centered-header",
      autoSizeColumn: true,
      flex: 1,
      resizable: true,
      autoHeight: true,
      cellStyle: { "white-space": "normal" },
    };
  }, []);

  const gridOptions = {
    pagination: true,
    paginationPageSize: paginationPageSize,
    alwaysShowVerticalScroll: true,
    onCellClicked: (event: CellClickedEvent) => {
      if (event && event.column && event.column.getColId) {
        const columnName = event.column.getColId
          ? event.column.getColId()
          : "Unknown Column";

        if (columnName == "certificate" || columnName == "documents") {
          const url = "/sample-data/SamplePDF.pdf";
          const a = document.createElement("a");
          a.href = url;
          a.download = "certificate_sample.pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
        }

        if (page == "Activity History") {
          if (columnName == "document") {
            const documentArray = viewDocumentRef.current;
            if (
              documentArray &&
              documentArray.document &&
              documentArray.document.length > 0
            ) {
              documentArray.document.forEach((filename) => {
                handleOpenPdf(filename);
              });
            } else {
              console.log("Document array is empty or undefined");
            }
          }
        }

        if (page != "Activity Configuration" && page != "Activities") {
          if (columnName == "unit_activity_id") {
            onItemClick(event);
          }
        }
      }
    },
  };

  const handleOpenPdf = async (filename) => {
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

  useEffect(() => {
    viewDocumentRef.current = viewDocument;
  }, [viewDocument]);

  useEffect(() => {
    if (gridApi) {
      gridApi.showLoadingOverlay();
      console.log("filter : ", filter);
      fetch(`${api}${filter}`)
        .then((response) => response.json())
        .then((data) => {
          const entrylist = data[listname];
          console.log("entrylist:", entrylist);

          const mappedData = entrylist.map((item) => {
            const rowData = {
              id: item.id,
              uuid: item.uuid,
              status: item.status,
            };

            customColumns.forEach((column) => {
              if (
                column.isapi &&
                !column.table &&
                !column.child_table &&
                !column.innerchild_table
              ) {
                if (
                  item[column.field] !== null &&
                  item[column.field].hasOwnProperty("name")
                ) {
                  rowData[column.field] = item[column.field]["name"];
                }
              } else if (
                column.table &&
                !column.child_table &&
                !column.innerchild_table
              ) {
                if (item[column.field] !== null && !column.tablefield) {
                  rowData[column.field] = item[column.table][column.field]
                    ? item[column.table][column.field]
                    : "N/A";
                }

                if (item[column.field] !== null && column.tablefield) {
                  rowData[column.field] = item[column.table][column.tablefield]
                    ? item[column.table][column.tablefield]
                    : "N/A";
                }
              } else if (
                column.table &&
                column.child_table &&
                !column.innerchild_table
              ) {
                if (item[column.field] !== null && !column.tablefield) {
                  rowData[column.field] = item[column.table][
                    column.child_table
                  ][column.field]
                    ? item[column.table][column.child_table][column.field]
                    : "N/A";
                }
                if (item[column.field] !== null && column.tablefield) {
                  rowData[column.field] = item[column.table][
                    column.child_table
                  ][column.tablefield]
                    ? item[column.table][column.child_table][column.tablefield]
                    : "N/A";
                }
              } else if (
                column.table &&
                column.child_table &&
                column.innerchild_table
              ) {
                if (item[column.field] !== null) {
                  rowData[column.field] = item[column.table][
                    column.child_table
                  ][column.innerchild_table][column.field]
                    ? item[column.table][column.child_table][
                        column.innerchild_table
                      ][column.field]
                    : "N/A";
                }
                // if (item[column.field] !== null && column.tablefield) {
                //   rowData[column.field] =
                //     item[column.table][column.child_table][column.tablefield];
                // }
              } else if (column.ischildapi) {
                if (
                  item[column.parentapi] !== null &&
                  item[column.parentapi].hasOwnProperty(column.field)
                ) {
                  if (
                    item[column.parentapi][column.field] !== null &&
                    item[column.parentapi][column.field].hasOwnProperty("name")
                  ) {
                    rowData[column.field] =
                      item[column.parentapi][column.field]["name"];
                  }
                }
              } else {
                if (column.isenum && item[column.field] != null) {
                  rowData[column.field] = removeUnderscoreAndAddSpace(
                    item[column.field]
                  );
                } else if (column.download && item[column.field].length !== 0) {
                  // setViewDocument((prevViewDocument) => ({
                  //   ...prevViewDocument,
                  //   document: item[column.field],
                  // }));
                  setViewDocument({
                    document: item[column.field],
                  });
                  rowData[column.field] = "Click to download Documents";
                } else {
                  if (column.field == "state" && item[column.field] == null) {
                    rowData[column.field] = "Central";
                  } else {
                    rowData[column.field] = item[column.field];
                  }
                }
              }
            });

            return rowData;
          });
          setRowData(mappedData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          gridApi.hideOverlay();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridApi]);

  const handleStatusChange = (id, status) => {
    gridApi?.showLoadingOverlay();
    const requestBody = {
      id,
      type: "patch",
      status,
    };
    fetch(`${api}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then(() => {
        toastRef.current.show("Success", "Status Updated");
        const updatedRowIndex = rowData.findIndex((row) => row.id === id);
        if (updatedRowIndex !== -1) {
          const updatedRowData = [...rowData];
          updatedRowData[updatedRowIndex].status = status;
          setRowData(updatedRowData);
        }
      })
      .catch(() => {
        toastRef.current.show("Error", "Error Updating Status");
      })
      .finally(() => {
        gridApi?.hideOverlay();
      });
  };

  const handleDelete = (entryId) => {
    gridApi?.showLoadingOverlay();
    const requestBody = {
      id: entryId,
      type: "delete",
    };
    fetch(`${api}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then(() => {
        toastRef.current.show("Success", "Entry Deleted Successfully");
        setRefreshGrid((prevRefreshGrid) => !prevRefreshGrid);
        gridApi.hideOverlay();
      })
      .catch(() => {
        toastRef.current.show("Error", "Error Deleting Entry");
      })
      .finally(() => {
        gridApi?.hideOverlay();
      });
  };

  return (
    <>
      <main>
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
                  {page}
                </Link>
                <li className="breadcrumb-item active" aria-current="page">
                  {page}
                </li>
              </ol>
            </nav>
          </div>
        )}
        <div className={`card rounded-corner h-100 ${aggridPadding}`}>
          <div className="col-md-12 px-0">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h6 className="fw-strong">
                {page && <BsCardList size={25} className="mx-2" />}
                {page}
              </h6>
              <div className="d-flex ml-auto">
                {importBtn && (
                  <div>
                    <Link
                      href={`${slug}/import`}
                      className="btn btn-primary light px-2 mx-2 py-1"
                    >
                      <FaPlus className="mb-1 mx-1" /> Import
                    </Link>
                  </div>
                )}
                {addBtn && (
                  <Link
                    href={`${slug}/add`}
                    className="btn btn-primary light px-2 mx-2 py-1"
                  >
                    <FaPlus className="mb-1 mx-1" /> Add
                  </Link>
                )}
                {checkboxActivity && (
                  <div>
                    <button
                      className="btn btn-success light px-2 mx-2 py-1"
                      onClick={() =>
                        showConfirmation({
                          id: gridApi
                            .getSelectedNodes()
                            .map((node) => node.data.id),
                          status: 1,
                        })
                      }
                    >
                      <BsCheck2Circle className="mb-1 mx-1" /> Activate
                    </button>
                    <button
                      className="btn btn-danger light px-2 mx-2 py-1"
                      onClick={() =>
                        showConfirmation({
                          id: gridApi
                            .getSelectedNodes()
                            .map((node) => node.data.id),
                          status: 0,
                        })
                      }
                    >
                      <BsXCircle className="mb-1 mx-1" /> Deactivate
                    </button>
                  </div>
                )}
                {exportBtn && (
                  <Link
                    href="/sample-data/sampleCSV.csv"
                    target="_blank"
                    download
                    className="btn btn-primary light px-2 mx-2 py-1"
                  >
                    <FaPlus className="mb-1 mx-1" /> Export
                  </Link>
                )}
                {customBtn && (
                  <button
                    className="btn btn-primary light px-2 mx-2 py-1"
                    onClick={handleClick}
                  >
                    <FaPlus className="mb-1 mx-1" /> {customBtn}
                  </button>
                )}
                {pagecustomBtn && (
                  <Link
                    href={`${pagecustomSlug}`}
                    className="btn btn-primary light px-2 mx-2 py-1"
                  >
                    <BsPencil className="mb-1 mx-1" /> {pagecustomBtn}
                  </Link>
                )}
              </div>
            </div>

            <div
              className="ag-theme-quartz"
              style={{ height: aggridHeight, width: "100%" }}
            >
              <AgGridReact
                key={refreshGrid}
                rowSelection="multiple"
                columnDefs={columnDefs(checkBox)}
                onGridReady={onGridReady}
                gridOptions={gridOptions}
                rowData={rowData}
                pagination="true"
                defaultColDef={defaultColDef}
                loadingOverlayComponent={AgGridLoader}
                enableColResize={true}
                animateRows={true}
                onSelectionChanged={handleCheckboxMethod}
                ref={gridApiRef}
                onRowClicked={handleRowClick}
                onCellClicked={handleCellClick}
                suppressRowClickSelection={rowClickSelection}
                sideBar={{
                  toolPanels: [
                    {
                      id: "id",
                      labelDefault: "Columns",
                      labelKey: "labelKey",
                      iconKey: "iconKey",
                      toolPanel: "agColumnsToolPanel",
                      toolPanelParams: {
                        suppressPivotMode: true,
                        suppressValues: true,
                        suppressRowGroups: true,
                      },
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>

        {/* Confirmation Modal Start */}
        <Modal
          show={showConfirmationModal}
          onHide={() => setShowConfirmationModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p> Are you sure you want to proceed with this action?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-danger light "
              onClick={() => setShowConfirmationModal(false)}
            >
              Cancel
            </Button>
            <Button className="btn btn-primary light " onClick={confirmAction}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Confirmation Modal End */}

        <Modal
          show={showAuditConfirmationModal}
          onHide={handleCancelConfirmation}
        >
          <Modal.Header closeButton>
            <Modal.Title>Complete Audit</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pb-0">
            {modalData?.map((item, index) => (
              <div className="row mb-1" key={index}>
                <div className="col-md-4">
                  <p
                    className={`bg-${
                      index % 2 === 0 ? "white" : "light-blue"
                    } mb-2 p-2`}
                  >
                    {item.id}:
                  </p>
                </div>
                <div className="col-md-8">
                  <p
                    className={`bg-${
                      index % 2 === 0 ? "white" : "light-blue"
                    } mb-2 p-2`}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
            Are you sure you want to complete this audit?
          </Modal.Body>
          <Modal.Footer className="pt-0 pb-0">
            <Button variant="secondary" onClick={handleCancelConfirmation}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCompleteConfirmation}>
              Complete
            </Button>
          </Modal.Footer>
        </Modal>

        <Toast ref={toastRef} />
      </main>
    </>
  );
}
