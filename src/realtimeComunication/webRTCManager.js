import { useParams } from "react-router-dom";
import socket from "./socket";
import { useCallback, useEffect, useState } from "react";

export let global_remote = {};

export const getRemoteStream = () => {
  return global_remote;
};

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

let peers = {};

export function usePeerConnection(localStream) {
  const { roomId } = useParams();
  const [remoteStreams, setRemoteStreams] = useState({});

  const createPeerConnection = useCallback(
    (socketId) => {
      console.log("createPeerConnection is called", socketId);
      const connection = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun2.1.google.com:19302" },
          {
            urls: import.meta.env.VITE_APP_TURN_SERVER_URL,
            username: import.meta.env.VITE_APP_TURN_SERVER_USERNAME,
            credential: import.meta.env.VITE_APP_TURN_SERVER_CREDENTIALS,
          },
        ],
      });

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          connection.addTrack(track, localStream);
        });
      }

      connection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("send-candidate", {
            roomId,
            socketId: socketId,
            candidate: event.candidate,
          });
        }
      };

      connection.ontrack = (event) => {
        setRemoteStreams((prevStreams) => ({
          ...prevStreams,
          [socketId]: event.streams[0],
        }));
        global_remote[socketId] = event.streams[0];
      };

      peers[socketId] = connection;
    },
    [localStream, roomId]
  );

  useEffect(() => {
    console.log("New remoteStreams and PeerConnections!");
    console.log(peers);
    console.log(remoteStreams);
  }, [remoteStreams]);

  useEffect(() => {
    const handleConnection = () => {
      console.log("join-room is called");
      socket.emit("join-room", roomId);
    };

    const handleUserJoined = async ({ socketId }) => {
      console.log("handleUserJoined is called!", socketId);

      if (!peers[socketId]) {
        createPeerConnection(socketId);
      }

      console.log("peers", peers);
      if (peers[socketId]) {
        try {
          const offer = await peers[socketId].createOffer();
          peers[socketId].setLocalDescription(offer);
          console.log(`${socketId}is setted setLocalDescription`);
          console.log(`send-connection-offer is begin`);

          socket.emit("send-connection-offer", { roomId, socketId, offer });
        } catch (error) {
          console.error("Error handling handleUserJoined data:", error);
        }
      }
    };

    const handleReceiveOffer = async ({ fromSocketId, offer }) => {
      console.log(
        `handleReceiveOffer is called, fromPlayerId is ${fromSocketId}`
      );

      if (!peers[fromSocketId]) {
        createPeerConnection(fromSocketId);
      }

      try {
        peers[fromSocketId].setRemoteDescription(offer);
        const answer = await peers[fromSocketId].createAnswer();
        peers[fromSocketId].setLocalDescription(answer);
        console.log(
          `fromPlayerId ${fromSocketId}is setRemoteDescription and setLocalDescription`
        );

        socket.emit("answer", { roomId, playerId: fromSocketId, answer });
      } catch (error) {
        console.error(
          "Error during offer reception and answer process:",
          error
        );
      }
    };

    const handleReceiveAnswer = ({ fromSocketId, answer }) => {
      `handleReceiveAnswer is called, responese is ${(fromSocketId, answer)}`;

      if (peers[fromSocketId]) {
        peers[fromSocketId].setRemoteDescription(answer);
      }
    };

    const handleReceiveCandidate = ({ fromSocketId, candidate }) => {
      `handleReceiveAnswer is called, responese is ${
        (fromSocketId, candidate)
      }`;

      if (peers[fromSocketId]) {
        peers[fromSocketId].addIceCandidate(candidate);
      }
    };
    socket.connect();

    socket.on("connect", handleConnection);
    socket.on("user-joined", handleUserJoined);
    socket.on("send-connection-offer", handleReceiveOffer);
    socket.on("answer", handleReceiveAnswer);
    socket.on("send-candidate", handleReceiveCandidate);

    return () => {
      socket.off("connect", handleConnection);
      socket.off("user-joined", handleUserJoined);
      socket.off("send-connection-offer", handleReceiveOffer);
      socket.off("answer", handleReceiveAnswer);
      socket.off("send-candidate", handleReceiveCandidate);
    };
  }, [createPeerConnection, localStream, roomId]);

  return {
    remoteStreams,
  };
}
