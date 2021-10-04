import React, { useContext, useEffect, useState } from "react";

import BiscuitBox from "./BiscuitBox";
import MachineComponents from "./MachineComponent";
import Controls from "./Controls";
import InfoMessage from "./InfoMessage";
import MachineSpecifications from "./MachineSpecifications";
import Logs from "./Logs";
import MovingBiscuits from "./MovingBiscuits";

import MachineHub from "../signalR/machine-hub";
import messages from "../shared/messages";
import { now, addLogs } from "../shared/utils";
import UserContext from "../shared/UserContext";

function useMachineHub(groupId, setupHub) {
  const [machineHub, setMachineHub] = useState(new MachineHub());

  useEffect(() => {
    machineHub.createConnection();

    machineHub.hubConnection.start().then(() => {
      machineHub.joinGroup(groupId);
      setupHub(machineHub);
      setMachineHub(machineHub);
    });

    return () => {
      if (machineHub) {
        machineHub.stopConnection();
      }
    };
  }, [groupId, machineHub, setupHub]);

  return machineHub;
}

export default function Machine() {
  const user = useContext(UserContext);
  const [biscuits, setBiscuits] = useState([]);
  const [biscuitBox, setBiscuitBox] = useState([]);
  const [shouldScale, setShouldScale] = useState(false);

  const [logs, setLogs] = useState([
    { message: messages.notStarted, timestamp: now() },
  ]);

  const handleOvenHeated = () => {
    addLog(messages.ovenHeated);
    // this.handleStartConveyor();
    setTimeout(() => {
      addLog(messages.machineWorking);
    }, 2 * 1000);
  };

  const handleMachineStarted = (data) => {
    console.log(data);
  };

  const handleMachineStopped = () => {
    addLog(messages.machineStopped);
  };

  const hub = useMachineHub(user.id, (hub) => {
    hub.subscribeToMachineStartup(handleMachineStarted);
    hub.subscribeToOvenHeated(handleOvenHeated);
    hub.subscribeToMachineStopped(handleMachineStopped);
  });

  const clearLogs = () => {
    setLogs((logs) => [logs[0]]);
  };

  const addLog = (message) => {
    setLogs((logs) => {
      return [{ message, timestamp: now() }, ...logs];
    });
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
        <Logs logs={logs} clearLogs={clearLogs} />
        <MachineSpecifications userId={user.id} />
      </div>
    </div>
  );
}
