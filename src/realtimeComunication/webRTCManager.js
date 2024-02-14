import { useParams } from "react-router-dom";
// import socket from "./socket";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "./SocketContext";

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

export function usePeerConnection(localStream) {
  const { roomId } = useParams();
  const [users, setUsers] = useState([]);
  const pcsRef = useRef({});
  const socket = useSocket();

  const createPeerConnection = useCallback(
    (socketId) => {
      console.log("createPeerConnection is called", socketId);
      try {
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun2.1.google.com:19302" },
            {
              urls: import.meta.env.VITE_APP_TURN_SERVER_URL,
              username: import.meta.env.VITE_APP_TURN_SERVER_USERNAME,
              credential: import.meta.env.VITE_APP_TURN_SERVER_CREDENTIALS,
            },
          ],
        });

        pc.onicecandidate = (event) => {
          if (!event.candidate) return;
          console.log("send-candidate is emitting!");
          socket.emit("send-candidate", {
            candidate: event.candidate,
            candidateSendID: socket.id,
            candidateReceiveID: socketId,
          });
        };

        pc.oniceconnectionstatechange = (e) => {
          console.log(e);
        };

        pc.ontrack = (event) => {
          console.log("ontrack success");
          setUsers((oldUsers) =>
            oldUsers
              .filter((user) => user.socketId !== socketId)
              .concat({
                socketId: socketId,
                stream: event.streams[0],
              })
          );
        };

        if (localStream) {
          localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
          });
        }

        return pc;
      } catch (e) {
        console.error(e);
        return undefined;
      }
    },
    [localStream]
  );

  useEffect(() => {
    if (!socket) return;

    const handleConnection = () => {
      console.log("join-room is called");
      socket.emit("join-room", { roomId });
    };

    const handleAllUsers = async (allUsers) => {
      console.log("handleAllUsers is called!");
      allUsers.forEach(async (user) => {
        if (!localStream) return;
        const pc = createPeerConnection(user.socketId);
        if (!pc) return;
        pcsRef.current = { ...pcsRef.current, [user.socketId]: pc };
        try {
          const offer = await pc.createOffer();
          console.log("create offer success");
          await pc.setLocalDescription(offer);
          console.log(`send-connection-offer is emitting`);
          socket.emit("send-connection-offer", {
            sdp: offer,
            offerSendID: socket.id,
            offerReceiveID: user.socketId,
          });
        } catch (error) {
          console.error("Error handling handleUserJoined data:", error);
        }
      });
    };

    const handleReceiveOffer = async (data) => {
      const { sdp, offerSendID } = data;
      console.log("handleReceiveOffer is called ", offerSendID);
      if (!localStream) return;
      const pc = createPeerConnection(offerSendID);
      if (!pc) return;
      pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
      try {
        await pc.setRemoteDescription(sdp);
        console.log("answer set remote description success");
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        console.log(`answer is emitting`);
        socket.emit("answer", {
          sdp: answer,
          answerSendID: socket.id,
          answerReceiveID: offerSendID,
        });
      } catch (error) {
        console.error(
          "Error during offer reception and answer process:",
          error
        );
      }
    };

    const handleReceiveAnswer = (data) => {
      const { sdp, answerSendID } = data;
      console.log("handleReceiveAnswer is called ", answerSendID);
      const pc = pcsRef.current[answerSendID];
      if (!pc) return;
      pc.setRemoteDescription(sdp);
    };

    const handleReceiveCandidate = async (data) => {
      console.log("handleReceiveCandidate is called ");
      console.log(data);
      const pc = pcsRef.current[data.candidateSendID];
      if (!pc) return;
      await pc.addIceCandidate(data.candidate);
      console.log("candidate add success");
      // if (peers[fromPlayerId]) {
      //   peers[fromPlayerId].addIceCandidate(candidate);
      // }
    };

    // socket.connect();
    // socket.on("connect", handleConnection);
    handleConnection();
    socket.on("all-users", handleAllUsers);
    socket.on("send-connection-offer", handleReceiveOffer);
    socket.on("answer", handleReceiveAnswer);
    socket.on("send-candidate", handleReceiveCandidate);

    return () => {
      // socket.off("connect", handleConnection);
      socket.off("user-joined", handleAllUsers);
      socket.off("send-connection-offer", handleReceiveOffer);
      socket.off("answer", handleReceiveAnswer);
      socket.off("send-candidate", handleReceiveCandidate);
    };
  }, [socket, createPeerConnection, localStream, roomId]);

  return {
    users,
  };
}
