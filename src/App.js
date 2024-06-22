import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [numberType, setNumberType] = useState("e");
  const [response, setResponse] = useState(null);

  const fetchNumbers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:9876/numbers/${numberType}`
      );
      setResponse(res.data);
    } catch (error) {
      console.error("Error fetching numbers:", error);
    }
  };

  return (
    <div className="App">
      <h1>Average Calculator</h1>
      <div>
        <label>
          Select number type:
          <select
            value={numberType}
            onChange={(e) => setNumberType(e.target.value)}
          >
            <option value="p">Prime</option>
            <option value="f">Fibonacci</option>
            <option value="e">Even</option>
            <option value="r">Random</option>
          </select>
        </label>
        <button onClick={fetchNumbers}>Fetch Numbers</button>
      </div>
      {response && (
        <div>
          <h2>Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
