import React from "react";
import { toast  } from "react-toastify";

const ToastMessage = (type, message) => {
    toast[type](<div style={{ height: "50px", display: "flex", alignItems: "center", fontSize: "16px"}}>{message}</div>, {
        position: "top-right",
        autoClose: 2000,
    });
};

export default ToastMessage;
