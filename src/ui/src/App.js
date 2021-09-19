import React, { useState } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import api from "./shared/fetch";

import Routing from "./components/Routing";

export default function App() {
  const [user, setUser] = useState({ isLoggedIn: false, id: "" });

  const login = ({ data }, changeRoute) => {
    setUser({
      id: data,
      isLoggedIn: true,
    });

    changeRoute();
  };

  const handleLoginSubmit = (body, changeRoute) => {
    api.post("/Users/Login", body).then((response) => {
      login(response, changeRoute);
    });
  };

  const handleRegisterSubmit = (body, changeRoute) => {
    api.post("/Users/Register", body).then((response) => {
      login(response, changeRoute);
    });
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
