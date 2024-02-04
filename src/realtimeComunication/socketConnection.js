import io from "socket.io-client";

export const connectionStart = (userDetails) => {
  const userDetail = userDetails ? JSON.parse(userDetails) : null;
  const jwtToken = userDetail ? userDetail.token : null;

  const socket = io("http://13.236.161.65:8080", {
    auth: {
      token: jwtToken,
    },
  });

  return socket;
};
