import { createStore, combineReducers } from "redux";
import { userReducer } from "../user/user-reducer";
import { machineReducer } from "../machine/machine-reducer";

const rootReducer = combineReducers({
  user: userReducer,
  machine: machineReducer,
});

const reduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(rootReducer, reduxDevTools);

export default store;
