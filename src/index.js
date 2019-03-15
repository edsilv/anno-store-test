import React from "react";
import ReactDOM from "react-dom";
import AnnoStore from "./components/AnnoStore";

import "./styles.css";

function App() {
  return <AnnoStore endpoint="https://dev0.anno-store.org/api/" />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
