import { createRoot } from "react-dom/client";
import type { ReactElementType } from "../../../packages/shared";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(1000);
  const [name] = useState("Yang jay5555");
  return <div>{count + name + 8999888}</div>;
}

const root = createRoot(document.getElementById("root")!);
root.render((<App />) as ReactElementType);
