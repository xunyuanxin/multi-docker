import React, { useState, useEffect } from "react";
import Axios from "axios";
 
const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState("");
 
  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);
 
  const fetchValues = async () => {
    const values = await Axios.get("/api/values/current");
    setValues(values.data);
  };
 
  const fetchIndexes = async () => {
    const seenIndexes = await Axios.get("/api/values/all");
    setSeenIndexes(seenIndexes.data);
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
 
    await Axios.post("/api/values", {
      index: index,
    });
    setIndex("");
  };
 
  const renderSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(", ");
  };
 
  const renderValues = () => {
    const entries = [];
 
    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }
 
    return entries;
  };
 
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
          value={index}
          onChange={(event) => setIndex(event.target.value)}
        />
        <button>Submit</button>
      </form>
 
      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}
 
      <h3>Calculated Values:</h3>
      {renderValues()}
    </div>
  );
};
 
export default Fib;