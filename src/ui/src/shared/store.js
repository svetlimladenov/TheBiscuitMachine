import { createStore, combineReducers, applyMiddleware } from "redux";
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

const reduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(
  rootReducer,
  reduxDevTools
  // applyMiddleware(loggingMiddleware, crashReporterMiddleware)
);

// applyMiddlewareFake(store, [loggingMiddleware, crashReporterMiddleware]);

// patchStoreToAddLogging(store);
// patchStoreToAddCrashRepoting(store);

// applyMiddlewareByMonkeypatching(store, [logging, crashReporter]);

export default store;
