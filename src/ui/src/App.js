import React, { useState } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import api from "./shared/fetch";

import Routing from "./components/Routing";

export default function App() {
  const [user, setUser] = useState({ isLoggedIn: false, id: "" });

  const login = ({ data }) => {
    setUser({
      id: data,
      isLoggedIn: true,
    });
  };

  const handleLoginSubmit = (body) => {
    api.post("/Users/Login", body).then(login);
  };

  const handleRegisterSubmit = (body) => {
    api.post("/Users/Register", body).then(login);
  };

  const links = user.isLoggedIn
    ? Routing.renderLoggedInLinks()
    : Routing.renderLoginLinks();

  const components = user.isLoggedIn
    ? Routing.renderLoggedInComponents(user)
    : Routing.renderLoginComponents(handleLoginSubmit, handleRegisterSubmit);

  return (
    <Router>
      <div>
        <nav>
          <ul>{links}</ul>
        </nav>
        <Switch>{components}</Switch>
      </div>
    </Router>
  );
}
