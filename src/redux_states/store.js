// store.js
import { createStore } from "redux";
import roomReducer from "./roomReducer";

const store = createStore(roomReducer);

export default store;
