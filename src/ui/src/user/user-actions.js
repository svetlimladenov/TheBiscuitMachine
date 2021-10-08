import { userActionTypes } from "./user-action-types";

const setUser = (userId) => {
  localStorage.setItem("userId", userId);
  return {
    type: userActionTypes.setUser,
    userId,
  };
};

const removeUser = () => {
  localStorage.removeItem("userId");
  return {
    type: userActionTypes.removeUser,
  };
};

export const userActions = {
  setUser,
  removeUser,
};
