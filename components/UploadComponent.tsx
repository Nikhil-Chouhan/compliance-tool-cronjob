import React, { useReducer } from "react";
import Link from "next/link";
import { FaListAlt } from "react-icons/fa";
import { BsHouse } from "react-icons/bs";
import FileUpload from "@/components/FileUpload";
import DownloadComponent from "@/components/DownloadComponent";

export default function ImportActivityComponent({
  slug,
  api,
  page,
  showbreadCrumb,
  previousPage,
  mainPage,
}) {
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_IN_DROP_ZONE":
        return { ...state, inDropZone: action.inDropZone };
      case "ADD_FILE_TO_LIST":
        return { ...state, fileList: state.fileList.concat(action.files) };
      case "RESET_FILE_UPLOAD":
        return { inDropZone: false, fileList: [] };
      default:
        return state;
    }
  };
  const [data, dispatch] = useReducer(reducer, {
    inDropZone: false,
    fileList: [],
  });

  return (
    <>
      <main className=" h-100">
        {showbreadCrumb && (
          <div className="d-flex justify-content-start align-items-center">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <Link href="/" className=" breadcrumb-item">
                  <BsHouse className="mx-2" />
                </Link>
                {mainPage && (
                  <Link
                    href={slug}
                    className="text-decoration-none breadcrumb-item"
                  >
                    {mainPage}
                  </Link>
                )}
                <Link
                  href={slug}
                  className="text-decoration-none breadcrumb-item"
                >
                  {previousPage}
                </Link>
                <li className="breadcrumb-item active" aria-current="page">
                  {page}
                </li>
              </ol>
            </nav>
          </div>
        )}
        <div className="row custom_row bg-white custom_row rounded-corner p-4">
          <div className="col-md-12 px-0">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-strong">
                {page && <FaListAlt size={20} className="mx-3 " />}
                {page}
              </h5>
              <div className="d-flex ml-auto">
                <DownloadComponent url={`${api}`} text={"Download Sample"} />
              </div>
            </div>
            <hr></hr>
          </div>
          <div className="d-flex justify-content-center rounded-corner p-4 border border-2 mt-2">
            <div className="col-md-6">
              <FileUpload api={api} data={data} dispatch={dispatch} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
