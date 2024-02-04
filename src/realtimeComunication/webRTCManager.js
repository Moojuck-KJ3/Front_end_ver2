import { useParams } from "react-router-dom";
import socket from "./socket";
import { useCallback } from "react";

let peerConnection;
let localStream = null;
let remoteStream = null;
const configuration = {
  iceServers: [{ urls: "stun:stun2.1.google.com:19302" }],
};

export const getLocalStream = () => localStream;
export const getRemoteStream = () => remoteStream;

export const initiateLocalStream = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  return localStream;
};

export const createPeerConnection = async (localStream) => {
  peerConnection = new RTCPeerConnection(configuration);

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  return peerConnection;
};

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
