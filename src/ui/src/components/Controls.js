import React, { useContext } from "react";
import UserContext from "../shared/UserContext";
import MachineHubSingleton from "../signalR/machine-hub-singleton";

export default function Controls({ isPaused, heatingElementOn }) {
  const userId = useContext(UserContext).id;

  return (
    <div className="controls-wrapper">
      <button onClick={() => MachineHubSingleton.startMachine(userId)}>
        Start
      </button>
      <button onClick={() => MachineHubSingleton.togglePause(userId)}>
        {isPaused ? "Resume" : "Pause"}
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
}
