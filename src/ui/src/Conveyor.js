import "./App.css";
import React from "react";
import * as signalR from "@microsoft/signalr";

import { machineEndpoints } from "./shared/signalr-endpoints";

class Conveyor extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "Machine Not Started",
      conveyor: ["extruder", "stamper", "oven", "box"],
      biscuits: [],
      isRunning: false,
      step: 0,
      currentId: 0,
      hubConnection: null,
      intervalId: 0,
      box: [],
      boxSize: 5,
    };

    this.renderMachineComponents = this.renderMachineComponents.bind(this);
    this.handleStartMachine = this.handleStartMachine.bind(this);
    this.handleStartConveyor = this.handleStartConveyor.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleStop = this.handleStop.bind(this);
  }

  handleStartConveyor = () => {
    const newIntervalId = setInterval(() => {
      if (this.state.box.length === this.state.boxSize) {
        this.setState({ box: [] });
        this.deliverBiscuits();
      }

      this.setState(({ step, biscuits, box, currentId }) => {
        // Update the biscuits
        const movedBiscuits = biscuits.map((biscuit) => {
          return { y: biscuit.y + 700, step: biscuit.step + 1, id: biscuit.id };
        });

        // add new biscuit
        movedBiscuits.push({ y: 0, step: 0, id: currentId });

        // filter the biscut for the box
        const biscuitForBox = movedBiscuits.filter(
          (biscuit) => biscuit.step === 4
        );

        let updatedBox = [...box, ...biscuitForBox];

        const updatedBiscuits = movedBiscuits.filter(
          (biscuit) => biscuit.step <= 3
        );

        return {
          step: step + 1,
          currentId: currentId + 1,
          biscuits: updatedBiscuits,
          box: updatedBox,
        };
      });
    }, 2000);

    this.setState((prevState) => {
      return {
        ...prevState,
        intervalId: newIntervalId,
      };
    });
  };

  handlePause = () => {
    clearInterval(this.state.intervalId);
  };

  handleStop = () => {
    clearInterval(this.state.intervalId);
  };

  deliverBiscuits = () => {
    const box = 10;
    clearInterval(this.state.intervalId);
    this.state.hubConnection
      .invoke(machineEndpoints.deliverBiscuits, box)
      .then((result) => {
        console.log("done");
      });
  };

  renderMachineComponents = () => {
    const { conveyor } = this.state;
    return conveyor.map((element, idx) => {
      return (
        <div key={idx}>
          <span>{element}</span>
          <div className={`${element} element`}></div>
        </div>
      );
    });
  };

  renderBiscuits = () => {
    const { biscuits } = this.state;
    return biscuits.map((biscuit, idx) => {
      return (
        <div key={biscuit.id} className="biscuit" style={{ left: biscuit.y }}>
          🍪
        </div>
      );
    });
  };

  handleStartMachine = () => {
    const userId = "12345-54212";
    this.state.hubConnection.invoke(machineEndpoints.start, userId);
  };

  displayMessage = (message) => {
    this.setState({ message: message });
  };

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  componentDidMount() {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5001/machinehub")
      .build();

    this.setState({ hubConnection }, () => {
      this.state.hubConnection
        .start()
        .then(() => console.log("Connection started!"))
        .catch((err) => console.log("Error while establishing connection :("));

      this.state.hubConnection.on("MachineStarted", () => {
        this.displayMessage("Machine Started, heating the oven...");
      });

      this.state.hubConnection.on("OvenHeated", () => {
        this.displayMessage("Oven heated, starting the conveyor...");
        this.handleStartConveyor();
      });

      this.state.hubConnection.on("OvenOverheated", () => {
        this.displayMessage("OVEN OVERHEATED, stopping the conveyor...");
        this.handleStop();
      });
    });
  }

  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
        <div className="conveyor-wrapper">
          {this.renderMachineComponents()}
          {this.renderBiscuits()}
        </div>
        <button onClick={this.handleStartMachine}>Start</button>
        <button onClick={this.handlePause}>Pause</button>
        <button onClick={this.handleStop}>Stop</button>
        <div>
          <h3>Box</h3>
          {this.state.box.map((biscuit, idx) => {
            return <span key={idx}>🍪</span>;
          })}
        </div>
      </div>
    );
  }
}

export default Conveyor;
