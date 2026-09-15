import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/base.css";
import "./styles/navbar.css";
import "./styles/catalog.css";
import "./styles/product-detail.css";
import "./styles/admin.css";
import "./styles/forms.css";
import "./styles/dialog.css";
import "./styles/feedback.css";
import "./styles/responsive.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
