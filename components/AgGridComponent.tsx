import React, { useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";
import {
  FaPlus,
  FaCheck,
  FaTimes,
  FaTrash,
  FaEdit,
  FaEye,
  FaListAlt,
} from "react-icons/fa";
import Link from "next/link";
import Toast, { ToastType } from "@/components/Toast_old";
import AgGridLoader from "@/components/AgGridLoader";
import { BsHouse } from "react-icons/bs";
//import "app/styles.css";
interface Column {
  headerName: string;
  field: string;
  flex: number;
}

interface GridComponentProps {
  slug: string;
  page: string;
  customColumns: Column[];
  customRows: [];
  showbreadCrumb: boolean;
}

export default function AGGridComponent({
  slug,
  page,
  customColumns,
  customRows,
  showbreadCrumb,
}: GridComponentProps) {
  const [rowData] = useState(customRows);
  const [refreshGrid] = useState(false);

  const toastRef = useRef<ToastType>();

  const customcolumnDefs = customColumns.map((column) => {
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
          <div title={fieldtext} className="">
            {fieldtext}
          </div>
        );
      },
    };
  });

  const columnDefs = [
    ...customcolumnDefs,
    {
      headerName: "Status",
      field: "status",
      cellRenderer: (params) => {
        const status = params.data.status;
        return <>{status === 1 ? "Active" : "Inactive"}</>;
      },
      filter: "agTextColumnFilter",
      minWidth: 200,
      cellClass: "custom-cell centered-cell",
    },
    {
      headerName: "Action",
      cellClass: "custom-cell centered-align-cell",
      cellRenderer: (params) => {
        const uuid = params.data.uuid;
        const status = params.data.status;
        return;
        <>
          <div className="d-flex justify-content-center align-items-center">
            <button
              title={`Change Status to ${status === 1 ? "Inactive" : "Active"}`}
              className="btn btn-link text-decoration-none fs-14 p-1"
            >
              {status === 1 ? (
                <FaTimes className="text-decoration-none" />
              ) : (
                <FaCheck className="text-decoration-none" />
              )}
            </button>

            <button
              title="View"
              className="btn btn-link text-decoration-none fs-14 p-1"
            >
              <Link
                className="text-decoration-none text-dark"
                href={`${slug}/view?uuid=${uuid}`}
              >
                <FaEye className="text-decoration-none" />
              </Link>
            </button>

            <button
              title="Edit"
              className="btn btn-link text-decoration-none fs-14 p-1"
            >
              <Link
                className="text-decoration-none text-dark"
                href={`${slug}/edit?uuid=${uuid}`}
              >
                <FaEdit className="text-decoration-none" />
              </Link>
            </button>

            <button
              title="Delete"
              className="btn btn-link text-decoration-none text-dark fs-14 p-1"
            >
              <FaTrash className="text-decoration-none" />
            </button>
          </div>
        </>;
      },
      width: 120,
      filter: false,
      editable: false,
      sortable: false,
      resizable: false,
      floatingFilter: false,
      //pinned: "right",
    },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: true,
      sortable: true,
      editable: true,
      headerClass: "centered-header",
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
  };

  return (
    <>
      <main className="container-fluid container-padding-25">
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
                  {type} {page}
                </li>
              </ol>
            </nav>
          </div>
        )}
        <div className="bg-white row vh-100 rounded-corner">
          <div className="col-md-12 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-normal ">
                <b>
                  {" "}
                  <FaListAlt size={25} className="mx-3" />
                  {page}
                </b>
              </h4>
              <div>
                <Link
                  href={`${slug}/add`}
                  className="btn btn-primary light px-2 mx-2 py-1 text-uppercase"
                >
                  <FaPlus className="mb-1 mx-1" /> Add
                </Link>
              </div>
            </div>
            <div className="border-bottom mb-4"></div>
            <div
              className="ag-theme-alpine"
              style={{ height: "100%", width: "100%" }}
            >
              <AgGridReact
                key={refreshGrid}
                rowSelection="multiple"
                suppressRowClickSelection
                columnDefs={columnDefs}
                gridOptions={gridOptions}
                rowData={rowData}
                pagination="true"
                // paginationPageSize="5"
                domLayout="autoHeight"
                defaultColDef={defaultColDef}
                loadingOverlayComponent={AgGridLoader}
                enableColResize={true}
                animateRows={true}
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
        <Toast ref={toastRef} />
      </main>
    </>
  );
}
