import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WaitingFreindVideoContainer from "../createRoomPage/video/WaitingFreindVideoContainer";
import CreateRoomPageFooter from "../createRoomPage/CreateRoomPageFooter";
import {
  createPeerConnection,
  getLocalStream,
  getRemoteStream,
  initiateLocalStream,
  useAnswerProcessing,
  useSendOfferSending,
  useSendingAnswer,
} from "../../realtimeComunication/webRTCManager";
import socket from "../../realtimeComunication/socket";

const WaitingPage = () => {
  const navigator = useNavigate();
  const { roomId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    (async () => {
      await initiateLocalStream();
      const localStream = getLocalStream();
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      const pc = await createPeerConnection(localStream);
      setPeerConnection(pc);
    })();
  }, []);

  const { sendOffer } = useSendOfferSending(peerConnection, roomId);
  const { handleConnectionOffer } = useSendingAnswer(peerConnection, roomId);
  const { handleOfferAnswer } = useAnswerProcessing(peerConnection);

  useEffect(() => {
    socket.on("answer", handleOfferAnswer);
    socket.on("another-person_ready", sendOffer);
    socket.on("send-connection-offer", handleConnectionOffer);

    return () => {
      socket.off("another-person-ready", sendOffer);
      socket.off("send-connection-offer", handleConnectionOffer);
      socket.off("answer", handleOfferAnswer);
    };
  }, [roomId, sendOffer, handleConnectionOffer, handleOfferAnswer]);

  useEffect(() => {
    const checkRemoteStream = setInterval(() => {
      const remoteStream = getRemoteStream();
      if (remoteStream && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        clearInterval(checkRemoteStream);
      }
    }, 1000);

    return () => clearInterval(checkRemoteStream);
  }, []);

  const handleStartGame = () => {
    navigator(`/play-room/${roomId}`);
  };
  return (
    <div className=" min-h-screen text-gray-800 flex justify-center items-center">
      <div className="w-[500px] h-[600px] ">
        <div className="sm-m-10 bg-white shadow-xl py-4 rounded-xl  flex justify-center  animate-fade-up">
          <h1 className=" font-bold">친구를 기다리는 중...</h1>
        </div>
        {/* 메인 컨텐츠  */}
        <div className="h-full w-full mt-5 flex flex-col items-center  bg-white shadow-xl rounded-xl justify-center  animate-fade-up">
          {/* 비디오 */}
          <WaitingFreindVideoContainer
            localStream={localVideoRef}
            remoteStrem={remoteVideoRef}
          />
          {/* 버튼 */}
          <CreateRoomPageFooter onStart={handleStartGame} />
        </div>
      </div>
    </div>
  );
};

export default WaitingPage;
