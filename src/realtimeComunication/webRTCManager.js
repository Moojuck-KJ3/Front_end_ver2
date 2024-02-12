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
  const [peerConnections, setPeerConnections] = useState({});
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
            candidate: event.candidate.toJSON(),
          });
        }
      };

      connection.ontrack = (event) => {
        setRemoteStreams((prevStreams) => ({
          ...prevStreams,
          [playerId]: event.streams[0],
        }));
      };

      return connection;
    },
    [localStream, roomId]
  );

  // useEffect(() => {
  //   console.log("New remoteStreams and PeerConnections!");
  //   console.log(peerConnections);
  //   console.log(remoteStreams);
  // }, [peerConnections, remoteStreams]);

  useEffect(() => {
    const handleConnection = () => {
      // console.log(
      //   "handleConnection is called, now 'join-emit' routine is calling"
      // );
      socket.emit("join-room", roomId);
    };

    const handleUserJoined = ({ playerId }) => {
      // console.log("handleUserJoined is called", playerId);
      if (peerConnections[playerId]) return;

      const pc = createPeerConnection(playerId);
      setPeerConnections((prev) => ({ ...prev, [playerId]: pc }));

      // console.log("in the handleUserJoined function, new Created peer is ", pc);

      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer);
        socket.emit("send-connection-offer", { roomId, playerId, offer });
      });
    };

    const handleReceiveOffer = ({ fromPlayerId, offer }) => {
      // console.log("handleReceiveOffer is callde", { fromPlayerId, offer });

      let pc;
      if (!peerConnections[fromPlayerId]) {
        pc = createPeerConnection(fromPlayerId);
        setPeerConnections((prev) => ({ ...prev, [fromPlayerId]: pc }));
      } else {
        pc = peerConnections[fromPlayerId];
      }

      pc.setRemoteDescription(new RTCSessionDescription(offer));
      pc.createAnswer().then((answer) => {
        pc.setLocalDescription(answer);
        socket.emit("answer", { roomId, playerId: fromPlayerId, answer });
      });
    };

    const handleReceiveAnswer = ({ fromPlayerId, answer }) => {
      // console.log("handleReceiveAnswer is called", { fromPlayerId, answer });

      const pc = peerConnections[fromPlayerId];
      if (pc) {
        pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    };

    const handleReceiveCandidate = ({ fromPlayerId, candidate }) => {
      // console.log("handleReceiveCandidate is called", {
      //   fromPlayerId,
      //   candidate,
      // });

      const pc = peerConnections[fromPlayerId];
      // console.log("handleReceiveCandidate new pc is ", pc);
      if (pc) {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
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
  }, [createPeerConnection, localStream, peerConnections, roomId]);

  return {
    remoteStreams,
  };
}
