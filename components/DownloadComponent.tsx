import React from "react";
import { FaDownload } from "react-icons/fa";

export default function DownloadComponent({ url, text }) {
  return (
    <a
      href={url}
      target="_blank"
      className="btn btn-primary light p-2 mx-3"
      download
    >
      <FaDownload className="mb-1 mx-1" /> {text}
    </a>
  );
}
