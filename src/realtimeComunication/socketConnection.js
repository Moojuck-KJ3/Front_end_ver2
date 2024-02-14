import io from "socket.io-client";

export const connectionStart = (userDetails) => {
  const userDetail = userDetails ? JSON.parse(userDetails) : null;
  const jwtToken = userDetail ? userDetail.token : null;

  const socket = io(import.meta.env.VITE_APP_BACKEND_PROD_URL, {
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
