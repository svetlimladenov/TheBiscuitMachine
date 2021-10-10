import messages from "../shared/messages";
import { now } from "../shared/utils";
import { machineActionTypes } from "./machine-action-types";

const initialState = {
  activeConnectionId: null,
  intervalId: null,
  pulse: null,
  running: false,
  paused: false,
  logs: [],
  biscuits: [],
};

const addLog = (logs, message) => {
  return [{ message: message, timestamp: now() }, ...logs];
};

export const machineReducer = (state = initialState, action) => {
  switch (action.type) {
    case machineActionTypes.startMachine: {
      const logs = addLog(state.logs, messages.machineWorking);
      const newState = { ...state, logs };
      return newState;
    }
    case machineActionTypes.stopMachine: {
      const logs = addLog(state.logs, messages.machineStopped);
      const newState = { ...state, logs };
      return newState;
    }
    case machineActionTypes.togglePause: {
      return state;
    }
    case machineActionTypes.toggleHeatingElement: {
      return state;
    }
    case machineActionTypes.machineStarted: {
      const logs = addLog(state.logs, messages.waitingForOvenToBeHeated);
      const newState = {
        ...state,
        logs,
        activeConnectionId: action.activeConnectionId,
        pulse: action.pulse,
      };
      return newState;
    }
    case machineActionTypes.machineStopped: {
      return {
        ...state,
        intervalId: null,
        running: false,
      };
    }
    case machineActionTypes.machinePauseToggled: {
      return {
        ...state,
        paused: action.paused,
      };
    }
    case machineActionTypes.ovenHeated: {
      return {
        ...state,
        intervalId: action.intervalId,
        running: true,
      };
    }
    case machineActionTypes.clearLogs: {
      return {
        ...state,
        logs: [],
      };
    }
    default: {
      return state;
    }
  }
};
