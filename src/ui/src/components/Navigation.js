import React from "react";
import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";
import Conveyor from "./Conveyor";
import Register from "./Register";
import Login from "./Login";
import LandlingPage from "./LandingPage";

export default function Navigation({
  user,
  handleLoginSubmit,
  handleRegisterSubmit,
  loginErrors,
  registerErrors,
}) {
  const renderLoggedInLinks = () => {
    return (
      <li>
        <Link to="/conveyor">Conveyor</Link>
      </li>
    );
  };

  const renderLoggedInComponents = (user) => {
    return (
      <React.Fragment>
        <Route path="/conveyor">
          <Conveyor user={user} />
        </Route>
      </React.Fragment>
    );
  };

  const renderLoginLinks = () => {
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
  };

  const renderLoginComponents = () => {
    return (
      <React.Fragment>
        <Route exact path="/login">
          <Login errors={loginErrors} onSubmit={handleLoginSubmit} />
        </Route>
        <Route exact path="/register">
          <Register onSubmit={handleRegisterSubmit} errors={registerErrors} />
        </Route>
        <Route exact path="/" component={LandlingPage} />
      </React.Fragment>
    );
  };

  if (user.isLoggedIn) {
    return (
      <Router>
        <nav>
          <ul>{renderLoggedInLinks()}</ul>
        </nav>
        <Switch>{renderLoggedInComponents(user)}</Switch>
      </Router>
    );
  } else {
    return (
      <Router>
        <nav>
          <ul>{renderLoginLinks()}</ul>
        </nav>
        <Switch>{renderLoginComponents()}</Switch>
      </Router>
    );
  }
}
