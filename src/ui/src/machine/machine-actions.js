import { machineActionTypes } from "./machine-action-types";

const startMachine = (userId) => {
  return { type: machineActionTypes.startMachine, userId };
};

const stopMachine = (userId) => {
  return { type: machineActionTypes.stopMachine, userId };
};

const togglePause = (userId) => {
  return { type: machineActionTypes.togglePause, userId };
};
const toggleHeatingElement = (userId) => {
  return { type: machineActionTypes.toggleHeatingElement, userId };
};

export const machineActions = {
  startMachine,
  stopMachine,
  togglePause,
  toggleHeatingElement,
};
