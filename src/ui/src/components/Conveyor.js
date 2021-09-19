import "../App.css";
import React from "react";
import Biscuit from "./Biscuit";
import BiscuitBox from "./BiscuitBox";
import MachineComponents from "./MachineComponent";

import MachineHub from "../signalR/machine-hub";
import pulse from "../shared/utils";

class Conveyor extends React.Component {
  constructor(props) {
    super(props);
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
    MachineHub.subscribeToMachineStopped(this.handleMachineStopped);

    this.setState({ hubConnection }, () => {
      hubConnection
        .start()
        .then((result) => {
          MachineHub.joinGroup(this.props.user.id);
        })
        .catch((error) => console.error(error));
    });
  }

  handleMachineStarted = () => {
    this.setMessage("Machine started, waiting for the oven to be heated...");
  };

  handleMachineStopped = () => {
    this.setMessage("Machine stopping...");

    setTimeout(() => {
      this.setState({
        biscuits: [],
        message: "Machine stopped!",
        isRunning: false,
      });
      clearInterval(this.state.pulseId);
    }, this.state.speed * 1000);
  };

  handleOvenHeated = () => {
    this.setMessage("Oven heated, starting the conveyor...");
    this.handleStartConveyor();
  };

  handleOvenOverheated = () => {
    this.setMessage("OVEN OVERHEATED, stopping the conveyor...");
    this.handleStopButtonClick();
  };

  // Button click handlers
  handleStartButtonClick = () => {
    MachineHub.startMachine(this.props.user.id);
  };

  handleStopButtonClick = () => {
    MachineHub.stopMachine(this.props.user.id);
  };

  handlePauseButtonClick = () => {
    console.log("pause");
    clearInterval(this.state.pulseId);
  };

  handleStartConveyor = () => {
    const pulseId = setInterval(() => {
      if (this.state.biscuitBox.length === this.state.boxSize) {
        this.setState({ biscuitBox: [] });
        this.deliverBiscuits(this.props.user.id, 10);
      }

      this.setState(({ step, biscuits, biscuitBox, currentId, isRunning }) => {
        const [updatedBiscuits, updatedBox] = pulse(
          biscuits,
          biscuitBox,
          currentId,
          isRunning
        );

        return {
          step: step + 1,
          currentId: currentId + 1,
          biscuits: updatedBiscuits,
          biscuitBox: updatedBox,
          isRunning: true,
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
    MachineHub.deliverBiscuits(this.props.user.id, box);
  };

  render() {
    const renderMachineComponents = () => {
      return (
        <React.Fragment>
          <div className="belt">
            <MachineComponents />
          </div>
          <BiscuitBox biscuitBox={this.state.biscuitBox} />
        </React.Fragment>
      );
    };

    const renderBiscuits = () => {
      const { biscuits, speed } = this.state;
      return biscuits.map((biscuit) => {
        return <Biscuit key={biscuit.id} y={biscuit.y} speed={speed} />;
      });
    };

    return (
      <div>
        <h1>{this.state.message}</h1>
        <div className="conveyor-wrapper">
          {renderMachineComponents()}
          {renderBiscuits()}
        </div>
        <button onClick={this.handleStartButtonClick}>Start</button>
        <button onClick={this.handlePauseButtonClick}>Pause</button>
        <button onClick={this.handleStopButtonClick}>Stop</button>
      </div>
    );
  }
}

export default Conveyor;
