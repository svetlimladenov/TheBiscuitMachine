import React from "react";
import { connect } from "react-redux";
import { machineActions } from "../machine/machine-actions";

let Controls = ({
  isPaused,
  heatingElementOn,
  userId,
  startMachine,
  stopMachine,
  togglePause,
  toggleHeatingElement,
}) => (
  <div className="controls-wrapper">
    <button onClick={() => startMachine(userId)}>Start</button>
    <button onClick={() => togglePause(userId)}>
      {isPaused ? "Resume" : "Pause"}
    </button>
    <button onClick={() => stopMachine(userId)}>Stop</button>

    <button onClick={() => toggleHeatingElement(userId)}>
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
    userId: state.user.userId,
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
    togglePause: (userId) => {
      dispatch(machineActions.togglePause(userId));
    },
    toggleHeatingElement: (userId) => {
      dispatch(machineActions.toggleHeatingElement(userId));
    },
  };
};

Controls = connect(mapStateToProps, mapDispatchToProps)(Controls);

export default Controls;
