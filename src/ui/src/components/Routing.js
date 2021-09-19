import React from "react";

import { Link, Route } from "react-router-dom";
import Conveyor from "./Conveyor";
import Register from "./Register";
import Login from "./Login";

const Layout = {
  renderLoginLinks() {
    return (
      <React.Fragment>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </React.Fragment>
    );
  },
  renderLoggedInLinks() {
    return (
      <li>
        <Link to="/conveyor">Conveyor</Link>
      </li>
    );
  },

  renderLoginComponents(handleLoginSubmit, handleRegisterSubmit, error) {
    return (
      <React.Fragment>
        <Route path="/login">
          <Login onSubmit={handleLoginSubmit} />
        </Route>
        <Route path="/register">
          <Register onSubmit={handleRegisterSubmit} error={error} />
        </Route>
      </React.Fragment>
    );
  },
  renderLoggedInComponents(user) {
    console.log(user);
    return (
      <Route path="/conveyor">
        <Conveyor user={user} />
      </Route>
    );
  },
};

export default Layout;