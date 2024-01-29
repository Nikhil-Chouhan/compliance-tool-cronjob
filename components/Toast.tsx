"use client";

import { useAtom } from "jotai";
import { toastAtom } from "@/atoms/toast";
import "./Toast.styles.css";

const Toast = () => {
  const [toastAtomValue, setToastAtomValue] = useAtom(toastAtom);

  const close = () => {
    setToastAtomValue({ ...toastAtomValue, visible: false });
  };

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3 enable-events"
      onClick={() => console.log("asfsdf")}
    >
      <div
        id="Toast"
        className={`'toast fade ${toastAtomValue.visible ? "show" : "hide"}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-header">
          <strong className="me-auto">{toastAtomValue.title}</strong>
          <button
            className="btn-close"
            onClick={close}
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">{toastAtomValue.message}</div>
      </div>
    </div>
  );
};

export default Toast;
