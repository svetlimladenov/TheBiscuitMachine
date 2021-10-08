import { machineActionTypes } from "./machine-action-types";

const initialState = {
  running: false,
};

export const machineReducer = (state = initialState, action) => {
  switch (action.type) {
    case machineActionTypes.startMachine: {
      return state;
    }
    case machineActionTypes.stopMachine: {
      return state;
    }
    case machineActionTypes.togglePause: {
      return state;
    }
    case machineActionTypes.toggleHeatingElement: {
      return state;
    }
    default: {
      return state;
    }
  }
};
