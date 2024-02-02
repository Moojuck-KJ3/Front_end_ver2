import React from "react";
import { useNavigate } from "react-router-dom";
import { VideoFeed } from "../../components/video/VideoFeed";
import WaitingFriendVideo from "../createRoomPage/video/WaitingFriendVideo";
import WaitingFreindVideoContainer from "../createRoomPage/video/WaitingFreindVideoContainer";
import CreateRoomPageFooter from "../createRoomPage/CreateRoomPageFooter";

const WaitingPage = () => {
  const navigator = useNavigate();

  const handleStartGame = () => {
    navigator("/play-room");
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
          <WaitingFreindVideoContainer />
          {/* 버튼 */}
          <CreateRoomPageFooter onStart={handleStartGame} />
        </div>
      </div>
    </div>
  );
};

export default WaitingPage;
