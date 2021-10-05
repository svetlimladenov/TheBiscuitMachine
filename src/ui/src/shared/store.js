import { createStore, combineReducers } from "redux";
import { userReducer } from "../reducers/user-reducer";

const rootReducer = combineReducers({
  user: userReducer,
});

const reduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(rootReducer, reduxDevTools);

export default store;
