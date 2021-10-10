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
  const state = getState();
  const { pulse } = state.machine;
  const { id } = state.user;
  const intervalId = setInterval(() => {
    const { paused, box } = getState().machine;
    if (paused) {
      return;
    }

    console.log(box.length);
    if (box.length === 5) {
      MachineHubSingleton.deliverBiscuits(id, box.length);
    }

    dispatch({
      type: machineActionTypes.pulse,
    });
  }, pulse * 1000);

  dispatch({
    type: machineActionTypes.ovenHeated,
    intervalId,
  });
};

const handleMachineStopped = () => (dispatch, getState) => {
  clearPulseInterval(getState());
  // dispatch event to change the state to running to stopping, so we dont make new cookies
  // and dispatch another event with a timeout to clear the interval, but to wait for all cookies to reach the end
  dispatch({
    type: machineActionTypes.machineStopped,
  });
};

const handleMachinePauseToggled = (paused) => {
  return {
    type: machineActionTypes.machinePauseToggled,
    paused,
  };
};

const ovenOverheated = () => (dispatch, getState) => {
  clearPulseInterval(getState());
  dispatch({
    type: machineActionTypes.ovenOverheated,
  });
};

const ovenCold = () => (dispatch, getState) => {
  clearPulseInterval(getState());
  dispatch({
    type: machineActionTypes.ovenCold,
  });
};

const heatingElementToggled = () => {
  return {
    type: machineActionTypes.heatingElementToggled,
  };
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
  ovenCold,
  heatingElementToggled,
};
