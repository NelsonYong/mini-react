import { createRoot } from "react-dom/client";
import App from "./App";
import type { ReactElementType } from "react";
import "./index.css";

const root = createRoot(document.getElementById("root")!);
root.render((<App />) as ReactElementType);
