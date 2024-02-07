import { useEffect, useState } from "react";
import VideoContainer from "../../components/video/VideoContainer";
import VoiceRecoder from "../../components/recorder/VoiceRecoder";
import ModeSetButton from "../../components/button/ModeSetButton";
import RandomPlaceTags from "./modeTwo/tags/RandomPlaceTags";
import PlaceCombineArea from "./modeThree/card/PlaceCombineArea";
import ImageSilderBg from "./modeFour/ImageSilderBg";
import GameArea from "./GameArea";
import PlayerHand from "./PlayerHand";
import PlayRoomContainer from "./PlayRoomContainer";
import ModeOneExpainModal from "../../components/modal/ModeOneExpainModal";
import SelectModeButtons from "./modeThree/SelectModeButtons";
import {
  getLocalStream,
  getRemoteStream,
} from "../../realtimeComunication/webRTCManager";
//import { getMoodKeyword } from "../../api";
import { useParams } from "react-router-dom";
import socket from "../../realtimeComunication/socket";
import { StarryBackground } from "./StarryBackground";
import { restaurantLists } from "./restaurantLists";
import VoiceRecognition from "./modeTwo/VoiceRecognition";

import { tagNames } from "./modeTwo/TagList";

const PlayRoomPage = () => {
  const { roomId } = useParams();
  const [showModal, setShowModal] = useState(true);
  const [roomMode, setRoomMode] = useState(MODE.MODE1);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStrem, setRemoteStream] = useState(null);
  const [restaurantList, setRestaurantList] = useState(restaurantLists);
  const [isReady, setIsReady] = useState(false);
  const [roomReadyCount, setRoomReadyCount] = useState(0);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [modeOneVoiceRecResult, setModeOneVoiceRecResult] = useState([]);
  const [modeTwoVoiceRecResult, setModeTwoVoiceRecResult] = useState([]);
  const [playerHand, setPlayerHand] = useState([
    {
      restId: "1",
      name: "토리모리",
      x: 1,
      y: 2,
      category: "한식", // Korean
      mood: ["분위기 좋은"],

      miniStarUrl: "/Star_2.png",
      BigStarUrl: "/Star_3.png",
      FoodUrl: "/Food.png",
    },
  ]);

  useEffect(() => {
    const local = getLocalStream();
    setLocalStream(local);
    const remote = getRemoteStream();
    setRemoteStream(remote);

    // const getMoodKeywords = async (roomId) => {
    //   const response = await getMoodKeyword(roomId);

    //   if (response.error) {
    //     console.log(response.exception);
    //   } else {
    //     setTags(response.moodKeywords);
    //   }
    // };

    // getMoodKeywords(roomId);
    setTags(tagNames);
  }, []);

  useEffect(() => {
    socket.connect();
    socket.on("mode-change-response", handleModeChange);

    return () => {
      socket.off("mode-change-response", handleModeChange);
    };
  }, []);

  const handleModeChange = (data) => {
    if (data.roomReadyCount < 2) {
      setRoomReadyCount((prev) => prev + 1);
    } else if (data.roomReadyCount >= 2) {
      console.log(data.roomReadyCount);
      setRoomMode(data.newMode);
      setIsReady(false);
      setRoomReadyCount(0);
      console.log(data.roomReadyCount);
    }
  };

  const handleSetReady = () => {
    console.log("handleSetReady is called");
    setIsReady(true);
    setShowVoiceRecorder(false);
    console.log({ roomId, roomMode, roomReadyCount });
    socket.emit("select-done", { roomId, roomReadyCount, roomMode });
  };

  return (
    <PlayRoomContainer>
      <div className="mt-5 bg-white flex flex-col justify-center items-center border-8 shadow-inner font-tenada rounded-xl w-2/3 mx-auto">
        <div className=" rounded-full absolute bottom-10 -left-8 z-10">
          <VideoContainer mediaStream={localStream} />
        </div>
        <div className=" rounded-full absolute bottom-10 -right-8 z-10">
          <VideoContainer mediaStream={remoteStrem} />
        </div>
        <div className=" rounded-full absolute top-16 -right-8 z-10">
          <img
            className=" w-40 h-40 items-center border-4 bg-gray-300 border-white
            shadow-2xl rounded-full object-cover"
            src="/현재훈_profile.jpg"
            alt=""
          />
        </div>
        <div className=" rounded-full absolute top-16 -left-8 z-10">
          <img
            className=" w-40 h-40 items-center border-4 bg-gray-300 border-white
            shadow-2xl rounded-full object-cover"
            src="/이서연_profile.png"
            alt=""
          />
        </div>
        {/* <h1 className="font-bold text-2xl h-[100px] text-center">
          오늘은 어떤 음식을 먹고 싶으세요?
        </h1> */}
      </div>
      {roomMode === MODE.MODE1 && (
        <GameArea>
          <StarryBackground
            restaurantList={restaurantList}
            resultTags={modeOneVoiceRecResult}
            resultMoodTags={modeTwoVoiceRecResult}
          />
          {showModal && (
            <ModeOneExpainModal
              isShowModal={showModal}
              onShow={setShowModal}
              SetShowVoiceRecorder={setShowVoiceRecorder}
            />
          )}
          {showVoiceRecorder && (
            <div className=" absolute top-[10%]">
              <VoiceRecoder
                onClick={handleSetReady}
                onSetResult={setModeOneVoiceRecResult}
              />
            </div>
          )}

          <ModeSetButton setRoomMode={setRoomMode} />

          <PlayerHand
            Hands={playerHand}
            playerName="마찬옥님"
            avatarUrl="/avatar.png"
          />
        </GameArea>
      )}
      {roomMode === MODE.MODE2 && (
        <GameArea>
          {/* 컨텐츠 */}

          <VoiceRecognition onSetResult={setModeTwoVoiceRecResult} />

          <StarryBackground
            restaurantList={restaurantList}
            resultTags={modeOneVoiceRecResult}
            resultMoodTags={modeTwoVoiceRecResult}
          />
          {/* 프로그레스 바 */}
          <ModeSetButton setRoomMode={setRoomMode} />
          {/* 플레이어 핸드 */}
          <PlayerHand
            Hands={playerHand}
            playerName="마찬옥님"
            avatarUrl="/avatar.png" // Replace with the actual path to John's avatar
          />
        </GameArea>
      )}
      {roomMode === MODE.MODE3 && (
        <GameArea>
          {/* 버튼 */}

          {/* 컨텐츠 */}
          <div className="w-3/4 flex border-1 shadow-md rounded-lg mx-10 bg-white justify-center ">
            <div className="w-full bg-gray-100 m-3 rounded-md shadow-md justify-center items-center flex ">
              <PlaceCombineArea
                contentNumber={2}
                onCardClick={(cardType, cardValue) =>
                  updatePlayerHand(cardType, cardValue)
                }
              />
            </div>
          </div>
          {/* 프로그레스 바 */}
          <ModeSetButton setRoomMode={setRoomMode} />
          {/* 플레이어 핸드 */}
          <PlayerHand
            Hands={playerHand}
            playerName="마찬옥님"
            avatarUrl="/avatar.png" // Replace with the actual path to John's avatar
          />
        </GameArea>
      )}
      {roomMode === MODE.MODE4 && (
        <GameArea>
          {/* 프로그레스 바 */}
          <ModeSetButton setRoomMode={setRoomMode} />
          <ImageSilderBg />
        </GameArea>
      )}
    </PlayRoomContainer>
  );
};

const MODE = {
  MODE1: 1,
  MODE2: 2,
  MODE3: 3,
  MODE4: 4,
};

export default PlayRoomPage;
