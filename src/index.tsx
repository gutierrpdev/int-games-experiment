import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./App";
import "semantic-ui-css/semantic.min.css";
import { initializeServices } from "./services";

/**
 * Initializes React Application by starting up its services and rendering
 * the main single-page application component into a root node in the DOM.
 *
 * @remarks Exporting this method is not strictly necessary, but it is convenient
 * to provide typedoc with an entrypoint to generate our project's documentation.
 * From here, everything that is referenced will be (recursively) added to our project's
 * docs.
 *
 * @author Pablo Gutiérrez, 2021
 */
export const startApp = () => {
  initializeServices();

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
};

startApp();
