import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { userReducer } from "../user/user-reducer";
import { machineReducer } from "../machine/machine-reducer";

const rootReducer = combineReducers({
  user: userReducer,
  machine: machineReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
