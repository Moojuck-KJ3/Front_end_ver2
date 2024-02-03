// store.js
import { createStore } from "redux";
import roomReducer from "./rooms";

const store = createStore(roomReducer);

export default store;
