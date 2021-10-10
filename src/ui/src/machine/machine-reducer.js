import messages from "../shared/messages";
import { now } from "../shared/utils";
import { machineActionTypes } from "./machine-action-types";

const initialState = {
  activeConnectionId: null,
  intervalId: null,
  pulse: null,
  running: false,
  paused: false,
  heatingElementOn: false,
  scale: false,
  logs: [],
  biscuits: [],
  box: [],
  biscuitId: 0,
};

const addLog = (logs, message) => {
  return [{ message: message, timestamp: now() }, ...logs];
};

export const machineReducer = (state = initialState, action) => {
  switch (action.type) {
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
    case machineActionTypes.machineStopping: {
      const logs = addLog(state.logs, action.log);
      return {
        ...state,
        running: false,
        logs,
      };
    }
    case machineActionTypes.machineStopped: {
      const logs = addLog(state.logs, messages.machineStopped);
      return {
        ...state,
        intervalId: null,
        box: [],
        biscuits: [],
        logs,
      };
    }
    case machineActionTypes.machinePauseToggled: {
      return {
        ...state,
        paused: action.paused,
      };
    }
    case machineActionTypes.ovenHeated: {
      const logs = addLog(state.logs, messages.machineWorking);
      return {
        ...state,
        intervalId: action.intervalId,
        heatingElementOn: true,
        running: true,
        logs,
      };
    }
    case machineActionTypes.heatingElementToggled: {
      return {
        ...state,
        heatingElementOn: !state.heatingElementOn,
      };
    }
    case machineActionTypes.pulse: {
      const { biscuits, box, running, biscuitId } = state;
      const newBiscuits = biscuits.map((biscuit) => {
        if (biscuit.step === 0) {
          return { y: biscuit.y, step: biscuit.step + 1, id: biscuit.id };
        }
        return { y: biscuit.y + 25, step: biscuit.step + 1, id: biscuit.id };
      });

      if (running) {
        newBiscuits.push({ y: 12, step: 0, id: biscuitId });
      }

      const biscuitForBox = newBiscuits.filter((biscuit) => biscuit.step === 5);

      let updatedBox = [...box, ...biscuitForBox];

      if (updatedBox.length > 5) {
        updatedBox = [];
      }

      return {
        ...state,
        scale: !state.scale,
        biscuits: newBiscuits,
        box: updatedBox,
        biscuitId: biscuitId + 1,
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
