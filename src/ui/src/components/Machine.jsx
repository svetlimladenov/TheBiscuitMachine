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

export default function Machine() {
  const user = useContext(UserContext);
  console.log("render");
  const [hubConnection, setHubConnection] = useState();

  const [biscuits, setBiscuits] = useState([]);
  const [biscuitBox, setBiscuitBox] = useState([]);
  const [shouldScale, setShouldScale] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [logs, setLogs] = useState([
    { message: messages.notStarted, timestamp: now() },
  ]);

  const [activeConnectionId, setActiveConnectionId] = useState();

  const [machineSpecs, setMachineSpecs] = useState({
    pulse: 2,
    heatingElementOn: false,
    ovenHeatingDuration: "00:00:00",
    ovenOverheatingDuration: "00:00:00",
    ovenColdDuration: "00:00:00",
  });

  const handleMachineStarted = ({
    activeConnectionId,
    pulse,
    ovenHeatingDuration,
    ovenOverheatingDuration,
    ovenColdDuration,
  }) => {
    // this will cause 3 renders :/
    addLog(messages.waitingForOvenToBeHeated);
    setActiveConnectionId(activeConnectionId);

    setMachineSpecs({
      pulse,
      heatingElementOn: true,
      ovenHeatingDuration,
      ovenOverheatingDuration,
      ovenColdDuration,
    });
  };

  const handleOvenHeated = () => {
    addLog(messages.ovenHeated);
    // this.handleStartConveyor();
    setTimeout(() => {
      addLog(messages.machineWorking);
    }, machineSpecs.pulse * 1000);
  };

  useEffect(() => {
    const hubConnection = MachineHub.createConnection("/machinehub");
    MachineHub.subscribeToMachineStartup(handleMachineStarted);
    MachineHub.subscribeToOvenHeated(handleOvenHeated);

    hubConnection
      .start()
      .then(() => {
        MachineHub.joinGroup(user.id);
      })
      .catch((error) => console.error(error));

    setHubConnection(hubConnection);

    return () => {
      hubConnection.stop();
    };
  }, [user.id]);

  const clearLogs = () => {
    setLogs([]);
  };

  const addLog = (message) => {
    setLogs((logs) => {
      return [{ message, timestamp: now() }, ...logs];
    });
  };

  const buttonHandlers = {
    handleStartButtonClick: () => {
      MachineHub.startMachine(user.id);
    },
    handlePauseButtonClick: () => {
      MachineHub.togglePause(user.id);
    },
    handleStopButtonClick: () => {
      MachineHub.stopMachine(user.id);
    },
    handleToggleHeatingElement: () => {
      MachineHub.toggleHeatingElement(user.id);
    },
  };

  return (
    <div>
      <InfoMessage {...logs[0]} />
      <div className="conveyor-wrapper">
        <MachineComponents scale={shouldScale} speed={machineSpecs.pulse} />
        <BiscuitBox biscuitBox={biscuitBox} />
        <div className="biscuit-line">
          <MovingBiscuits biscuits={biscuits} speed={machineSpecs.pulse} />
        </div>
      </div>
      <Controls
        {...buttonHandlers}
        isPaused={isPaused}
        heatingElementOn={machineSpecs.heatingElementOn}
      />
      <div className="logs-and-users-wrapper">
        <Logs logs={logs} clearLogs={clearLogs} />
        <MachineSpecifications userId={user.id} />
      </div>
    </div>
  );
}
