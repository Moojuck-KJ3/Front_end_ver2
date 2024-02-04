import socket from "./socket";
import { useCallback, useEffect, useState } from "react";

export function useChatConnection(peerConnection, roomId) {
  console.log("peerConnection", peerConnection);
  const { sendOffer } = useSendOfferSending(peerConnection, roomId);
  const { handleConnectionOffer } = useSendingAnswer(peerConnection, roomId);
  const { handleOfferAnswer } = useAnswerProcessing(peerConnection);

  const handleConnection = () => {
    socket.on("connect", () => {
      console.log("succesfully connected with socket.io server");
      console.log(socket.id);
    });
  };

  const handleReceiveCandidate = useCallback(
    ({ candidate }) => {
      peerConnection.addIceCandidate(candidate);
    },
    [peerConnection]
  );

  useEffect(() => {
    if (!peerConnection) return;
    socket.connect();
    socket.on("connect", handleConnection);
    socket.on("answer", handleOfferAnswer);
    socket.on("another-person-ready", sendOffer);
    socket.on("send-connection-offer", handleConnectionOffer);
    socket.on("send_candidate", handleReceiveCandidate);

    return () => {
      socket.off("connect", handleConnection);
      socket.off("answer", handleOfferAnswer);
      socket.off("another-person-ready", sendOffer);
      socket.off("send-connection-offer", handleConnectionOffer);
      socket.off("send_candidate", handleReceiveCandidate);
    };
  }, [
    peerConnection,
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
    if (!localStream) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun2.1.google.com:19302" }],
    });

    pc.addEventListener("icecandidate", ({ candidate }) => {
      socket.emit("send_candidate", { candidate, roomId });
    });

    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    pc.addEventListener("track", ({ streams }) => {
      setGuestStream(streams[0]);
    });

    setPeerConnection(pc);
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
