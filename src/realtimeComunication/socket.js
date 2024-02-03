import io from "socket.io-client";
let socket = null;

export const connectionStart = (userDetails) => {
  const jwtToken = userDetails.token;

  socket = io("http://localhost:3000", {
    transports: ["websocket"],
    auth: {
      token: jwtToken,
    },
  });

  socket.on("connect", () => {
    console.log("succesfully connected with socket.io server");
    console.log(socket.id);
  });
};
