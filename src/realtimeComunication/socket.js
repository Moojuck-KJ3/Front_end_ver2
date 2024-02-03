import io from "socket.io-client";
export let socket = null;

export const connectionStart = (userDetails) => {
  const jwtToken = userDetails.token;

  socket = io("https://backend-nest.fly.dev:3000", {
    transports: ["websocket"],
    auth: {
      token: jwtToken,
    },
  });

  socket.on("connect", () => {
    console.log("succesfully connected with socket.io server");
    console.log(socket.id);
  });

  socket.on("disconnect", () => {
    console.log("disconnected from socket.io server");
  });

  // 이 녀석도 join 하는 쪽에서 useEffect로 on 해주면 더 깔끔해질 듯하다
  socket.on("join-room-response", (isSuccess) => {
    console.log("response join", isSuccess);
    // 데이터에 따른 처리 필요
  });
};

export const createRoom = (data) => {
  console.log("create-room Data : ", data);
  socket.emit("create-room", data);
};

export const joinRoom = (data) => {
  console.log("join-room Data : ", data);
  socket.emit("join-room", data);
};
