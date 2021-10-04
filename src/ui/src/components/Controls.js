import React, { useContext } from "react";
import UserContext from "../shared/UserContext";
import MachineHub from "../signalR/machine-hub";

export default function Controls({ heatingElementOn, isPaused }) {
  const userId = useContext(UserContext).id;

  return (
    <div className="controls-wrapper">
      <button onClick={() => MachineHub.startMachine(userId)}>Start</button>
      <button onClick={() => MachineHub.togglePause(userId)}>
        {isPaused ? "Resume" : "Pause"}
      </button>
      <button onClick={() => MachineHub.stopMachine(userId)}>Stop</button>

      <button onClick={() => MachineHub.toggleHeatingElement(userId)}>
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
}
