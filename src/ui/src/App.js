import React from 'react';
import './App.css';
import * as signalR from "@microsoft/signalr";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: ["test", "jaja"]
    }
  }

  componentDidMount() {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5001/machinehub")
      .build();


    connection.on("ReceiveMessage", (message) => {
      this.setState((prevState) => {
        return {
          messages: [...prevState.messages, message]
        }
      })
    });

    connection.start().then((x) => {
      console.log("Connected!!!");
    });
  }

  render() {
    return (
      <div>
        <h3>Messages: </h3>
        <ul>
          {this.state.messages.map((msg, idx) => {
            return <li key={idx}>{msg}</li>
          })}
        </ul>
      </div>
    )
  }
}

export default App;
