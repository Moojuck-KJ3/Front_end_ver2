import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WaitingFreindVideoContainer from "../createRoomPage/video/WaitingFreindVideoContainer";
import CreateRoomPageFooter from "../createRoomPage/CreateRoomPageFooter";
import {
  createPeerConnection,
  useAnswerProcessing,
  useLocalCameraStream,
  useSendOfferSending,
  useSendingAnswer,
} from "../../realtimeComunication/webRTCManager";
import socket from "../../realtimeComunication/socket";

const WaitingPage = () => {
  const navigator = useNavigate();
  const { roomId } = useParams();
  const { localStream } = useLocalCameraStream();
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    if (localStream) {
      const initPeerConnection = async () => {
        const pc = await createPeerConnection(localStream);
        setPeerConnection(pc);
      };
      initPeerConnection();
    }
  }, [localStream]);

  const { sendOffer } = useSendOfferSending(peerConnection, roomId);
  const { handleConnectionOffer } = useSendingAnswer(peerConnection, roomId);
  const { handleOfferAnswer } = useAnswerProcessing(peerConnection);

  useEffect(() => {
    console.log(peerConnection);
    socket.on("answer", handleOfferAnswer);
    socket.on("another-person-ready", sendOffer);
    socket.on("send-connection-offer", handleConnectionOffer);

    return () => {
      socket.off("another-person-ready", sendOffer);
      socket.off("send-connection-offer", handleConnectionOffer);
      socket.off("answer", handleOfferAnswer);
    };
  }, [
    peerConnection,
    roomId,
    sendOffer,
    handleConnectionOffer,
    handleOfferAnswer,
  ]);

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
            localStream={localStream}
            remoteStrem={localStream}
          />
          {/* 버튼 */}
          <CreateRoomPageFooter onStart={handleStartGame} />
        </div>
      </div>
    </div>
  );
};

export default WaitingPage;
