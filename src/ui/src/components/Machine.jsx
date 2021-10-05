import React, { useContext, useEffect, useRef, useState } from "react";

import BiscuitBox from "./BiscuitBox";
import MachineComponents from "./MachineComponent";
import Controls from "./Controls";
import InfoMessage from "./InfoMessage";
import MachineSpecifications from "./MachineSpecifications";
import Logs from "./Logs";
import MovingBiscuits from "./MovingBiscuits";
import messages from "../shared/messages";

import { now } from "../shared/utils";
import { useMachineHub } from "../hooks/hooks";
import { StoreContext } from "../shared/StoreContext";

export default function Machine() {
  console.log("Render");
  const store = useContext(StoreContext);
  const user = store.getState().user;

  const [biscuits, setBiscuits] = useState([]);
  const [biscuitBox, setBiscuitBox] = useState([]);
  const [shouldScale, setShouldScale] = useState(false);
  const [pulse, setPulse] = useState(1);
  const [intervalId, setIntervalId] = useState(null);
  const [logs, setLogs] = useState([
    { message: messages.notStarted, timestamp: now() },
  ]);

  const addLog = (message) => {
    setLogs((logs) => {
      return [{ message, timestamp: now() }, ...logs];
    });
  };

  // useRef will give us the same ref object on every render, so our effect won't trigger
  const setupSubscribersRef = useRef((hub) => {
    hub.subscribeToMachineStartup(handleMachineStarted);
    hub.subscribeToMachineStopped(handleMachineStopped);
    hub.subscribeToOvenHeated(handleOvenHeated);
  });

  const hub = useMachineHub(user.userId, setupSubscribersRef.current);

  const handleMachineStarted = ({ pulse }) => {
    setPulse(pulse);
  };

  const handleMachineStopped = () => {
    setIntervalId((i) => clearInterval(i));
    addLog(messages.machineStopped);
  };

  const handleOvenHeated = () => {
    addLog(messages.ovenHeated);
    handleStartConveyor();
    setTimeout(() => {
      addLog(messages.machineWorking);
    }, pulse * 1000);
  };

  const handleStartConveyor = () => {
    const intervalId = setInterval(() => {
      // move bisctuis
    }, pulse * 1000);

    setIntervalId(intervalId);
  };

  return (
    <div>
      <InfoMessage {...logs[0]} />
      <div className="conveyor-wrapper">
        <MachineComponents scale={shouldScale} speed={2} />
        <BiscuitBox biscuitBox={biscuitBox} />
        <div className="biscuit-line">
          <MovingBiscuits biscuits={biscuits} speed={2} />
        </div>
      </div>
      <Controls hub={hub} />
      <div className="logs-and-users-wrapper">
        <Logs logs={logs} clearLogs={() => setLogs((logs) => [logs[0]])} />
        <MachineSpecifications userId={user.userId} />
      </div>
    </div>
  );
}
