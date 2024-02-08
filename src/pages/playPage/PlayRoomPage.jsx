import { useEffect, useState } from "react";
import VideoContainer from "../../components/video/VideoContainer";
import VoiceRecoder from "../../components/recorder/VoiceRecoder";
import PlaceCombineArea from "./modeThree/card/PlaceCombineArea";
import ImageSilderBg from "./modeFour/ImageSilderBg";
import GameArea from "./GameArea";
import PlayerHand from "./PlayerHand";
import PlayRoomContainer from "./PlayRoomContainer";
import ModeOneExpainModal from "../../components/modal/ModeOneExpainModal";
import {
  getLocalStream,
  getRemoteStream,
} from "../../realtimeComunication/webRTCManager";

import { useParams } from "react-router-dom";
import socket from "../../realtimeComunication/socket";
import { StarryBackground } from "./StarryBackground";
import { restaurantLists } from "./restaurantLists";
import VoiceRecognition from "./modeTwo/VoiceRecognition";
import { StepperWithContent } from "./StepperWithContent";
import ModeThreeModal from "../../components/modal/ModeThreeExpainModal";

import { getRestaurantList } from "../../api";

const PlayRoomPage = () => {
  const { roomId } = useParams();
  const [showModal, setShowModal] = useState(true);
  const [showModeThreeModal, setShowModeThreeModal] = useState(true);
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
      category: "한식",
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

    const sendData = {
      purposeCoordinate: localStorage.getItem("purposeCoordinate"),
    };

    const getRestList = async (roomId, sendData) => {
      // default 재시도는 3
      const response = await getRestaurantList(roomId, sendData);

      if (response.error) {
        console.log(response.exception);
        return;
      }

      // 받아오는 data에 별 및 음식 관련 url 내용 추가
      setRestaurantList(response);
    };

    getRestList(roomId, sendData);
  }, []);

  useEffect(() => {
    socket.connect();
    socket.on("mode-change-response", handleModeChange);
    socket.on("receive-speech-foodCategory", handleReceiveFoodCategory);

    return () => {
      socket.off("mode-change-response", handleModeChange);
      socket.off("receive-speech-foodCategory", handleReceiveFoodCategory);
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

  const handleReceiveFoodCategory = (data) => {
    if (length(data.foodCategories) > 0) {
      setModeOneVoiceRecResult(data.foodCategories);
    } else {
      console.log("적절한 음식 카테고리를 찾지 못했습니다.");
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
      <div className=" rounded-full absolute bottom-32 left-0 z-10">
        <VideoContainer mediaStream={localStream} />
      </div>
      <div className=" rounded-full absolute bottom-32 right-0 z-10">
        <VideoContainer mediaStream={remoteStrem} />
      </div>
      <div className=" rounded-full absolute top-20 right-0 z-10">
        <img
          className=" w-40 h-40 items-center border-4 bg-gray-300 border-white
            shadow-2xl rounded-full object-cover"
          src="/현재훈_profile.jpg"
          alt=""
        />
      </div>
      <div className=" rounded-full absolute top-20 left-0 z-10">
        <img
          className=" w-40 h-40 items-center border-4 bg-gray-300 border-white
            shadow-2xl rounded-full object-cover"
          src="/이서연_profile.png"
          alt=""
        />
      </div>
      <StepperWithContent setRoomMode={setRoomMode} />
      {/* <div className="mt-5 bg-white flex flex-col justify-center items-center border-8 shadow-inner font-tenada rounded-xl w-2/3 mx-auto">
        
      </div> */}

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
            <div className=" absolute top-[15%]">
              <VoiceRecoder
                onClick={handleSetReady}
                //onSetResult={setModeOneVoiceRecResult}
              />
            </div>
          )}

          <PlayerHand handList={playerHand} onSetHandList={setPlayerHand} />
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

          {/* 플레이어 핸드 */}
          <PlayerHand handList={playerHand} onSetHandList={setPlayerHand} />
        </GameArea>
      )}
      {roomMode === MODE.MODE3 && (
        <GameArea>
          <StarryBackground
            restaurantList={restaurantList}
            resultTags={modeOneVoiceRecResult}
            resultMoodTags={modeTwoVoiceRecResult}
          />

          {/* <PlaceCombineArea /> */}
          {/* 컨텐츠 */}
          {showModeThreeModal && (
            <ModeThreeModal
              isShowModal={showModeThreeModal}
              onShow={setShowModeThreeModal}
            />
          )}
          {/* 플레이어 핸드 */}
          <PlayerHand handList={playerHand} onSetHandList={setPlayerHand} />
        </GameArea>
      )}
      {roomMode === MODE.MODE4 && (
        <GameArea>
          {/* <ImageSilderBg /> */}
          <StarryBackground
            restaurantList={restaurantList}
            resultTags={modeOneVoiceRecResult}
            resultMoodTags={modeTwoVoiceRecResult}
          />
          <PlayerHand handList={playerHand} onSetHandList={setPlayerHand} />
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
