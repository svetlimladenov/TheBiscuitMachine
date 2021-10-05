import React, { useContext } from "react";
import UserContext from "../shared/UserContext";

export default function Controls({ hub, isPaused, heatingElementOn }) {
  const userId = useContext(UserContext).id;

  return (
    <div className="controls-wrapper">
      <button onClick={() => hub.startMachine(userId)}>Start</button>
      <button onClick={() => hub.togglePause(userId)}>
        {isPaused ? "Resume" : "Pause"}
      </button>
      <button onClick={() => hub.stopMachine(userId)}>Stop</button>

      <button onClick={() => hub.toggleHeatingElement(userId)}>
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
