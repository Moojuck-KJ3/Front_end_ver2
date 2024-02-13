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

export function usePeerConnection(localStream) {
  const { roomId } = useParams();
  const [remoteStreams, setRemoteStreams] = useState({});
  const [peerInfo, setPeerInfo] = useState({});

  const icecandidateHandler = useCallback(
    (playerId, event) => {
      if (event.candidate) {
        socket.emit("send-candidate", {
          roomId,
          playerId: playerId,
          candidate: event.candidate,
        });
      }
    },
    [roomId]
  );

  const addStreamHandler = useCallback((playerId, event) => {
    setRemoteStreams((prevStreams) => ({
      ...prevStreams,
      [playerId]: event.streams[0],
    }));
  }, []);

  const createPeerConnection = useCallback(
    async (playerId) => {
      const newPeerInfo = { ...peerInfo };
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun2.1.google.com:19302" },
          {
            urls: import.meta.env.VITE_APP_TURN_SERVER_URL,
            username: import.meta.env.VITE_APP_TURN_SERVER_USERNAME,
            credential: import.meta.env.VITE_APP_TURN_SERVER_CREDENTIALS,
          },
        ],
      });

      peerConnection.onicecandidate = (event) =>
        icecandidateHandler(playerId, event);
      peerConnection.ontrack = (event) => addStreamHandler(playerId, event);

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });
      }

      newPeerInfo[playerId] = { peerConnection };
      setPeerInfo(newPeerInfo);
    },
    [localStream, peerInfo, icecandidateHandler, addStreamHandler]
  );

  useEffect(() => {
    const handleConnection = () => {
      socket.emit("join-room", roomId);
    };

    const handleUserJoined = async ({ playerId }) => {
      if (!peerInfo[playerId]) {
        await createPeerConnection(playerId);
      }

      if (peerInfo[playerId]) {
        try {
          const offer = await peerInfo[playerId].createOffer();
          peerInfo[playerId].setLocalDescription(offer);
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

      if (!peerInfo[fromPlayerId]) {
        await createPeerConnection(fromPlayerId);
      }

      try {
        peerInfo[fromPlayerId].setRemoteDescription(offer);
        const answer = await peerInfo[fromPlayerId].createAnswer();
        peerInfo[fromPlayerId].setLocalDescription(answer);
        console.log(
          `fromPlayerId ${fromPlayerId}is setRemoteDescription and setLocalDescription`
        );

        console.log("now emiting answer is called");
        socket.emit("answer", { roomId, playerId: fromPlayerId, answer });
      } catch (error) {
        console.error(
          "Error during offer reception and answer process:",
          error
        );
      }
    };

    const handleReceiveAnswer = ({ fromPlayerId, answer }) => {
      console.log(
        `handleReceiveAnswer is called, fromPlayerId is ${fromPlayerId}`
      );

      if (peerInfo[fromPlayerId]) {
        peerInfo[fromPlayerId].setRemoteDescription(answer);
      }
    };

    const handleReceiveCandidate = ({ fromPlayerId, candidate }) => {
      `handleReceiveAnswer is called, responese is ${
        (fromPlayerId, candidate)
      }`;

      if (peerInfo[fromPlayerId]) {
        peerInfo[fromPlayerId].addIceCandidate(candidate);
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
  }, [createPeerConnection, localStream, roomId, peerInfo]);

  return {
    remoteStreams,
  };
}
