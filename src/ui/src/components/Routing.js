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
        <Route exact path="/login">
          <Login onSubmit={handleLoginSubmit} />
        </Route>
        <Route exact path="/register">
          <Register onSubmit={handleRegisterSubmit} error={error} />
        </Route>
        <Route exact path="/">
          <Login onSubmit={handleLoginSubmit} />
        </Route>
      </React.Fragment>
    );
  },
  renderLoggedInComponents(user) {
    const conveyor = <Conveyor user={user} />;
    return (
      <React.Fragment>
        <Route path="/conveyor">{conveyor}</Route>
        <Route exact path="/">
          {conveyor}
        </Route>
      </React.Fragment>
    );
  },
};

export default Layout;
