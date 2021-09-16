import "./App.css";
import React from "react";
import * as signalR from "@microsoft/signalr";

class Conveyor extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "Machine Not Started",
      conveyor: ["extruder", "stamper", "oven", "box"],
      biscuits: [],
      box: [],
      isRunning: false,
      step: 0,
      currentId: 0,
    };

    this.renderMachineComponents = this.renderMachineComponents.bind(this);
    this.handleStartConveyor = this.startConveyor.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
    this.interval = null;
  }

  startConveyor() {
    this.setState({ isRunning: true });

    this.interval = setInterval(() => {
      this.setState(({ step, biscuits, isRunning, box, currentId }) => {
        if (!isRunning) {
          return;
        }

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

        if (updatedBox.length === 10) {
          updatedBox = [];
        }

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
  }

  handlePause() {
    clearInterval(this.interval);
  }

  handleStop() {
    clearInterval(this.interval);
  }

  renderMachineComponents() {
    const { conveyor } = this.state;
    return conveyor.map((element, idx) => {
      return (
        <div key={idx}>
          <span>{element}</span>
          <div className={`${element} element`}></div>
        </div>
      );
    });
  }

  renderBiscuits() {
    const { biscuits } = this.state;
    return biscuits.map((biscuit, idx) => {
      return (
        <div key={biscuit.id} className="biscuit" style={{ left: biscuit.y }}>
          🍪
        </div>
      );
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5001/machinehub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection
      .start()
      .then((x) => {
        console.log("Connected!!!");
      })
      .catch((err) => console.error(err));

    connection.on("MachineStarted", () => {
      this.displayMessage("Machine Started, heating the oven...");
    });

    connection.on("OvenHeated", () => {
      this.displayMessage("Oven heated, starting the conveyor...");
      this.startConveyor();
    });

    connection.on("OvenOverheated", () => {
      this.displayMessage("OVEN OVERHEATED, stopping the conveyor...");
      this.handleStop();
    });
  }

  startMachine() {
    const userId = "12345-54212";
    fetch(`https://localhost:5001/Machine/Start?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => console.error(err));
  }

  displayMessage(message) {
    this.setState({ message: message });
  }

  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
        <div className="conveyor-wrapper">
          {this.renderMachineComponents()}
          {this.renderBiscuits()}
        </div>
        <button onClick={this.startMachine}>Start</button>
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
