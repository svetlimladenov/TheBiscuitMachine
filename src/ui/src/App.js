import React from "react";
import "./App.css";
import * as signalR from "@microsoft/signalr";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "The machine is not started...",
    };

    this.startMachine = this.startMachine.bind(this);
  }

  componentDidMount() {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5001/machinehub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("ReceiveMessage", (message) => {
      this.setState((prevState) => {
        return {
          messages: [...prevState.messages, message],
        };
      });
    });

    connection
      .start()
      .then((x) => {
        console.log("Connected!!!");
      })
      .catch((err) => console.error(err));

    connection.on("MachineStarted", () => {
      this.setState({
        message: "Machine started, waiting for the oven to be heated...",
      });
    });

    connection.on("OvenHeated", () => {
      this.setState({ message: "Oven Heated, now making cookies..." });
    });
  }

  startMachine() {
    const userId = "12345-54212";
    fetch(`https://localhost:5001/Machine/Start?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log("Oven started"))
      .catch((err) => console.error(err));
  }

  render() {
    return (
      <div>
        <ul>
          <h1>{this.state.message}</h1>
          <button onClick={this.startMachine}>Start</button>
        </ul>
      </div>
    );
  }
}

export default App;
