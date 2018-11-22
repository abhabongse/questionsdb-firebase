import React from "react";
import ReactDOM from "react-dom";
import App from "./layout/App";
import registerServiceWorker from "./registerServiceWorker";

// Setup the run-time environment
import "./config/firebase";
import "./config/markdown";
import "./config/fontawesome";

// Override all other CSS from packages
import "./css/style.css";


ReactDOM.render(<App/>, document.getElementById("root"));
registerServiceWorker();
