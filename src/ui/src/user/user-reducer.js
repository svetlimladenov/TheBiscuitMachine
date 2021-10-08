const initialState = {
  userId: localStorage.getItem("userId"),
  loggedIn: localStorage.getItem("userId") && true,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER": {
      return {
        userId: action.userId,
        loggedIn: true,
      };
    }
    case "REMOVE_USER": {
      return {
        userId: null,
        loggedIn: false,
      };
    }
    default:
      return state;
  }
};
