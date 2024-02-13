import { useParams } from "react-router-dom";
import socket from "./socket";
import { useCallback, useEffect, useRef, useState } from "react";

const pc_config = {
  iceServers: [
    { urls: "stun:stun2.1.google.com:19302" },
    {
      urls: import.meta.env.VITE_APP_TURN_SERVER_URL,
      username: import.meta.env.VITE_APP_TURN_SERVER_USERNAME,
      credential: import.meta.env.VITE_APP_TURN_SERVER_CREDENTIALS,
    },
  ],
};

export function usePeerConnection() {
  const { roomId } = useParams();
  const [localStream, setLocalStream] = useState(null);
  const [users, setUsers] = useState([]);
  const [pcsinfo, setPcsinfo] = useState({});

  const getLocalStream = useCallback(async () => {
    try {
      await navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: true,
        })
        .then((stream) => {
          setLocalStream(stream);
        });

      socket.emit("join-room", {
        roomId,
      });
      console.log("join-room is called");
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
  }, []);


  

  const createPeerConnection = useCallback((socketId) => {
    try {
      console.log("createPeerConnection is called", socketId);
      const pc = new RTCPeerConnection(pc_config);

      pc.onicecandidate = (e) => {
        if (!e.candidate) return;
        socket.emit("send-candidate", {
          candidate: e.candidate,
          candidateSendID: socket.id,
          candidateReceiveID: socketId,
        });
        console.log("send-candidate is called");
      };

      pc.oniceconnectionstatechange = (e) => {
        console.log(e);
      };

      pc.ontrack = (e) => {
        console.log("ontrack success");
        setUsers((oldUsers) =>
          oldUsers
            .filter((user) => user.socketId !== socketId)
            .concat({
              socketId: socketId,
              stream: e.streams[0],
            })
        );
      };

      if (localStream) {
        console.log("localstream add");
        localStream.getTracks().forEach((track) => {
          if (!localStream) return;
          pc.addTrack(track, localStream);
        });
      } else {
        console.log("no local stream");
      }

      return pc;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }, []);

  useEffect(() => {
    console.log("users");
    console.log(users);
    console.log("pcsinfo");
    console.log(pcsinfo);
  }, []);

  useEffect(() => {
    getLocalStream();
    socket.on("all-users", (allUsers) => {
      console.log("all-users is called");
      allUsers.forEach(async (user) => {
        console.log(user);
        if (!localStream) return;
        const pc = createPeerConnection(user.socketId);
        if (!pc) return;
        setPcsinfo((prev) => ({
          ...prev,
          [user.socketId]: pc,
        }));

        try {
          const localSdp = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          console.log("create offer success");
          await pc.setLocalDescription(new RTCSessionDescription(localSdp));
          socket.emit("send-connection-offer", {
            sdp: localSdp,
            offerSendID: socket.id,
            offerReceiveID: user.socketId,
          });
        } catch (e) {
          console.error(e);
        }
      });
    });

    socket.on("send-connection-offer", async (data) => {
      const { sdp, offerSendID } = data;
      console.log("send-connection-offer");
      if (!localStream) return;
      const pc = createPeerConnection(offerSendID);
      if (!pc) return;
      setPcsinfo((prev) => ({
        ...prev,
        [offerSendID.socketId]: pc,
      }));
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log("answer set remote description success");
        const localSdp = await pc.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });
        await pc.setLocalDescription(new RTCSessionDescription(localSdp));
        socket.emit("answer", {
          sdp: localSdp,
          answerSendID: socket.id,
          answerReceiveID: offerSendID,
        });
      } catch (e) {
        console.error(e);
      }
    });

    socket.on("answer", (data) => {
      const { sdp, answerSendID } = data;
      console.log("get answer");
      const pc = pcsinfo[answerSendID];
      if (!pc) return;
      pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on("send-candidate", async (data) => {
      console.log("get candidate");
      const pc = pcsinfo[data.candidateSendID];
      if (!pc) return;
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      console.log("candidate add success");
    });
    return () => {
      socket.off("connect");
      socket.off("all-users");
      socket.off("send-connection-offer");
      socket.off("answer");
      socket.off("send-candidate");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPeerConnection, getLocalStream]);

  return {
    localStream,
    users,
  };
}
//
//   useEffect(() => {
//     const handleConnection = () => {
//       console.log("join-room is called");
//       socket.emit("join-room", roomId);
//     };

//     const handleUserJoined = async ({ socketId }) => {
//       console.log("handleUserJoined is called!", socketId);

//       if (!peers[socketId]) {
//         createPeerConnection(socketId);
//       }

//       console.log("peers", peers);
//       if (peers[socketId]) {
//         try {
//           const offer = await peers[socketId].createOffer();
//           peers[socketId].setLocalDescription(offer);
//           console.log(`${socketId}is setted setLocalDescription`);
//           console.log(`send-connection-offer is begin`);

//           socket.emit("send-connection-offer", { roomId, socketId, offer });
//         } catch (error) {
//           console.error("Error handling handleUserJoined data:", error);
//         }
//       }
//     };

//     const handleReceiveOffer = async ({ fromSocketId, offer }) => {
//       console.log(
//         `handleReceiveOffer is called, fromPlayerId is ${fromSocketId}`
//       );

//       if (!peers[fromSocketId]) {
//         createPeerConnection(fromSocketId);
//       }

//       try {
//         peers[fromSocketId].setRemoteDescription(offer);
//         const answer = await peers[fromSocketId].createAnswer();
//         peers[fromSocketId].setLocalDescription(answer);
//         console.log(
//           `fromPlayerId ${fromSocketId}is setRemoteDescription and setLocalDescription`
//         );

//         socket.emit("answer", { roomId, playerId: fromSocketId, answer });
//       } catch (error) {
//         console.error(
//           "Error during offer reception and answer process:",
//           error
//         );
//       }
//     };

//     const handleReceiveAnswer = ({ fromSocketId, answer }) => {
//       `handleReceiveAnswer is called, responese is ${(fromSocketId, answer)}`;

//       if (peers[fromSocketId]) {
//         peers[fromSocketId].setRemoteDescription(answer);
//       }
//     };

//     const handleReceiveCandidate = ({ fromSocketId, candidate }) => {
//       `handleReceiveAnswer is called, responese is ${
//         (fromSocketId, candidate)
//       }`;

//       if (peers[fromSocketId]) {
//         peers[fromSocketId].addIceCandidate(candidate);
//       }
//     };
//     socket.connect();

//     socket.on("connect", handleConnection);
//     socket.on("user-joined", handleUserJoined);
//     socket.on("send-connection-offer", handleReceiveOffer);
//     socket.on("answer", handleReceiveAnswer);
//     socket.on("send-candidate", handleReceiveCandidate);

//     return () => {
//       socket.off("connect", handleConnection);
//       socket.off("user-joined", handleUserJoined);
//       socket.off("send-connection-offer", handleReceiveOffer);
//       socket.off("answer", handleReceiveAnswer);
//       socket.off("send-candidate", handleReceiveCandidate);
//     };
//   }, [createPeerConnection, localStream, roomId]);

//   return {
//     remoteStreams,
//   };
// }

export function useLocalCameraStream() {
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
      });
  }, []);

  return {
    localStream,
  };
}
