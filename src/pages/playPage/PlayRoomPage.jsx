import { useCallback, useEffect, useState } from "react";
import VoiceRecoder from "../../components/recorder/VoiceRecoder";
import GameArea from "./GameArea";
import PlayRoomContainer from "./PlayRoomContainer";
import ModeOneExpainModal from "../../components/modal/ModeOneExpainModal";
import { useParams } from "react-router-dom";
import { PlaceListArea } from "./PlaceListArea";
import { Header } from "./Header";
import ModeThreeModal from "../../components/modal/ModeThreeExpainModal";
import VoiceRecognition from "./VoiceRecognition";
import ModeTwoExpainModal from "../../components/modal/ModeTwoExpainModal";
import RightSideUserVideoContainer from "../../components/video/RightSideUserVideoContainer";
import LeftSideUserVideoContainer from "../../components/video/LeftSideUserVideoContainer";
import { getRestaurantList } from "../../api";
import { useSocket } from "../../realtimeComunication/SocketContext";
import Popup from "../../components/modal/Popup";
import Attention from "../../components/modal/Attention";

const PlayRoomPage = ({ roomDetail, setRoomDetail, localStream }) => {
  const socket = useSocket();
  const { roomId } = useParams();
  const [showModal, setShowModal] = useState(true);
  const [showModeTwoModal, setShowModeTwoModal] = useState(true);
  const [showModeThreeModal, setShowModeThreeModal] = useState(true);
  const [roomMode, setRoomMode] = useState(MODE.MODE1);
  const [restaurantList, setRestaurantList] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [roomReadyCount, setRoomReadyCount] = useState(0);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showModeTwoVoiceRecorder, setModeTwoShowVoiceRecorder] =
    useState(false);
  const [modeOneVoiceRecResult, SetModeOneVoiceRecResult] = useState([]);
  const [modeTwoVoiceRecResult, SetModeTwoVoiceRecResult] = useState([]);
  const [popupMessage, setPopupMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isAttention, setIsAttention] = useState(false);

  console.log(roomDetail);
  const [playerHand, setPlayerHand] = useState({
    selectedFoodTag: [],
    selectedMoodTag: [],
    selectedPlace: [],
  });
  const [allUserPlayerHand, setAllUserPlayerHand] = useState({
    selectedFoodTag: [], //
    selectedMoodTag: [],
    selectedPlace: [],
    finalPlace: [],
  });
  const [imgUrlList, setImgUrlList] = useState([]);

  useEffect(() => {
    if (!socket) return;
    socket.on("select-restaurant", handleAddSelectedRestaurant);
    socket.on("select-foodCategories", handleAddSelectedFoodCategories);
    socket.on("mode-change-response", handleModeChange);
    socket.on("receive-speech-foodCategory", handleReceiveFoodCategory);
    socket.on("right-sidebar-action", handleRightSideAction);
    return () => {
      socket.off("select-restaurant", handleAddSelectedRestaurant);
      socket.off("select-foodCategories", handleAddSelectedFoodCategories);
      socket.off("mode-change-response", handleModeChange);
      socket.off("receive-speech-foodCategory", handleReceiveFoodCategory);
    };
  }, [socket]);

  useEffect(() => {
    const coordinate = {
      coordinates: [37.5001716373021, 127.029070884291],
    };
    console.log(coordinate);
    const getRestList = async (roomId, coordinates) => {
      const response = await getRestaurantList(roomId, coordinates);

      if (response.error) {
        console.log(response.exception);
        return;
      }
      setRestaurantList(response.data.restaurantList);
      setImgUrlList(response.data.imgUrls);
    };

    getRestList(roomId, coordinate);
  }, []);

  const handleAddSelectedRestaurant = useCallback((selectedRestaurant) => {
    console.log("select-restaurant", selectedRestaurant);
    setAllUserPlayerHand((prevAllUserHand) => {
      const updatedHand = {
        ...prevAllUserHand,
        selectedPlace: [...prevAllUserHand.selectedPlace, selectedRestaurant],
      };

      return updatedHand;
    });
  }, []);

  const handleRightSideAction = useCallback((data) => {
    console.log("handleRightSideAction", data);
    const popupContent = data;

    if (data.action === "잠깐 주목🗣️") {
      console.log("잠깐 주목🗣️");
      setIsAttention(true);
    } else {
      if (popupContent) {
        setPopupMessage(popupContent);
        setShowPopup(true);
      }
    }
  }, []);

  const handleAddSelectedFoodCategories = useCallback((data) => {
    console.log("select-foodCategories", data);
    setAllUserPlayerHand((prevAllUserHand) => {
      const updatedHand = {
        ...prevAllUserHand,
        selectedFoodTag: [...prevAllUserHand.selectedFoodTag, ...data],
      };

      return updatedHand;
    });
  }, []);

  const handleReceiveFoodCategory = useCallback((data) => {
    console.log("Received food categories:", data);
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

  const handleShowVoiceRecorder = () => {
    if (roomMode == 1) {
      setShowVoiceRecorder(false);
    }
    if (roomMode == 2) {
      setModeTwoShowVoiceRecorder(false);
    }
  };

  const handleupdateFinalPlace = (restaurant) => {
    setAllUserPlayerHand((prev) => ({
      ...prev,
      finalPlace: [...prev.finalPlace, restaurant],
    }));
  };

  return (
    <PlayRoomContainer>
      {/* 스텝바 */}
      <Header roomMode={roomMode} />
      {showPopup && (
        <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
      {isAttention && <Attention onClose={() => setIsAttention(false)} />}
      {/* 컨텐츠 시작 */}
      <GameArea>
        {/* 별 */}
        <LeftSideUserVideoContainer
          playerHand={playerHand}
          localStream={localStream}
          remoteStrem={roomDetail.userStreams}
          showMic={showModeTwoVoiceRecorder}
          roomDetail={roomDetail}
        />

        <PlaceListArea
          restaurantList={restaurantList}
          allUserSelectedFoodTags={allUserPlayerHand.selectedFoodTag}
          allUserSelectedMoodTags={allUserPlayerHand.selectedMoodTag}
          allUserSelectedPlaceTags={allUserPlayerHand.selectedPlace}
          allUserPlayerHand={allUserPlayerHand}
          setAllUserPlayerHand={setAllUserPlayerHand}
          playerHand={playerHand}
          setPlayerHand={setPlayerHand}
          roomMode={roomMode}
          setRoomMode={setRoomMode}
          handleSetReady={handleSetReady}
          roomDetail={roomDetail}
          imgUrls={imgUrlList}
          modeTwoResultRestList={modeTwoVoiceRecResult}
          handleupdateFinalPlace={handleupdateFinalPlace}
        />
        <RightSideUserVideoContainer
          localStream={localStream}
          remoteStrem={roomDetail.userStreams}
          roomDetail={roomDetail}
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
                onSetResult={setPlayerHand}
                onSetAllUserPlayerHand={setAllUserPlayerHand}
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
                onSetResultRestaurant={SetModeTwoVoiceRecResult}
                userSelectedFoodCategories={playerHand.selectedFoodTag}
                onSetPlayerResult={setPlayerHand}
                onSetAllUserPlayerHand={setAllUserPlayerHand}
              />
            )}
          </>
        )}
        {roomMode === MODE.MODE3 && (
          <>
            {/* 조합 모달 */}
            {showModeThreeModal && (
              <ModeThreeModal onShow={setShowModeThreeModal} />
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
