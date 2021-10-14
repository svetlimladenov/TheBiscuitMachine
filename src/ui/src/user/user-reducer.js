import { userActionTypes } from "./user-action-types";

const initialState = {
  id: localStorage.getItem("userId"),
  loggedIn: localStorage.getItem("userId") && true,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER": {
      return {
        id: action.id,
        loggedIn: true,
      };
    }
    case "REMOVE_USER": {
      return {
        id: null,
        loggedIn: false,
      };
    }

    case userActionTypes.setConnectionId: {
      return {
        ...state,
        connectionId: action.connectionId,
      };
    }
    default:
      return state;
  }
};
