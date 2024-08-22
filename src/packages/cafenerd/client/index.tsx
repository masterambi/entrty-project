import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
import Store from "./redux";

document.body.setAttribute("translate", "no");
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <BrowserRouter>
    <Provider store={Store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
