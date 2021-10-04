import React, { useState, useContext, useEffect } from "react";
import UserContext from "../shared/UserContext";

export default function Controls({ hub }) {
  const userId = useContext(UserContext).id;

  const [machineSpecs, setMachineSpecs] = useState({
    pulse: 2,
    heatingElementOn: false,
    ovenHeatingDuration: "00:00:00",
    ovenOverheatingDuration: "00:00:00",
    ovenColdDuration: "00:00:00",
  });

  const [isPaused, setIsPaused] = useState(false);

  const handleMachineStarted = ({
    activeConnectionId,
    pulse,
    ovenHeatingDuration,
    ovenOverheatingDuration,
    ovenColdDuration,
  }) => {
    // this will cause 3 re-nders :/
    setMachineSpecs({
      pulse,
      heatingElementOn: true,
      ovenHeatingDuration,
      ovenOverheatingDuration,
      ovenColdDuration,
    });
  };

  useEffect(() => {
    // hub.subscribeToMachineStartup(handleMachineStarted);
  }, [hub]);

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
            machineSpecs.heatingElementOn
              ? "heating-element-on"
              : "heating-element-off"
          }
        >
          {machineSpecs.heatingElementOn ? "On" : "Off"}
        </span>
      </button>
    </div>
  );
}
