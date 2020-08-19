import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootRudcer from "./reducers";

const initialState = {};

const middlewre = [thunk];

const store = createStore(
  rootRudcer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewre))
);

export default store;
