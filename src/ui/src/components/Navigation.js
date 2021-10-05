import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";
import Conveyor from "./Conveyor";
import Register from "./Register";
import Login from "./Login";
import LandingPage from "./LandingPage";
import Machine from "./Machine";
import { StoreContext } from "../shared/StoreContext";

export default function Navigation() {
  const store = useContext(StoreContext);
  const user = store.getState().user;

  const renderLoggedInLinks = () => {
    const handleLogout = () => {
      store.dispatch({
        type: "REMOVE_USER",
        userId: user.userId,
      });
    };

    return (
      <>
        <li>
          <Link to="/conveyor">Conveyor</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </>
    );
  };

  const renderLoggedInComponents = () => {
    return (
      <>
        <Route path={["/conveyor", "/"]}>
          <Machine />
        </Route>
      </>
    );
  };

  const renderLoginLinks = () => {
    return (
      <>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </>
    );
  };

  const renderLoginComponents = () => {
    return (
      <>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/" component={LandingPage} />
      </>
    );
  };

  if (user.loggedIn) {
    return (
      <Router>
        <nav>
          <ul>{renderLoggedInLinks()}</ul>
        </nav>
        <Switch>{renderLoggedInComponents()}</Switch>
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
