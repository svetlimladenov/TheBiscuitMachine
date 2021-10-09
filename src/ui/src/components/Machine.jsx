import React, { useContext, useEffect, useState } from "react";

import BiscuitBox from "./BiscuitBox";
import MachineComponents from "./MachineComponent";
import Controls from "./Controls";
import InfoMessage from "./InfoMessage";
import MachineSpecifications from "./MachineSpecifications";
import Logs from "./Logs";
import MovingBiscuits from "./MovingBiscuits";
import messages from "../shared/messages";
import UserContext from "../shared/UserContext";

import { now } from "../shared/utils";
import MachineHubSingleton from "../signalR/machine-hub-singleton";

export default function Machine() {
  const user = useContext(UserContext);
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

  useEffect(() => {
    MachineHubSingleton.startHubConnection(user.id);

    const handleMachineStarted = ({ pulse }) => {
      console.log("Machine started");
    };

    const handleMachineStopped = () => {
      console.log("Machine stopped");
    };

    const handleOvenHeated = () => {
      console.log("Oven heated...");
    };

    MachineHubSingleton.subscribeToMachineStartup(handleMachineStarted);
    MachineHubSingleton.subscribeToMachineStopped(handleMachineStopped);
    MachineHubSingleton.subscribeToOvenHeated(handleOvenHeated);

    return () => {
      MachineHubSingleton.stopHubConnection();
    };
  }, [user.id]);

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
      <Controls />
      <div className="logs-and-users-wrapper">
        <Logs logs={logs} clearLogs={() => setLogs((logs) => [logs[0]])} />
        <MachineSpecifications userId={user.id} />
      </div>
    </div>
  );
}
