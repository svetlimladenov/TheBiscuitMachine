import React from "react";
import { connect } from "react-redux";
import MachineHubSingleton from "../signalR/machine-hub";

let Controls = ({ paused, heatingElementOn, userId }) => (
  <div className="controls-wrapper">
    <button onClick={() => MachineHubSingleton.startMachine(userId)}>
      Start
    </button>
    <button onClick={() => MachineHubSingleton.togglePause(userId)}>
      {paused ? "Resume" : "Pause"}
    </button>
    <button onClick={() => MachineHubSingleton.stopMachine(userId)}>
      Stop
    </button>

    <button onClick={() => MachineHubSingleton.toggleHeatingElement(userId)}>
      Heating Element{" "}
      <span
        className={
          heatingElementOn ? "heating-element-on" : "heating-element-off"
        }
      >
        {heatingElementOn ? "On" : "Off"}
      </span>
    </button>
  </div>
);

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    paused: state.machine.paused,
    heatingElementOn: state.machine.heatingElementOn,
  };
};

Controls = connect(mapStateToProps)(Controls);

export default Controls;
