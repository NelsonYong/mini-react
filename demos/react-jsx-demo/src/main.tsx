import { createRoot } from "react-dom/client";
import { useState, type ReactElementType } from "react";

const arr = ["1", "2", "3"];
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      {/* <div>{count}</div> */}
      <button
        onClick={() => {
          setCount((prev) => {
            return prev + 1;
          });
        }}
      >
        count is {count}
      </button>
      {/* <div>111</div> */}
    </>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render((<App />) as ReactElementType);
