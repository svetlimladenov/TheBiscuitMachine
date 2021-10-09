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
  }, [user.id]);

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
      dispatch({ type: "MACHINE_STARTED", pulse });
    },
    handleMachineStopped: () => {
      dispatch({ type: "MACHINE_STOPPED" });
    },
    handleOvenHeated: () => {
      dispatch({ type: "OVEN_HEATED" });
    },
  };
};

Machine = connect(mapStateToProps, mapDispatchToProps)(Machine);

export default Machine;
