import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { userReducer } from "../user/user-reducer";
import { machineReducer } from "../machine/machine-reducer";
import {
  patchStoreToAddCrashRepoting,
  patchStoreToAddLogging,
  logging,
  crashReporter,
  applyMiddlewareByMonkeypatching,
  loggingMiddleware,
  crashReporterMiddleware,
  applyMiddlewareFake,
} from "../middlewares/logging-middleware";

const rootReducer = combineReducers({
  user: userReducer,
  machine: machineReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

// applyMiddlewareFake(store, [loggingMiddleware, crashReporterMiddleware]);

// patchStoreToAddLogging(store);
// patchStoreToAddCrashRepoting(store);

// applyMiddlewareByMonkeypatching(store, [logging, crashReporter]);

export default store;
