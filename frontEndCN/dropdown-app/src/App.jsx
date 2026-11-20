import React from "react";
import Dropdown from "./Dropdown.jsx";

function App() {
  const items = ["Yes", "Probably not"];

  return (
    <main className="page">
      <h1>Should you use a dropdown?</h1>
      <Dropdown items={items} />
    </main>
  );
}

export default App;
