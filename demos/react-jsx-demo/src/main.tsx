import { createRoot } from "react-dom/client";
// import "./index.css";
import App from "./App.tsx";
// import React from "react";

console.log(document.getElementById("root"));

const root = createRoot(document.getElementById("root")!);

console.log("root", root);

root.render(
  // @ts-ignore
  "qqqq"
);
