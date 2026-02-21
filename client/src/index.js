import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import App from "./App";

const apiBaseUrl = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");

if (apiBaseUrl) {
  axios.defaults.baseURL = apiBaseUrl;
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
