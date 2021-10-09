import { userActionTypes } from "./user-action-types";

const setUser = (id) => {
  localStorage.setItem("userId", id);
  return {
    type: userActionTypes.setUser,
    id,
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
