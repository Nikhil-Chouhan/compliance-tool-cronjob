"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

interface Type {
  title: string;
  message: string;
}

export interface ToastType {
  show: (title: string, message: string) => void;
  hide: () => void;
}

const Toast = forwardRef(function (props: Type, ref) {
  const toast = useRef<HTMLElement>();
  const isVisible = useRef(false);

  useImperativeHandle(ref, () => ({
    show(title, message) {
      if (toast.current) {
        const titleElement = toast.current.querySelector(
          ".toast-header strong"
        );
        const messageElement = toast.current.querySelector(".toast-body");

        if (titleElement) {
          titleElement.textContent = title;
        }

        if (messageElement) {
          messageElement.textContent = message;
        }

        isVisible.current = true;
        toast.current.style.display = "block";
        setTimeout(() => {
          isVisible.current = false;
          toast.current.style.display = "none";
        }, 3000);
      }
    },
    hide() {
      if (toast.current) {
        isVisible.current = false;
        toast.current.style.display = "none";
      }
    },
  }));

  useEffect(() => {
    toast.current = document.getElementById("Toast") as HTMLElement;
  }, []);

  return (
    <div id="Toast" className={`toast`}>
      <div className="toast-header">
        <strong className="me-auto">{props.title}</strong>
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            isVisible.current = false;
            toast.current.style.display = "none";
          }}
        ></button>
      </div>
      <div className="toast-body">{props.message}</div>
    </div>
  );
});

Toast.displayName = "ToastForwardRef";

export default Toast;
