import { useParams } from "react-router-dom";
import socket from "./socket";
import { useCallback, useEffect, useMemo, useState } from "react";

export let global_localStream = null;
export let global_remoteStream = null;

export const getLocalStream = () => {
  return global_localStream;
};

export const getRemoteStream = () => {
  return global_remoteStream;
};

export function useChatConnection(peerConnection) {
  const { roomId } = useParams();

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
    socket.connect();
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
        global_localStream = stream;
      });
  }, []);

  return {
    localStream,
  };
}

export function usePeerConnection(localStream) {
  const { roomId } = useParams();
  const [guestStream, setGuestStream] = useState(null);

  const peerConnection = useMemo(() => {
    const connection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun2.1.google.com:19302" },
        {
          urls: import.meta.env.VITE_APP_TURN_SERVER_URL,
          username: process.env.VITE_APP_TURN_SERVER_USERNAME,
          credential: process.env.VITE_APP_TURN_SERVER_CREDENTIALS,
        },
      ],
    });

    connection.addEventListener("icecandidate", ({ candidate }) => {
      socket.emit("send-candidate", { candidate, roomId });
    });

    connection.addEventListener("track", ({ streams }) => {
      setGuestStream(streams[0]);
      global_remoteStream = streams[0];
    });

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        connection.addTrack(track, localStream);
      });
    }

    return connection;
  }, [localStream, roomId]);

  return {
    peerConnection,
    guestStream,
  };
}

export function useSendOfferSending(peerConnection) {
  const { roomId } = useParams();
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

export function useSendingAnswer(peerConnection) {
  const { roomId } = useParams();

  const handleConnectionOffer = useCallback(
    async ({ offer }) => {
      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
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
