// store.js
import { createStore } from "redux";
import roomReducer, { setRoomId } from "./rooms";

const store = createStore(roomReducer);
setRoomId("0000");

export default store;
