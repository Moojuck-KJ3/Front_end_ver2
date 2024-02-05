import { useNavigate, useParams } from "react-router-dom";
import WaitingFreindVideoContainer from "../createRoomPage/video/WaitingFreindVideoContainer";
import CreateRoomPageFooter from "../createRoomPage/CreateRoomPageFooter";

import CopyToClipboardButton from "./ClipboardClipboardCopyButton";
import { useEffect, useState } from "react";
import socket from "../../realtimeComunication/socket";

const WaitingPage = ({ localStream, guestStream }) => {
  const [isAllPlayerReady, setIsAllPlayerReady] = useState(false);
  const navigator = useNavigate();
  const { roomId } = useParams();
  const [progressValue, setProgressValue] = useState(50);

  useEffect(() => {
    const handleAllPlayerReady = () => {
      console.log("All players are ready");
      setIsAllPlayerReady(true);
      setProgressValue(100);
    };

    const handleStartPlayRoomResponse = () => {
      console.log("Starting the play-room");
      navigator(`/play-room/${roomId}`);
    };

    socket.on("all-player-ready", handleAllPlayerReady);
    socket.on("start-play-room-response", handleStartPlayRoomResponse);

    return () => {
      socket.off("all-player-ready", handleAllPlayerReady);
      socket.off("start-play-room-response", handleStartPlayRoomResponse);
    };
  }, [navigator, roomId]);

  useEffect(() => {
    if (isAllPlayerReady) {
      console.log("The Room Creator can now start the game.");
    }
  }, [isAllPlayerReady]);

  const handleStartGame = () => {
    if (isAllPlayerReady) {
      socket.emit("start-play-room", { roomId });
    } else {
      console.log("Not all players are ready");
    }
  };

  return (
    <div className=" min-h-screen text-gray-800 flex justify-center items-center">
      <div className="w-[500px] h-[600px] animate-fade-up">
        <div className="sm-m-10 bg-white shadow-2xl py-3 rounded-2xl flex flex-col jus justify-center items-center">
          <h1 className=" font-bold justify-center">친구를 기다리는 중...</h1>
          <CopyToClipboardButton roomId={roomId} />
        </div>

        {/* 메인 컨텐츠  */}
        <div className="h-full w-full mt-5 flex flex-col items-center  bg-white shadow-xl rounded-xl justify-center">
          {/* 비디오 */}
          <WaitingFreindVideoContainer
            localStream={localStream}
            remoteStrem={guestStream}
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
