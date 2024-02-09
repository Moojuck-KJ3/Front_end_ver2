import { useCallback, useEffect, useState } from "react";
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

import { StepperWithContent } from "./StepperWithContent";
import ModeThreeModal from "../../components/modal/ModeThreeExpainModal";

import { getRestaurantList } from "../../api";
import UserVideoContainer from "../../components/video/UserVideoContainer";
import VoiceRecognition from "./VoiceRecognition";

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

  // 모드 1 보이스 인식 결과
  const [modeOneVoiceRecResult, SetModeOneVoiceRecResult] = useState([]);

  // 모드 2 보이스 인식 결과
  const [modeTwoVoiceRecResult, SetModeTwoVoiceRecResult] = useState([]);

  const [tempRoomMode, setTempRoomMode] = useState(0);

  // 플레이어 핸드에 보이는 데이터
  const [playerHand, setPlayerHand] = useState({
    selectedFoodTag: [],
    selectedMoodTag: [],
    selectedPlace: [
      {
        restId: "10",
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
    ],
  });

  // 조합시 결과를 보여줄 담을 리스트
  const [combineList, setCombineList] = useState([]);

  // 조합 시 유저들이 선택한 레스토랑을 담을 리스트
  const [selectedCombineList, setSelectedCombineList] = useState([]);

  useEffect(() => {
    socket.connect();
    socket.emit("join-room", roomId);
    const local = getLocalStream();
    setLocalStream(local);
    const remote = getRemoteStream();
    setRemoteStream(remote);

    // const parsedCoordinate = JSON.parse(
    //   localStorage.getItem("purposeCoordinate")
    // );

    // const sendData = {
    //   purposeCoordinate: parsedCoordinate,
    // };

    // const getRestList = async (roomId, sendData) => {
    //   // default 재시도는 3
    //   const response = await getRestaurantList(roomId, sendData);

    //   if (response.error) {
    //     console.log(response.exception);
    //     return;
    //   }

    //   // 받아오는 data에 별 및 음식 관련 url 내용 추가
    //   setRestaurantList(response);
    //   console.log(restaurantList);
    // };

    // getRestList(roomId, sendData);
  }, []);

  useEffect(() => {
    console.log("Updated modeOneVoiceRecResult:", modeOneVoiceRecResult);
  }, [modeOneVoiceRecResult]);

  useEffect(() => {
    socket.connect();
    socket.on("mode-change-response", handleModeChange);
    socket.on("receive-speech-foodCategory", handleReceiveFoodCategory);

    // mode 3 식당 조합에서 '선택 완료' 한 경우
    socket.on("combine-response", handleCombineTryResponse);
    socket.on("combine-result", handleCombineResult);

    return () => {
      socket.off("mode-change-response", handleModeChange);
      socket.off("receive-speech-foodCategory", handleReceiveFoodCategory);
      socket.off("combine-response", handleCombineTryResponse);
      socket.off("combine-result", handleCombineResult);
    };
  }, [roomId]);

  const handleReceiveFoodCategory = useCallback((data) => {
    console.log("Received food categories:", data.foodCategories);
    SetModeOneVoiceRecResult(data.foodCategories);
  }, []);

  // 모든 유저가 준비 완료할 경우, 다음 모드로  넘어가는 함수
  const handleModeChange = (data) => {
    console.log("handleModeChange is called, data : ", data);
    const roomMemberCount = JSON.parse(localStorage.getItem("roomMemberCount"));
    setTempRoomMode(data.newMode);

    if (data.roomReadyCount < roomMemberCount) {
      setRoomReadyCount(data.roomReadyCount + 1);
    }
  };

  useEffect(() => {
    const roomMemberCount = JSON.parse(localStorage.getItem("roomMemberCount"));

    if (roomReadyCount >= roomMemberCount) {
      console.log("All players are ready");
      setRoomMode(tempRoomMode);
      setIsReady(false);
      setRoomReadyCount(0);
    }
  }, [roomReadyCount]);

  // const handleReceiveFoodCategory = (data) => {
  //   console.log("handleReceiveFoodCategory is called, data : ", data);
  //   if (length(data.foodCategories) > 0) {
  //     addFoodCategory(data.foodCategories);
  //   } else {
  //     console.log("적절한 음식 카테고리를 찾지 못했습니다.");
  //   }
  // };

  const handleSetReady = () => {
    console.log("handleSetReady is called");
    setIsReady(true);
    setShowVoiceRecorder(false);
    // console.log({ roomId, roomMode, roomReadyCount });
    socket.emit("select-done", { roomId, roomReadyCount, roomMode });
  };

  // 중복되지 않는 데이터만 추가
  // restData 는 배열이 아닌 '요소'만 받는다
  const addUniqueRestaurant = (restData) => {
    // 기존 배열에 동일한 id를 가진 객체가 있는지 확인
    if (!restaurantList.some((item) => item.id === restData.id)) {
      // 중복되지 않는 경우에만 요소를 추가
      setRestaurantList([...restaurantList, restData]);
    }
  };

  // 문자열 배열이므로 이 방식으로 중복을 검사한다
  const addFoodCategory = (foodCategory) => {
    setPlayerHand((prevPlayerHand) => {
      if (Array.isArray(foodCategory)) {
        // foodCategory가 배열인 경우 각 요소를 검사하여 prevPlayerHand에 추가
        return {
          ...prevPlayerHand,
          selectedFoodTag: [
            ...prevPlayerHand.selectedFoodTag,
            ...foodCategory.filter(
              (category) => !prevPlayerHand.selectedFoodTag.includes(category)
            ),
          ],
        };
      } else {
        // foodCategory가 문자열인 경우 단일 요소를 검사하여 prevPlayerHand에 추가
        return {
          ...prevPlayerHand,
          selectedFoodTag: prevPlayerHand.selectedFoodTag.includes(foodCategory)
            ? prevPlayerHand.selectedFoodTag
            : [...prevPlayerHand.selectedFoodTag, foodCategory],
        };
      }
    });
  };

  // 문자열 배열이므로 이 방식으로 중복을 검사한다
  const addMoodKeyword = (moodKeyword) => {
    setPlayerHand((prevPlayerHand) => {
      if (Array.isArray(moodKeyword)) {
        // moodKeyword가 배열인 경우 각 요소를 검사하여 prevPlayerHand에 추가
        return {
          ...prevPlayerHand,
          selectedMoodTag: [
            ...prevPlayerHand.selectedMoodTag,
            ...moodKeyword.filter(
              (keyword) => !prevPlayerHand.selectedMoodTag.includes(keyword)
            ),
          ],
        };
      } else {
        // moodKeyword가 문자열인 경우 단일 요소를 검사하여 prevPlayerHand에 추가
        return {
          ...prevPlayerHand,
          selectedMoodTag: prevPlayerHand.selectedMoodTag.includes(moodKeyword)
            ? prevPlayerHand.selectedMoodTag
            : [...prevPlayerHand.selectedMoodTag, moodKeyword],
        };
      }
    });
  };

  const addSelectedCombineList = (combineData) => {
    // userId가 중복되지 않는 경우에 추가
    if (
      !selectedCombineList.some((item) => item.userId === combineData.userId)
    ) {
      // rest Id는 같아도 된다
      setSelectedCombineList([...selectedCombineList, combineData]);
    }
  };

  // 조합 모달에서 선택 완료 버튼을 눌렀을 때, socket을 emit하는 용도의 함수

  const handleCombineSelectComplete = () => {
    console.log("handleCombineSelectComplete is called");

    const broadCombineDoneData = {
      roomId: roomId,
      combineSelects: selectedCombineList,
    };

    socket.emit("combine-try", broadCombineDoneData);
  };

  const handleCombineTryResponse = (data) => {
    console.log("handleCombineTryResponse is called, data : ", data);
    const roomMemberCount = JSON.parse(localStorage.getItem("roomMemberCount"));

    if (roomMemberCount < data.combineSelects.length) {
      if (data.combineSelects.length > 0) {
        setCombineList(data.combineSelects);
      }
    } else {
      // 모두 선택 완료하였기에 combine-ready를 emit
      const broadCombineReadyData = {
        roomId: roomId,
        combineSelects: selectedCombineList,
      };

      socket.emit("combine-ready", broadCombineReadyData);
    }
  };

  // 조합 결과를 받는 함수 (현재는 아마 5개)
  const handleCombineResult = (data) => {
    console.log("handleCombineResult is called, data : ", data);
    if (data.restaruntList.length > 0) {
      setCombineList(data.restaruntList);
    }
  };

  return (
    <PlayRoomContainer>
      {/* 비디오 */}
      <UserVideoContainer localStream={localStream} remoteStrem={remoteStrem} />

      {/* 스텝바 */}
      <StepperWithContent setRoomMode={setRoomMode} />
      {/* 컨텐츠 시작 */}
      <GameArea>
        {/* 별 */}
        <StarryBackground
          restaurantList={restaurantList}
          resultFoodTags={playerHand.selectedFoodTag}
          resultMoodTags={playerHand.selectedMoodTag}
          resultPlaceTags={playerHand.selectedPlace}
          selectedCombineList={selectedCombineList}
        />
        <PlayerHand handList={playerHand} onSetHandList={setPlayerHand} />

        {roomMode === MODE.MODE1 && (
          <>
            {/* 설명 모달 */}
            {showModal && (
              <ModeOneExpainModal
                onShowModal={setShowModal}
                SetShowVoiceRecorder={setShowVoiceRecorder}
              />
            )}
            {/* 음성 인식 모달 */}
            {showVoiceRecorder && (
              <div className=" absolute top-[15%]">
                <VoiceRecoder
                  onClick={handleSetReady}
                  resultList={modeOneVoiceRecResult}
                  // TEST
                  onSetResult={setPlayerHand}
                />
              </div>
            )}
          </>
        )}
        {roomMode === MODE.MODE2 && (
          <>
            {/* 음성 인식 기능 On */}
            <VoiceRecognition
              onSetResult={addMoodKeyword}
              onAddRest={addUniqueRestaurant}
              selectedFoodCategories={modeOneVoiceRecResult}
              // TEST
              onSetTestResult={setPlayerHand}
            />
          </>
        )}
        {roomMode === MODE.MODE3 && (
          <>
            {/* 조합 모달 */}
            {showModeThreeModal && (
              <ModeThreeModal
                onShow={setShowModeThreeModal}
                onSetSelectedCombineList={addSelectedCombineList}
                onSelectComplete={handleCombineSelectComplete}
              />
            )}
          </>
        )}
        {roomMode === MODE.MODE4 && (
          <>
            {/* 결과창 */}
            {/* <ImageSilderBg /> */}
          </>
        )}
      </GameArea>
    </PlayRoomContainer>
  );
};

export default PlayRoomPage;

const MODE = {
  MODE1: 1,
  MODE2: 2,
  MODE3: 3,
  MODE4: 4,
};
