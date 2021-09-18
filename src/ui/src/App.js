import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MachineHub from "./signalR/machineHub";
import pulse from "./shared/utils";

import Conveyor from "./components/Conveyor";
import Login from "./components/Login";
import Register from "./components/Register";

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
      intervalId: 0,
      box: [],
      boxSize: 5,
      speed: 5,
    };
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
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
    clearInterval(this.state.intervalId);
  };

  handleStop = () => {
    clearInterval(this.state.intervalId);
  };

  handleStartConveyor = () => {
    const newIntervalId = setInterval(() => {
      if (this.state.box.length === this.state.boxSize) {
        this.setState({ box: [] });
        this.deliverBiscuits();
      }

      this.setState(({ step, biscuits, box, currentId }) => {
        const [updatedBiscuits, updatedBox] = pulse(biscuits, box, currentId);

        return {
          step: step + 1,
          currentId: currentId + 1,
          biscuits: updatedBiscuits,
          box: updatedBox,
        };
      });
    }, this.state.speed * 1000);

    this.setState((prevState) => {
      return {
        ...prevState,
        intervalId: newIntervalId,
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

  handleLoginSubmit = (data) => {
    const json = JSON.stringify(data);
    console.clear();
    console.log(json);
  };

  render() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/conveyor">Conveyor</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path="/login">
              <Login onSubmit={this.handleLoginSubmit} />
            </Route>
            <Route path="/register">
              <Register />
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
