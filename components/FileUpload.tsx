import React, { useRef } from "react";
import Image from "next/image";
import styles from "./FileUpload.module.css";
import Toast, { ToastType } from "@/components/Toast_old";

export default function FileUpload({ api, data, dispatch }) {
  const toastRef = useRef<ToastType>();
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let files = [...e.dataTransfer.files];
    if (files && files.length > 0) {
      const existingFiles = data.fileList.map((f) => f.name);
      files = files.filter((f) => !existingFiles.includes(f.name));
      dispatch({ type: "ADD_FILE_TO_LIST", files });
      dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
    }
  };
  const handleFileSelect = (e) => {
    let files = [...e.target.files];
    if (files && files.length > 0) {
      const existingFiles = data.fileList.map((f) => f.name);
      files = files.filter((f) => !existingFiles.includes(f.name));
      dispatch({ type: "ADD_FILE_TO_LIST", files });
    }
  };
  const uploadFiles = async () => {
    const files = data.fileList;
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
      console.log(file);
    });
    const response = await fetch(`${api}`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      if (data.saveCnt > 0) {
        toastRef.current.show(
          "Success",
          `${data.saveCnt} rows saved successfully.`
        );
      } else {
        toastRef.current.show("Warning", "No rows saved.");
      }
      if (data.errorCnt > 0) {
        toastRef.current.show("Error", `${data.errorCnt} rows failed to save.`);
      }
      dispatch({ type: "RESET_FILE_UPLOAD" });
    } else {
      toastRef.current.show("Error", "Error Uploading File");
      dispatch({ type: "RESET_FILE_UPLOAD" });
    }
  };
  return (
    <div className="justify-content-center">
      <div
        className={styles.dropzone}
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
      >
        <Image src="/upload.svg" alt="upload" height={50} width={50} />
        <input
          id="fileSelect"
          type="file"
          multiple
          className={styles.files}
          onChange={(e) => handleFileSelect(e)}
        />
        <label className="p-3" htmlFor="fileSelect">
          You can browser your files
        </label>
        <h5 className="p-2"> or </h5>
        <h5 className={styles.uploadMessage}>
          Drag &amp; Drop your files here
        </h5>
      </div>
      <div className={styles.fileList}>
        <div className="d-flex justify-content-start align-items-center">
          {data.fileList.length > 0 && <h6>File Uploaded:</h6>}
          {data.fileList.map((f) => {
            return (
              <ol key={f.lastModified}>
                <li className={styles.fileList}>
                  <div key={f.name} className={styles.fileName}>
                    {f.name}
                  </div>
                </li>
              </ol>
            );
          })}
        </div>
      </div>
      {data.fileList.length > 0 && (
        <div className="text-center">
          <button className="btn btn-primary light" onClick={uploadFiles}>
            Upload
          </button>
        </div>
      )}

      <Toast ref={toastRef} />
    </div>
  );
}
