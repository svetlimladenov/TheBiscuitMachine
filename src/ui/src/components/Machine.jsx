import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import BiscuitBox from "./BiscuitBox";
import MachineComponents from "./MachineComponent";
import Controls from "./Controls";
import InfoMessage from "./InfoMessage";
import MachineSpecifications from "./MachineSpecifications";
import Logs from "./Logs";
import MovingBiscuits from "./MovingBiscuits";

import MachineHubSingleton from "../signalR/machine-hub";
import { machineActions } from "../machine/machine-actions";

let Machine = ({
  user,
  handleMachineStarted,
  handleMachineStopped,
  handleOvenHeated,
}) => {
  const [biscuits, setBiscuits] = useState([]);
  const [biscuitBox, setBiscuitBox] = useState([]);
  const [shouldScale, setShouldScale] = useState(false);
  const [pulse, setPulse] = useState(1);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    MachineHubSingleton.startHubConnection(user.id);

    MachineHubSingleton.subscribeToMachineStartup(handleMachineStarted);
    MachineHubSingleton.subscribeToMachineStopped(handleMachineStopped);
    MachineHubSingleton.subscribeToOvenHeated(handleOvenHeated);

    return () => {
      MachineHubSingleton.stopHubConnection();
    };
  }, [user.id, handleMachineStarted, handleMachineStopped, handleOvenHeated]);

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

const mapDispatchToProps = (dispatch) => {
  return {
    handleMachineStarted: ({ pulse }) => {
      dispatch(machineActions.handleMachineStarted(pulse));
    },
    handleMachineStopped: () => {
      dispatch(machineActions.handleMachineStopped());
    },
    handleOvenHeated: () => {
      dispatch(machineActions.ovenHeated());
    },
  };
};

Machine = connect(mapStateToProps, mapDispatchToProps)(Machine);

export default Machine;
