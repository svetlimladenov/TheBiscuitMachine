import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import api from "./shared/fetch";

import MachineHub from "./signalR/machineHub";
import pulse from "./shared/utils";

import Routing from "./components/Routing";

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
      ? Routing.renderLoggedInComponents(
          this.state,
          this.handleStart,
          this.handleStop,
          this.handlePause
        )
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
