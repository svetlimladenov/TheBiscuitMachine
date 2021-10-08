import React, { useRef, useState } from "react";

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

let Machine = ({ user, addLog }) => {
  const [biscuits, setBiscuits] = useState([]);
  const [biscuitBox, setBiscuitBox] = useState([]);
  const [shouldScale, setShouldScale] = useState(false);
  const [pulse, setPulse] = useState(1);
  const [intervalId, setIntervalId] = useState(null);

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
      <InfoMessage />
      <div className="conveyor-wrapper">
        <MachineComponents scale={shouldScale} speed={2} />
        <BiscuitBox biscuitBox={biscuitBox} />
        <div className="biscuit-line">
          <MovingBiscuits biscuits={biscuits} speed={2} />
        </div>
      </div>
      <Controls hub={hub} />
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

const mapDispatchToProps = (dispatch) => {
  return {
    addLog: (text) => {
      dispatch(machineActions.addLog(text));
    },
  };
};

Machine = connect(mapStateToProps, mapDispatchToProps)(Machine);

export default Machine;
