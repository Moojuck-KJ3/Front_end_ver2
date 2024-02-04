import { connectionStart } from "./socketConnection";

const userDetails = localStorage.getItem("user");
const socket = connectionStart(userDetails);

export default socket;
