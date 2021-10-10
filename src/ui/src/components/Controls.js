import React from "react";
import { connect } from "react-redux";
import { machineActions } from "../machine/machine-actions";
import MachineHubSingleton from "../signalR/machine-hub";

let Controls = ({
  paused,
  heatingElementOn,
  userId,
  startMachine,
  stopMachine,
}) => (
  <div className="controls-wrapper">
    <button onClick={() => startMachine(userId)}>Start</button>
    <button onClick={() => MachineHubSingleton.togglePause(userId)}>
      {paused ? "Resume" : "Pause"}
    </button>
    <button onClick={() => stopMachine(userId)}>Stop</button>

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

const mapDispatchToProps = (dispatch) => {
  return {
    startMachine: (userId) => {
      dispatch(machineActions.startMachine(userId));
    },
    stopMachine: (userId) => {
      dispatch(machineActions.stopMachine(userId));
    },
  };
};

Controls = connect(mapStateToProps, mapDispatchToProps)(Controls);

export default Controls;
