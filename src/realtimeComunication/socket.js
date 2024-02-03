import io from "socket.io-client";

export const connectionStart = (userDetails) => {
  const jwtToken = userDetails.token;

  const socket = io("http://13.236.161.65:8080", {
    auth: {
      token: jwtToken,
    },
  });

  socket.on("connect", () => {
    console.log("succesfully connected with socket.io server");
    console.log(socket.id);
  });

  return socket;
};
