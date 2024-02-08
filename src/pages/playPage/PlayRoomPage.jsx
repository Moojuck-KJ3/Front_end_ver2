import { useEffect, useState } from "react";
import VideoContainer from "../../components/video/VideoContainer";
import VoiceRecoder from "../../components/recorder/VoiceRecoder";
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

const PlayRoomPage = () => {
  const { roomId } = useParams();

  // 모달 관련
  const [showModal, setShowModal] = useState(true);
  const [showModeThreeModal, setShowModeThreeModal] = useState(true);

  // 룸 모드 설정
  const [roomMode, setRoomMode] = useState(MODE.MODE1);

  // 화상 채팅
  const [localStream, setLocalStream] = useState(null);
  const [remoteStrem, setRemoteStream] = useState(null);

  // 200개 레스토랑 리스트 상태 관리
  const [restaurantList, setRestaurantList] = useState(restaurantLists);

  // 모드별 유저 선택 완료시, 상태 관리
  const [isReady, setIsReady] = useState(false);

  // 방에 총 몇 명이 준비 완료했는지 카운트.
  const [roomReadyCount, setRoomReadyCount] = useState(0);

  // 모드 2, 음성 인식 On, Off
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  // 모드 1, 음성 인식 결과 담는 곳
  const [modeOneVoiceRecResult, setModeOneVoiceRecResult] = useState([]);

  // 모드 2, 음성 인식 결과 담는 곳
  const [modeTwoVoiceRecResult, setModeTwoVoiceRecResult] = useState([]);

  // 플레이어 핸드에 보이는 데이터
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
      thumbnailURL: "/돈까스.png",
    },
  ]);

  // 조합시 결과를 보여줄 리스트
  const [combineList, setCombineList] = useState([]);

  useEffect(() => {
    const local = getLocalStream();
    setLocalStream(local);
    const remote = getRemoteStream();
    setRemoteStream(remote);
  }, []);

  useEffect(() => {
    socket.connect();
    socket.on("mode-change-response", handleModeChange);

    return () => {
      socket.off("mode-change-response", handleModeChange);
    };
  }, []);

  // 모든 유저가 준비 완료할 경우, 다음 모드로  넘어가는 함수
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

  // 선택 완료시, 호출하는 함수
  const handleSetReady = () => {
    console.log("handleSetReady is called");
    setIsReady(true);
    setShowVoiceRecorder(false);
    console.log({ roomId, roomMode, roomReadyCount });
    socket.emit("select-done", { roomId, roomReadyCount, roomMode });
  };

  return (
    <PlayRoomContainer>
      {/* 비디오 */}
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

      {/* 스텝바 */}
      <StepperWithContent setRoomMode={setRoomMode} />

      {roomMode === MODE.MODE1 && (
        <GameArea>
          {/* 별 */}
          <StarryBackground
            restaurantList={restaurantList}
            resultTags={modeOneVoiceRecResult}
            resultMoodTags={modeTwoVoiceRecResult}
            combineList={combineList}
          />

          {/* 설명 모달 */}
          {showModal && (
            <ModeOneExpainModal
              isShowModal={showModal}
              onShow={setShowModal}
              SetShowVoiceRecorder={setShowVoiceRecorder}
            />
          )}
          {/* 음성 인식 모달 */}
          {showVoiceRecorder && (
            <div className=" absolute top-[15%]">
              <VoiceRecoder
                onClick={handleSetReady}
                onSetResult={setModeOneVoiceRecResult}
              />
            </div>
          )}

          <PlayerHand handList={playerHand} onSetHandList={setPlayerHand} />
        </GameArea>
      )}
      {roomMode === MODE.MODE2 && (
        <GameArea>
          {/* 음성 인식 기능 On */}
          <VoiceRecognition onSetResult={setModeTwoVoiceRecResult} />
          {/* 별 */}
          <StarryBackground
            restaurantList={restaurantList}
            resultTags={modeOneVoiceRecResult}
            resultMoodTags={modeTwoVoiceRecResult}
            combineList={combineList}
          />

          {/* 플레이어 핸드 */}
          <PlayerHand handList={playerHand} onSetHandList={setPlayerHand} />
        </GameArea>
      )}
      {roomMode === MODE.MODE3 && (
        <GameArea>
          {/* 별 */}
          <StarryBackground
            restaurantList={restaurantList}
            resultTags={modeOneVoiceRecResult}
            resultMoodTags={modeTwoVoiceRecResult}
            combineList={combineList}
          />

          {/* 조합 모달 */}
          {showModeThreeModal && (
            <ModeThreeModal
              isShowModal={showModeThreeModal}
              onShow={setShowModeThreeModal}
              onSetCombineList={setCombineList}
            />
          )}
          {/* 플레이어 핸드 */}
          <PlayerHand handList={playerHand} onSetHandList={setPlayerHand} />
        </GameArea>
      )}
      {roomMode === MODE.MODE4 && (
        <GameArea>
          {/* 결과창 */}
          {/* <ImageSilderBg /> */}
          <StarryBackground
            restaurantList={restaurantList}
            resultTags={modeOneVoiceRecResult}
            resultMoodTags={modeTwoVoiceRecResult}
            combineList={combineList}
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

const DUMMY_COMBINE_LIST = [
  {
    restId: "1",
    name: "토리모리",
    x: 1,
    y: 2,
    category: "한식", // Korean
    mood: ["조용한"],
    miniStarUrl: "/Star_2.png",
    BigStarUrl: "/Star_3.png",
    FoodUrl: "/Food.png",
    thumbnailURL: "/돈까스.png",
  },
  {
    restId: "2",
    name: "사쿠라",
    x: 3,
    y: 4,
    category: "일식", // Japanese
    mood: ["행복한"],
    miniStarUrl: "/Star_2.png",
    BigStarUrl: "/Star_3.png",
    FoodUrl: "/Food.png",
    thumbnailURL: "/돈까스.png",
  },
  {
    restId: "3",
    name: "중국성",
    x: 5,
    y: 6,
    category: "중식", // Chinese
    mood: ["분위기 좋은"],
    miniStarUrl: "/Star_2.png",
    BigStarUrl: "/Star_3.png",
    FoodUrl: "/Food.png",
    thumbnailURL: "/돈까스.png",
  },
  {
    restId: "7",
    name: "토리모리",
    x: 22,
    y: 12,
    category: "한식", // Korean
    mood: ["분위기 좋은"],

    miniStarUrl: "/Star_2.png",
    BigStarUrl: "/Star_3.png",
    FoodUrl: "/Food.png",
    thumbnailURL: "/돈까스.png",
  },
  {
    restId: "8",
    name: "사쿠라",
    x: 53,
    y: 35,
    category: "일식", // Japanese
    mood: ["분위기 좋은"],

    miniStarUrl: "/Star_2.png",
    BigStarUrl: "/Star_3.png",
    FoodUrl: "/Food.png",
    thumbnailURL: "/돈까스.png",
  },
];
