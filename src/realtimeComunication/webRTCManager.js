import { useParams } from "react-router-dom";
import socket from "./socket";
import { useCallback, useEffect, useState } from "react";

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
    (playerId) => {
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
            playerId: playerId,
            candidate: event.candidate,
          });
        }
      };

      connection.ontrack = (event) => {
        setRemoteStreams((prevStreams) => ({
          ...prevStreams,
          [playerId]: event.streams[0],
        }));
      };

      peers[playerId] = connection;
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

    const handleUserJoined = async ({ playerId }) => {
      console.log("handleUserJoined is called!", playerId);
      createPeerConnection(playerId);
      console.log("peers", peers);
      if (peers[playerId]) {
        try {
          const offer = await peers[playerId].createOffer();
          peers[playerId].setLocalDescription(offer);
          console.log(`${playerId}is setted setLocalDescription`);
          console.log(`send-connection-offer is begin`);

          socket.emit("send-connection-offer", { roomId, playerId, offer });
        } catch (error) {
          console.error("Error handling handleUserJoined data:", error);
        }
      }
    };

    const handleReceiveOffer = async ({ fromPlayerId, offer }) => {
      console.log(
        `handleReceiveOffer is called, fromPlayerId is ${fromPlayerId}`
      );

      if (!peers[fromPlayerId]) {
        createPeerConnection(fromPlayerId);
      }

      try {
        peers[fromPlayerId].setRemoteDescription(offer);
        const answer = await peers[fromPlayerId].createAnswer();
        peers[fromPlayerId].setLocalDescription(answer);
        console.log(
          `fromPlayerId ${fromPlayerId}is setRemoteDescription and setLocalDescription`
        );

        socket.emit("answer", { roomId, playerId: fromPlayerId, answer });
      } catch (error) {
        console.error(
          "Error during offer reception and answer process:",
          error
        );
      }
    };

    const handleReceiveAnswer = ({ fromPlayerId, answer }) => {
      `handleReceiveAnswer is called, responese is ${(fromPlayerId, answer)}`;

      if (peers[fromPlayerId]) {
        peers[fromPlayerId].setRemoteDescription(answer);
      }
    };

    const handleReceiveCandidate = ({ fromPlayerId, candidate }) => {
      `handleReceiveAnswer is called, responese is ${
        (fromPlayerId, candidate)
      }`;

      if (peers[fromPlayerId]) {
        peers[fromPlayerId].addIceCandidate(candidate);
      }
    };
    socket.connect();

    socket.on("connect", handleConnection);
    socket.on("user-joined", handleUserJoined);
    socket.on("send-connection-offer", handleReceiveOffer);
    socket.on("answer", handleReceiveAnswer);
    socket.on("send-candidate", handleReceiveCandidate);

    return () => {
      socket.on("connect", handleConnection);
      socket.on("user-joined", handleUserJoined);
      socket.on("send-connection-offer", handleReceiveOffer);
      socket.on("answer", handleReceiveAnswer);
      socket.on("send-candidate", handleReceiveCandidate);
    };
  }, [createPeerConnection, localStream, roomId]);

  return {
    remoteStreams,
  };
}
