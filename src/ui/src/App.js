import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import api from "./shared/fetch";

import Routing from "./components/Routing";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      register: {
        error: "",
      },
      user: {
        isLoggedIn: false,
        id: "",
      },
    };
  }

  login = ({ data }) => {
    this.setState({
      user: {
        id: data,
        isLoggedIn: true,
      },
    });
  };

  handleLoginSubmit = (body) => {
    api.post("/Users/Login", body).then(this.login);
  };

  handleRegisterSubmit = (body) => {
    api.post("/Users/Register", body).then(this.login);
  };

  render() {
    const isLoggedIn = this.state.user.isLoggedIn;

    const links = isLoggedIn
      ? Routing.renderLoggedInLinks()
      : Routing.renderLoginLinks();

    const components = isLoggedIn
      ? Routing.renderLoggedInComponents(this.state.user)
      : Routing.renderLoginComponents(
          this.handleLoginSubmit,
          this.handleRegisterSubmit,
          this.state.register.error
        );

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
}

export default App;
