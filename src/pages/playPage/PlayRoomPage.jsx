import { useCallback, useEffect, useState } from "react";
import VoiceRecoder from "../../components/recorder/VoiceRecoder";
import GameArea from "./GameArea";
import PlayRoomContainer from "./PlayRoomContainer";
import ModeOneExpainModal from "../../components/modal/ModeOneExpainModal";

import { useParams } from "react-router-dom";
import socket from "../../realtimeComunication/socket";
import { PlaceListArea } from "./PlaceListArea";
import { restaurantLists } from "./restaurantLists";
import { Header } from "./Header";
import ModeThreeModal from "../../components/modal/ModeThreeExpainModal";
import UserVideoContainer from "../../components/video/UserVideoContainer";
import VoiceRecognition from "./VoiceRecognition";
import ModeTwoExpainModal from "../../components/modal/ModeTwoExpainModal";
import RightSideUserVideoContainer from "../../components/video/RightSideUserVideoContainer";

const PlayRoomPage = ({ roomDetail, setRoomDetail, localStream }) => {
  const { roomId } = useParams();
  const [showModal, setShowModal] = useState(true);
  const [showModeTwoModal, setShowModeTwoModal] = useState(true);
  const [showModeThreeModal, setShowModeThreeModal] = useState(true);
  const [roomMode, setRoomMode] = useState(MODE.MODE1);
  const [restaurantList, setRestaurantList] = useState(restaurantLists);
  const [isReady, setIsReady] = useState(false);
  const [roomReadyCount, setRoomReadyCount] = useState(0);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showModeTwoVoiceRecorder, setModeTwoShowVoiceRecorder] =
    useState(false);
  const [modeOneVoiceRecResult, SetModeOneVoiceRecResult] = useState([]);
  const [modeTwoVoiceRecResult, SetModeTwoVoiceRecResult] = useState([]);
  const [playerHand, setPlayerHand] = useState({
    selectedFoodTag: [],
    selectedMoodTag: [],
    selectedPlace: [],
  });
  const [combineResultList, setCombineResultList] = useState([]);

  // 조합 시 유저들이 선택한 레스토랑을 담을 리스트
  const [userSelectedCombineList, setUserSelectedCombineList] = useState([]);

  useEffect(() => {
    socket.connect();
    // const local = getLocalStream();
    // setLocalStream(local);
    // const remote = getRemoteStream();
    // setRemoteStream(remote);

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
    socket.connect();
    socket.on("mode-change-response", handleModeChange);
    socket.on("receive-speech-foodCategory", handleReceiveFoodCategory);
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

  const handleModeChange = (data) => {
    console.log("handleModeChange is called, data : ", data);
    const roomMemberCount = roomDetail.roomMemberCount;

    if (data.roomReadyCount < roomMemberCount) {
      setRoomReadyCount(data.roomReadyCount);
    } else if (data.roomReadyCount >= roomMemberCount) {
      setRoomMode(data.newMode);
      setIsReady(false);
      setRoomReadyCount(0);
    }
  };
  const handleSetReady = () => {
    console.log("handleSetReady is called");
    handleShowVoiceRecorder();
    setIsReady(true);
    const updatedRoomReadyCount = roomReadyCount + 1;
    setRoomReadyCount(updatedRoomReadyCount);

    socket.emit("select-done", {
      roomId,
      roomReadyCount: updatedRoomReadyCount,
      roomMode,
    });
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
      !userSelectedCombineList.some(
        (item) => item.userId === combineData.userId
      )
    ) {
      // rest Id는 같아도 된다
      setUserSelectedCombineList([...userSelectedCombineList, combineData]);
    }
  };

  // 조합 모달에서 선택 완료 버튼을 눌렀을 때, socket을 emit하는 용도의 함수
  const handleCombineSelectComplete = () => {
    console.log("handleCombineSelectComplete is called");

    const broadCombineDoneData = {
      roomId: roomId,
      combineSelects: userSelectedCombineList,
    };

    socket.emit("combine-try", broadCombineDoneData);
  };

  const handleCombineTryResponse = (data) => {
    console.log("handleCombineTryResponse is called, data : ", data);
    const roomMemberCount = JSON.parse(localStorage.getItem("roomMemberCount"));

    if (roomMemberCount < data.combineSelects.length) {
      if (data.combineSelects.length > 0) {
        setCombineResultList(data.combineSelects);
      }
    } else {
      // 모두 선택 완료하였기에 combine-ready를 emit
      const broadCombineReadyData = {
        roomId: roomId,
        combineSelects: userSelectedCombineList,
      };

      socket.emit("combine-ready", broadCombineReadyData);
    }
  };

  // 조합 결과를 받는 함수 (현재는 아마 5개)
  const handleCombineResult = (data) => {
    console.log("handleCombineResult is called, data : ", data);
    if (data.restaruntList.length > 0) {
      setCombineResultList(data.restaruntList);
    }
  };

  const handleShowVoiceRecorder = () => {
    if (roomMode == 1) {
      setShowVoiceRecorder(false);
    }
    if (roomMode == 2) {
      setModeTwoShowVoiceRecorder(false);
    }
  };
  return (
    <PlayRoomContainer>
      {/* 스텝바 */}
      <Header roomMode={roomMode} />

      {/* 컨텐츠 시작 */}
      <GameArea>
        {/* 별 */}
        <UserVideoContainer
          localStream={localStream}
          // remoteStrem={remoteStrem}
          showMic={showModeTwoVoiceRecorder}
        />

        <PlaceListArea
          restaurantList={restaurantList}
          resultFoodTags={playerHand.selectedFoodTag}
          resultMoodTags={playerHand.selectedMoodTag}
          resultPlaceTags={playerHand.selectedPlace}
          selectedCombineList={userSelectedCombineList}
          playerHand={playerHand}
          setPlayerHand={setPlayerHand}
          roomMode={roomMode}
          setRoomMode={setRoomMode}
          handleSetReady={handleSetReady}
          roomDetail={roomDetail}
        />
        <RightSideUserVideoContainer
          localStream={localStream}
          // remoteStrem={remoteStrem}
          showMic={showModeTwoVoiceRecorder}
          onReady={handleSetReady}
        />

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
              <VoiceRecoder
                onClick={handleShowVoiceRecorder}
                resultList={modeOneVoiceRecResult}
                // TEST
                onSetResult={setPlayerHand}
              />
            )}
          </>
        )}
        {roomMode === MODE.MODE2 && (
          <>
            {showModeTwoModal && (
              <ModeTwoExpainModal
                onShowModal={setShowModeTwoModal}
                SetShowVoiceRecorder={setModeTwoShowVoiceRecorder}
              />
            )}
            {showModeTwoVoiceRecorder && (
              <VoiceRecognition
                onSetResult={addMoodKeyword}
                onAddRest={addUniqueRestaurant}
                selectedFoodCategories={modeOneVoiceRecResult}
                // TEST
                onSetTestResult={setPlayerHand}
              />
            )}
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
