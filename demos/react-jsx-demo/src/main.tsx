import { createRoot } from "react-dom/client";
import { useState, type ReactElementType } from "react";

function App() {
  const [count, setCount] = useState(0);
  return (
    <button
      onClick={() => {
        setCount((prev) => {
          console.log("prev", prev);
          return prev + 1;
        });
      }}
    >
      {count}
    </button>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render((<App />) as ReactElementType);
