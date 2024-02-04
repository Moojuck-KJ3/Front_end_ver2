import socket from "./socket";
import { useCallback, useEffect, useState } from "react";

export function useChatConnection(peerConnection, roomId) {
  const { sendOffer } = useSendOfferSending(peerConnection, roomId);
  const { handleConnectionOffer } = useSendingAnswer(peerConnection, roomId);
  const { handleOfferAnswer } = useAnswerProcessing(peerConnection);

  const handleConnection = useCallback(() => {
    socket.emit("join-room", roomId);
  }, [roomId]);

  const handleReceiveCandidate = useCallback(
    ({ candidate }) => {
      peerConnection.addIceCandidate(candidate);
    },
    [peerConnection]
  );

  useEffect(() => {
    socket.on("connect", handleConnection);
    socket.on("answer", handleOfferAnswer);
    socket.on("another-person-ready", sendOffer);
    socket.on("send-connection-offer", handleConnectionOffer);
    socket.on("send-candidate", handleReceiveCandidate);

    return () => {
      socket.off("connect", handleConnection);
      socket.off("answer", handleOfferAnswer);
      socket.off("another-person-ready", sendOffer);
      socket.off("send-connection-offer", handleConnectionOffer);
      socket.off("send-candidate", handleReceiveCandidate);
    };
  }, [
    handleConnection,
    roomId,
    handleOfferAnswer,
    sendOffer,
    handleConnectionOffer,
    handleReceiveCandidate,
  ]);
}

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

export function usePeerConnection(localStream, roomId) {
  const [peerConnection, setPeerConnection] = useState(null);
  const [guestStream, setGuestStream] = useState(null);

  useEffect(() => {
    if (!localStream) return; // Do nothing if localStream is null

    const connection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun2.1.google.com:19302" }],
    });

    localStream.getTracks().forEach((track) => {
      connection.addTrack(track, localStream);
    });

    connection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit("send-candidate", { roomId, candidate });
      }
    };

    connection.ontrack = ({ streams }) => {
      setGuestStream(streams[0]);
    };

    setPeerConnection(connection);

    return () => {
      connection.close();
    };
  }, [localStream, roomId]);

  return { peerConnection, guestStream };
}

export function useSendOfferSending(peerConnection, roomId) {
  const sendOffer = useCallback(async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit("send-connection-offer", {
      roomId,
      offer,
    });
  }, [peerConnection, roomId]);

  return { sendOffer };
}

export function useSendingAnswer(peerConnection, roomId) {
  const handleConnectionOffer = useCallback(
    async ({ offer }) => {
      const sessionDescription = new RTCSessionDescription(offer);
      await peerConnection.setRemoteDescription(sessionDescription);
      const answer = await peerConnection.createAnswer();
      console.log(peerConnection, answer);
      await peerConnection.setLocalDescription(answer);

      socket.emit("answer", { answer, roomId });
    },
    [peerConnection, roomId]
  );

  return {
    handleConnectionOffer,
  };
}

export function useAnswerProcessing(peerConnection) {
  const handleOfferAnswer = useCallback(
    ({ answer }) => {
      peerConnection.setRemoteDescription(answer);
    },
    [peerConnection]
  );

  return {
    handleOfferAnswer,
  };
}
