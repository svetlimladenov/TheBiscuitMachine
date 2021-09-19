import "../App.css";
import React from "react";
import Biscuit from "./Biscuit";
import BiscuitBox from "./BiscuitBox";
import MachineComponent from "./MachineComponent";

import MachineHub from "../signalR/machineHub";
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

  handleOvenHeated = () => {
    this.setMessage("Oven heated, starting the conveyor...");
    this.handleStartConveyor();
  };

  handleOvenOverheated = () => {
    this.setMessage("OVEN OVERHEATED, stopping the conveyor...");
    this.handleStop();
  };

  handleStart = () => {
    MachineHub.startMachine(this.props.user.id);
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

  render() {
    const renderMachineComponents = () => {
      return (
        <React.Fragment>
          <div className="belt">
            <MachineComponent name="extruder" />
            <MachineComponent name="stamper" />
            <MachineComponent name="oven" />
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
        <button onClick={this.handleStart}>Start</button>
        <button onClick={this.handlePause}>Pause</button>
        <button onClick={this.handeStop}>Stop</button>
      </div>
    );
  }
}

export default Conveyor;
