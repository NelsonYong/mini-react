import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [count1, setCount1] = useState(0);

  useEffect(() => {
    console.log("mount");
  }, []);

  useEffect(() => {
    console.log("update", count);
  }, [count]);

  return (
    <div>
      <div className="card">
        <button
          onClick={() => {
            setCount((count) => count + 1);
            setCount1((count1) => count1 + 1);
          }}
        >
          {count} {count1}
        </button>
      </div>
    </div>
  );
}

export default App;
