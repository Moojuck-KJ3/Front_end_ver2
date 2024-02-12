import { useNavigate, useParams } from "react-router-dom";
import WaitingFreindVideoContainer from "../createRoomPage/video/WaitingFreindVideoContainer";
import CreateRoomPageFooter from "../createRoomPage/CreateRoomPageFooter";
import { usePeerConnection } from "../../realtimeComunication/webRTCManager";
import CopyToClipboardButton from "./ClipboardClipboardCopyButton";
import { useEffect, useState } from "react";
import socket from "../../realtimeComunication/socket";
import Typewriter from "../../components/type/TypeWriter";

const WaitingPage = ({ localStream, roomDetail, setRoomDetail }) => {
  // 개발 끝나면, isAllPlayerReady False로 바꾸기
  const [isAllPlayerReady, setIsAllPlayerReady] = useState(true);
  const navigator = useNavigate();
  const { roomId } = useParams();
  const [progressValue, setProgressValue] = useState(50);
  const { remoteStreams } = usePeerConnection(localStream);

  useEffect(() => {
    console.log("remoteStreams and PeerConnections!");
    console.log(remoteStreams);
    setRoomDetail((prevDetail) => ({
      ...prevDetail,
      playerStreams: { ...prevDetail.playerStreams, ...remoteStreams },
    }));
  }, [remoteStreams, setRoomDetail]);

  useEffect(() => {
    const handleAllPlayerReady = () => {
      console.log("All players are ready");
      setIsAllPlayerReady(true);
      setProgressValue(100);
    };

    const handleStartPlayRoomResponse = (data) => {
      console.log("Starting the play-room", data);

      setRoomDetail((prev) => ({
        ...prev,
        purposeCoordinate: {
          lat: data.coordinates[0],
          lng: data.coordinates[1],
        },
        roomMemberCount: data.roomMemberCount,
      }));
      navigator(`/play-room/${roomId}`);
    };

    socket.on("all-player-ready", handleAllPlayerReady);
    socket.on("start-play-room-response", handleStartPlayRoomResponse);

    return () => {
      socket.off("all-player-ready", handleAllPlayerReady);
      socket.off("start-play-room-response", handleStartPlayRoomResponse);
    };
  }, [navigator, setRoomDetail, roomId]);

  useEffect(() => {
    if (isAllPlayerReady) {
      console.log("The Room Creator can now start the game.");
    }
  }, [isAllPlayerReady]);

  const handleStartGame = () => {
    if (isAllPlayerReady) {
      const data = {
        roomId: roomId,
        coordinates: [
          roomDetail.purposeCoordinate.lat,
          roomDetail.purposeCoordinate.lng,
        ],
      };
      socket.emit("start-play-room", data);
    } else {
      console.log("Not all players are ready");
    }
  };

  return (
    <div className="bg-[url('/BackGroundImg_2.jpg')] min-h-screen text-gray-800 flex justify-center items-center">
      <div className=" animate-fade-up">
        <div className="sm-m-10 bg-white shadow-2xl py-4 px-10 rounded-2xl flex flex-col jus justify-center items-center">
          <div className="flex">
            <h1 className=" font-bold justify-center font-tenada text-2xl">
              친구를 기다리는 중
            </h1>
            <div>
              <Typewriter text="...." delay={300} infinite />
            </div>
          </div>
          <CopyToClipboardButton roomId={roomId} />
        </div>

        {/* 메인 컨텐츠  */}
        <div className="h-full w-full mt-5 p-10 flex flex-col items-center  bg-white shadow-xl rounded-xl justify-center">
          {/* 비디오 */}
          <WaitingFreindVideoContainer
            localStream={localStream}
            remoteStreams={remoteStreams}
          />
          {/* 버튼 */}
          <CreateRoomPageFooter
            isActivate={isAllPlayerReady}
            onStart={handleStartGame}
            progressValue={progressValue}
          />
        </div>
      </div>
    </div>
  );
};

export default WaitingPage;
