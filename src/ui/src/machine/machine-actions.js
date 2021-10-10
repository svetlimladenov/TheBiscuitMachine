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
  const { pulse, activeConnectionId } = state.machine;
  const { connectionId } = state.user;
  const { id } = state.user;
  const intervalId = setInterval(() => {
    const { paused, box } = getState().machine;
    if (paused) {
      return;
    }

    if (box.length === 5 && activeConnectionId === connectionId) {
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

const clearConveyor = (getState, dispatch) => {
  console.log("clear ");
  const { pulse } = getState().machine;
  setTimeout(() => {
    const state = getState();
    clearPulseInterval(state);
    const { box } = state.machine;
    const { id } = state.user;
    if (box.length > 0) {
      MachineHubSingleton.deliverBiscuits(id, box.length);
    }
    dispatch({
      type: machineActionTypes.machineStopped,
    });
  }, pulse * 5 * 1000);
};

const handleMachineStopped = (log) => (dispatch, getState) => {
  dispatch({
    type: machineActionTypes.machineStopping,
    log: log,
  });

  clearConveyor(getState, dispatch);
};

const handleMachinePauseToggled = (paused) => {
  return {
    type: machineActionTypes.machinePauseToggled,
    paused,
  };
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
  heatingElementToggled,
};
