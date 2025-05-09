import { createRoot } from "react-dom/client";
import App from "./App";
import type { ReactElementType } from "react";
import "./index.css";
// import { useState, type ReactElementType } from "react";

// const arr = ["1", "2", "3"];
// function App() {
//   const [count, setCount] = useState(0);

//   const [count1, setCount1] = useState(0);

//   const [count2, setCount2] = useState(0);

//   return (
//     <>
//       {/* <div>{count}</div> */}
//       <button
//         onClick={() => {
//           setCount((prev) => {
//             return prev + 1;
//           });
//         }}
//       >
//         count {count}
//       </button>
//       {/* <div>111</div> */}
//     </>
//   );
// }

// console.log((<App />).type());

const root = createRoot(document.getElementById("root")!);
root.render((<App />) as ReactElementType);
