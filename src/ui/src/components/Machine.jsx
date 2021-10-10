import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import BiscuitBox from "./BiscuitBox";
import MachineComponents from "./MachineComponent";
import Controls from "./Controls";
import InfoMessage from "./InfoMessage";
import MachineSpecifications from "./MachineSpecifications";
import Logs from "./Logs";
import MovingBiscuits from "./MovingBiscuits";

import MachineHubSingleton, { states } from "../signalR/machine-hub";
import { machineActions } from "../machine/machine-actions";
import { userActions } from "../user/user-actions";
import messages from "../shared/messages";

let Machine = ({
  user,
  shouldStopOnClose,
  setConnectionId,
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
    MachineHubSingleton.startHubConnection(user.id, setConnectionId);
    MachineHubSingleton.subscribeToMachineStartup(handleMachineStarted);
    MachineHubSingleton.subscribeToMachineStopped(() =>
      handleMachineStopped(messages.machineStopping)
    );
    MachineHubSingleton.subscribeToPaused(handleMachinePaused);
    MachineHubSingleton.subscribeToResumed(handleMachineResumed);
    MachineHubSingleton.subscribeToOvenHeated(handleOvenHeated);
    MachineHubSingleton.subscibeToOvenOverheated(() =>
      handleMachineStopped(messages.ovenOverheated)
    );
    MachineHubSingleton.subscribeToOvenCold(() =>
      handleMachineStopped(messages.ovenTooCold)
    );
    MachineHubSingleton.subscribeToHeatingElementToggled(
      handleHeatingElementToggled
    );
    MachineHubSingleton.subscribeToMachineAlreadyWorking(
      (state, heatingElementOn, pulse) => {
        // this.setState({ heatingElementOn, pulse });
        if (state === states.working) {
          handleOvenHeated();
        } else if (state === states.paused) {
          handleMachinePaused();
        } else if (state === states.ovenHeating) {
          handleMachineStarted({
            pulse,
            activeConnectionId: "active-connection-id",
          });
        }
      }
    );

    return () => {
      MachineHubSingleton.stopHubConnection();
    };
  }, [
    user.id,
    setConnectionId,
    handleMachineStarted,
    handleMachineStopped,
    handleOvenHeated,
    handleMachinePaused,
    handleMachineResumed,
    handleOvenOverheated,
    handleOvenCold,
    handleHeatingElementToggled,
  ]);

  useEffect(() => {
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      if (shouldStopOnClose) {
        return MachineHubSingleton.stopMachine(user.id);
      }
    });
  });

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
    shouldStopOnClose:
      state.user.connectionId === state.machine.activeConnectionId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setConnectionId: (connectionId) => {
      dispatch(userActions.setConnectionId(connectionId));
    },
    handleMachineStarted: ({ pulse, activeConnectionId }) => {
      console.log(pulse);
      dispatch(machineActions.handleMachineStarted(pulse, activeConnectionId));
    },
    handleMachineStopped: (log) => {
      dispatch(machineActions.handleMachineStopped(log));
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
    handleHeatingElementToggled: () => {
      dispatch(machineActions.heatingElementToggled());
    },
  };
};

Machine = connect(mapStateToProps, mapDispatchToProps)(Machine);

export default Machine;
