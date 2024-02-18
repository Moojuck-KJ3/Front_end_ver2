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

const PlayRoomPage = ({ roomDetail, setRoomDetail, localStream }) => {
  const socket = useSocket();
  const { roomId } = useParams();
  const [showModal, setShowModal] = useState(true);
  const [showModeTwoModal, setShowModeTwoModal] = useState(true);
  const [showModeThreeModal, setShowModeThreeModal] = useState(true);
  const [roomMode, setRoomMode] = useState(MODE.MODE1);
  const [restaurantList, setRestaurantList] = useState([]);
  const [roomReadyCount, setRoomReadyCount] = useState(0);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showModeTwoVoiceRecorder, setModeTwoShowVoiceRecorder] =
    useState(false);
  const [modeOneVoiceRecResult, SetModeOneVoiceRecResult] = useState([]);
  const [modeTwoVoiceRecResult, SetModeTwoVoiceRecResult] = useState([]);
  const [popupMessage, setPopupMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [readyUserId, setReadyUserId] = useState(null);
  const [highlightedStreamId, setHighlightedStreamId] = useState(null);
  const userStreamsWithPlayerId = roomDetail.userStreams.map((stream) => {
    const playerInfo = roomDetail.playerInfo.find(
      (info) => info.socketId === stream.socketId
    );
    return {
      ...stream,
      playerId: playerInfo ? playerInfo.playerId : null,
    };
  });
  userStreamsWithPlayerId.sort((a, b) => a.playerId - b.playerId);

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

    socket.on("remove-selected-place", handleRemoveSelectedRestaurant);
    socket.on("select-restaurant", handleAddSelectedRestaurant);
    socket.on("select-foodCategories", handleAddSelectedFoodCategories);
    socket.on("mode-change-response", handleModeChange);
    socket.on("receive-speech-foodCategory", handleReceiveFoodCategory);
    socket.on("right-sidebar-action", handleRightSideAction);
    return () => {
      socket.off("remove-selected-place", handleRemoveSelectedRestaurant);
      socket.off("select-restaurant", handleAddSelectedRestaurant);
      socket.off("select-foodCategories", handleAddSelectedFoodCategories);
      socket.off("mode-change-response", handleModeChange);
      socket.off("receive-speech-foodCategory", handleReceiveFoodCategory);
    };
  }, [socket]);

  useEffect(() => {
    const getRestList = async (roomId) => {
      const response = await getRestaurantList(roomId);

      if (response.error) {
        console.log(response.exception);
        return;
      }
      setRestaurantList(response.data.restaurantList);
      setImgUrlList(response.data.imgUrls);
    };

    getRestList(roomId);
  }, []);

  const handleAddSelectedRestaurant = useCallback((selectedRestaurant) => {
    setAllUserPlayerHand((prevAllUserHand) => {
      const updatedHand = {
        ...prevAllUserHand,
        selectedPlace: [...prevAllUserHand.selectedPlace, selectedRestaurant],
      };

      return updatedHand;
    });
  }, []);

  const handleRemoveSelectedRestaurant = useCallback(
    ({ restaurantToRemoveId }) => {
      setAllUserPlayerHand((prevState) => ({
        ...prevState,
        selectedPlace: prevState.selectedPlace.filter(
          (restaurant) => restaurant._id !== restaurantToRemoveId
        ),
      }));
    },
    []
  );

  const handleRightSideAction = useCallback((data) => {
    console.log("handleRightSideAction", data);
    const popupContent = data;

    if (data.action === "잠깐 주목🗣️") {
      setHighlightedStreamId(data.socketId);
      console.log("highlightedStreamId", data.socketId);
      setTimeout(() => setHighlightedStreamId(null), 8000);
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
      setReadyUserId(data.socketId);
      setRoomReadyCount(data.roomReadyCount);
    } else if (data.roomReadyCount >= roomMemberCount) {
      setRoomMode(data.newMode);
      setReadyUserId(null);
      setRoomReadyCount(0);
    }
  };
  const handleSetReady = () => {
    console.log("handleSetReady is called");
    handleShowVoiceRecorder();
    const updatedRoomReadyCount = roomReadyCount + 1;
    setRoomReadyCount(updatedRoomReadyCount);

    socket.emit("select-done", {
      roomId,
      socketId: socket.id,
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
  const isVideoHighlighted = () => {
    return highlightedStreamId != null;
  };

  return (
    <PlayRoomContainer>
      {/* 스텝바 */}
      {isVideoHighlighted() && (
        <div className="absolute inset-0 bg-black bg-opacity-70 z-10 animate-fade-up" />
      )}
      <Header roomMode={roomMode} />
      {showPopup && (
        <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
      {/* 컨텐츠 시작 */}
      <GameArea>
        {/* 별 */}
        <LeftSideUserVideoContainer
          playerHand={playerHand}
          setPlayerHand={setPlayerHand}
          localStream={localStream}
          remoteStrem={userStreamsWithPlayerId}
          roomDetail={roomDetail}
          highlightedStreamId={highlightedStreamId}
          readyUserId={readyUserId}
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
          remoteStrem={userStreamsWithPlayerId}
          roomDetail={roomDetail}
          highlightedStreamId={highlightedStreamId}
          readyUserId={readyUserId}
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
