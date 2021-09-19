import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import api from "./shared/fetch";

import MachineHub from "./signalR/machineHub";
import pulse from "./shared/utils";

import Conveyor from "./components/Conveyor";
import Register from "./components/Register";
import Login from "./components/Login";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "Machine Not Started",
      biscuits: [],
      isRunning: false,
      step: 0,
      currentId: 0,
      hubConnection: null,
      pulseId: 0,
      biscuitBox: [],
      boxSize: 5,
      speed: 2,
      register: {
        error: "",
      },
      user: {
        isLoggedIn: false,
        id: "",
      },
    };
  }

  componentWillUnmount() {
    clearInterval(this.state.pulseId);
    this.setState((prevState) => {
      prevState.hubConnection.stop();
    });
  }

  componentDidMount() {
    const hubConnection = MachineHub.createConnection("/machinehub");
    MachineHub.subscribeToMachineStartup(this.handleMachineStarted);
    MachineHub.subscribeToOvenHeated(this.handleOvenHeated);
    MachineHub.subscibeToOvenOverheated(this.handleOvenOverheated);

    this.setState({ hubConnection }, () => {
      hubConnection
        .start()
        .then((result) => console.log("Connected!"))
        .catch((error) => console.error(error));
    });
  }

  handleMachineStarted = () => {
    this.setMessage("Machine started, waiting for the oven to be heated...");
  };

  handleOvenHeated = () => {
    this.setMessage("Oven heated, starting the conveyor...");
    this.handleStartConveyor();
  };

  handleOvenOverheated = () => {
    this.setMessage("OVEN OVERHEATED, stopping the conveyor...");
    this.handleStop();
  };

  handleStart = () => {
    const userId = "12345-54212";
    MachineHub.startMachine(userId);
  };

  handlePause = () => {
    clearInterval(this.state.pulseId);
  };

  handleStop = () => {
    clearInterval(this.state.pulseId);
  };

  handleStartConveyor = () => {
    const pulseId = setInterval(() => {
      if (this.state.biscuitBox.length === this.state.boxSize) {
        this.setState({ biscuitBox: [] });
        this.deliverBiscuits();
      }

      this.setState(({ step, biscuits, biscuitBox, currentId }) => {
        const [updatedBiscuits, updatedBox] = pulse(
          biscuits,
          biscuitBox,
          currentId
        );

        return {
          step: step + 1,
          currentId: currentId + 1,
          biscuits: updatedBiscuits,
          biscuitBox: updatedBox,
        };
      });
    }, this.state.speed * 1000);

    this.setState((prevState) => {
      return {
        ...prevState,
        pulseId: pulseId,
      };
    });
  };

  setMessage = (message) => {
    this.setState({ message: message });
  };

  deliverBiscuits = () => {
    const box = 10;
    MachineHub.deliverBiscuits(box);
  };

  setUser = ({ data }) => {
    this.setState({
      user: {
        id: data,
        isLoggedIn: true,
      },
    });
  };

  handleLoginSubmit = (body) => {
    api.post("/Users/Login", body).then(this.setUser);
  };

  handleRegisterSubmit = (body) => {
    api.post("/Users/Register", body).then(this.setUser);
  };

  render() {
    const isLoggedIn = this.state.user.isLoggedIn;
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

    return (
      <Router>
        <div>
          <nav>
            <ul>
              {!isLoggedIn ? renderLoginLinks() : undefined}
              <li>
                <Link to="/conveyor">Conveyor</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path="/login">
              <Login onSubmit={this.handleLoginSubmit} />
            </Route>
            <Route path="/register">
              <Register
                onSubmit={this.handleRegisterSubmit}
                error={this.state.register.error}
              />
            </Route>
            <Route path="/conveyor">
              <Conveyor
                {...this.state}
                handleStart={this.handleStart}
                handleStop={this.handlePause}
                handlePause={this.handlePause}
              />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
