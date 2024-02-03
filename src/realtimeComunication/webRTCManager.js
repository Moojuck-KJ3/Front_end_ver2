import socket from './socket';

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

export const createPeerConnection = async () => {
  peerConnection = new RTCPeerConnection(configuration);

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    [remoteStream] = event.streams[0];
  };

  // Listen for ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("send-candidate", event.candidate);
    }
  };

  // Handle receiving candidates from the remote peer
  socket.on("receive-candidate", (candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  });

  return peerConnection;
};

export const closeCall = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  }
  remoteStream = null;
};
