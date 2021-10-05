import React from "react";
import "./normalize.css";
import "./App.css";

import Navigation from "./components/Navigation";
import { StoreContext } from "./shared/StoreContext";

export default function App({ store }) {
  return (
    <StoreContext.Provider value={store}>
      <Navigation />;
    </StoreContext.Provider>
  );
}
