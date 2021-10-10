import { machineActionTypes } from "./machine-action-types";
import MachineHubSingleton from "../signalR/machine-hub";

const startMachine = (userId) => {
  MachineHubSingleton.startMachine(userId);
  return { type: machineActionTypes.startMachine, userId };
};

const stopMachine = (userId) => {
  MachineHubSingleton.stopMachine(userId);
  return { type: machineActionTypes.stopMachine, userId };
};

const togglePause = (userId) => {
  MachineHubSingleton.togglePause(userId);
  return { type: machineActionTypes.togglePause, userId };
};

const toggleHeatingElement = (userId) => {
  MachineHubSingleton.toggleHeatingElement(userId);
  return { type: machineActionTypes.toggleHeatingElement, userId };
};

const clearLogs = () => {
  return { type: machineActionTypes.clearLogs };
};

const handleMachineStarted = (pulse, activeConnectionId) => {
  return { type: machineActionTypes.machineStarted, pulse, activeConnectionId };
};

const ovenHeated = () => (dispatch, getState) => {
  console.log("starting the pulse");
  const { pulse } = getState().machine;
  const intervalId = setInterval(() => {
    const { paused } = getState().machine;
    if (paused) {
      return;
    }
    dispatch({
      type: "PULSE",
      id: 1,
    });
  }, pulse * 1000);

  dispatch({
    type: machineActionTypes.ovenHeated,
    intervalId,
  });
};

const handleMachineStopped = () => (dispatch, getState) => {
  const intervalId = clearPulseInterval(getState());
  dispatch({
    type: machineActionTypes.machineStopped,
    intervalId,
  });
};

const handleMachinePauseToggled = (paused) => {
  return {
    type: machineActionTypes.machinePauseToggled,
    paused,
  };
};

const ovenOverheated = () => (dispatch, getState) => {
  console.log("dispatching oven overheated...");
  const intervalId = clearPulseInterval(getState());
  dispatch({
    type: machineActionTypes.ovenOverheated,
    intervalId,
  });
};

const clearPulseInterval = (state) => {
  const { intervalId } = state.machine;
  clearInterval(intervalId);
  return intervalId;
};

export const machineActions = {
  startMachine,
  stopMachine,
  togglePause,
  toggleHeatingElement,
  clearLogs,
  handleMachineStarted,
  handleMachineStopped,
  handleMachinePauseToggled,
  ovenHeated,
  ovenOverheated,
};
