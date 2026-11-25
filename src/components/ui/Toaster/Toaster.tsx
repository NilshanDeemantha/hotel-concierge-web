"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

/** The one place toasts appear. Call toast.success / toast.error / toast.warning from "react-toastify" anywhere. */
export function Toaster() {
  return <ToastContainer position="top-right" autoClose={4000} limit={3} />;
}
