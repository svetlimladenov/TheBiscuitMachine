import messages from "../shared/messages";
import { now } from "../shared/utils";
import { machineActionTypes } from "./machine-action-types";

const initialState = {
  logs: [],
  running: false,
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
