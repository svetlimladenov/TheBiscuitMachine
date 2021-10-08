import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";
import { connect } from "react-redux";

import { userActions } from "../user/user-actions";

import Register from "./Register";
import Login from "./Login";
import LandingPage from "./LandingPage";
import Machine from "./Machine";

let Navigation = ({ user, removeUser }) => {
  const renderLoggedInLinks = () => (
    <>
      <li>
        <Link to="/conveyor">Conveyor</Link>
      </li>
      <li>
        <button onClick={removeUser}>Logout</button>
      </li>
    </>
  );

  const renderLoggedInComponents = () => (
    <>
      <Route path={["/conveyor", "/"]}>
        <Machine />
      </Route>
    </>
  );

  const renderLoginLinks = () => (
    <>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
    </>
  );

  const renderLoginComponents = () => (
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
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    removeUser: () => {
      dispatch(userActions.removeUser());
    },
  };
};

Navigation = connect(mapStateToProps, mapDispatchToProps)(Navigation);

export default Navigation;
