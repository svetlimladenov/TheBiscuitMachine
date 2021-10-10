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
  handleMachinePaused,
  handleMachineResumed,
  handleOvenHeated,
  handleOvenOverheated,
  handleOvenCold,
  handleHeatingElementToggled,
}) => {
  useEffect(() => {
    MachineHubSingleton.startHubConnection(user.id);

    MachineHubSingleton.subscribeToMachineStartup(handleMachineStarted);
    MachineHubSingleton.subscribeToMachineStopped(handleMachineStopped);
    MachineHubSingleton.subscribeToPaused(handleMachinePaused);
    MachineHubSingleton.subscribeToResumed(handleMachineResumed);
    MachineHubSingleton.subscribeToOvenHeated(handleOvenHeated);
    MachineHubSingleton.subscibeToOvenOverheated(handleOvenOverheated);
    MachineHubSingleton.subscribeToOvenCold(handleOvenCold);
    MachineHubSingleton.subscribeToHeatingElementToggled(
      handleHeatingElementToggled
    );

    return () => {
      MachineHubSingleton.stopHubConnection();
    };
  }, [
    user.id,
    handleMachineStarted,
    handleMachineStopped,
    handleOvenHeated,
    handleMachinePaused,
    handleMachineResumed,
    handleOvenOverheated,
    handleOvenCold,
    handleHeatingElementToggled,
  ]);

  return (
    <div>
      <InfoMessage />
      <div className="conveyor-wrapper">
        <MachineComponents />
        <BiscuitBox />
        <div className="biscuit-line">
          <MovingBiscuits />
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
    handleMachineStarted: ({ pulse, activeConnectionId }) => {
      dispatch(machineActions.handleMachineStarted(pulse, activeConnectionId));
    },
    handleMachineStopped: () => {
      dispatch(machineActions.handleMachineStopped());
    },
    handleMachinePaused: () => {
      dispatch(machineActions.handleMachinePauseToggled(true));
    },
    handleMachineResumed: () => {
      dispatch(machineActions.handleMachinePauseToggled(false));
    },
    handleOvenHeated: () => {
      dispatch(machineActions.ovenHeated());
    },
    handleOvenOverheated: () => {
      dispatch(machineActions.ovenOverheated());
    },
    handleOvenCold: () => {
      dispatch(machineActions.ovenCold());
    },
    handleHeatingElementToggled: () => {
      dispatch(machineActions.heatingElementToggled());
    },
  };
};

Machine = connect(mapStateToProps, mapDispatchToProps)(Machine);

export default Machine;
