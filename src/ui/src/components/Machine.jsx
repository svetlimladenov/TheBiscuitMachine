import React, { useEffect, useRef, useState } from "react";

import { defaults } from "../shared/fetch";
import BiscuitBox from "./BiscuitBox";
import MachineComponents from "./MachineComponent";
import Controls from "./Controls";
import InfoMessage from "./InfoMessage";
import MachineSpecifications from "./MachineSpecifications";
import Logs from "./Logs";
import MovingBiscuits from "./MovingBiscuits";
import messages from "../shared/messages";
import { machineActions } from "../machine/machine-actions";

import { useMachineHub } from "../hooks/hooks";
import { connect } from "react-redux";
import { HubConnectionBuilder } from "@microsoft/signalr";

let Machine = ({ user }) => {
  const [biscuits, setBiscuits] = useState([]);
  const [biscuitBox, setBiscuitBox] = useState([]);
  const [shouldScale, setShouldScale] = useState(false);
  const [pulse, setPulse] = useState(1);
  const [intervalId, setIntervalId] = useState(null);

  const [connection, setConnection] = useState();

  useEffect(() => {
    createConnection(user.userId);
    return () => {
      // connection.stop();
      setConnection(null);
    };
  }, [user.userId]);

  const createConnection = async (groupId) => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${defaults.signalRUrl}/machinehub`)
      .build();

    connection.on("MachineStarted", handleMachineStarted);
    connection.on("MachineStopped", handleMachineStopped);

    await connection.start();
    await connection.invoke("JoinGroup", groupId);
    setConnection(connection);
  };

  const handleMachineStarted = ({ pulse }) => {
    console.log("Handling Signal R EVENT");
    setPulse(pulse);
  };

  const handleMachineStopped = () => {
    setIntervalId((i) => clearInterval(i));
    // addLog(messages.machineStopped);
  };

  const handleOvenHeated = () => {
    // addLog(messages.ovenHeated);
    handleStartConveyor();
    setTimeout(() => {
      // addLog(messages.machineWorking);
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
      <InfoMessage />
      <div className="conveyor-wrapper">
        <MachineComponents scale={shouldScale} speed={2} />
        <BiscuitBox biscuitBox={biscuitBox} />
        <div className="biscuit-line">
          <MovingBiscuits biscuits={biscuits} speed={2} />
        </div>
      </div>
      <Controls />
      <div className="logs-and-users-wrapper">
        <Logs />
        <MachineSpecifications />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

Machine = connect(mapStateToProps)(Machine);

export default Machine;
