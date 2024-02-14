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

  const [playerHand, setPlayerHand] = useState({
    selectedFoodTag: ["일식"], //"한식"
    selectedMoodTag: ["분위기 좋은"],
    selectedPlace: [],
  });
  const [allUserPlayerHand, setAllUserPlayerHand] = useState({
    selectedFoodTag: [], //"한식", "중식", "일식", "이탈리안"
    selectedMoodTag: ["조용한"],
    selectedPlace: [
      {
        address: "서울 강남구 논현로76길 6 노마빌딩 1층",
        food_category: "일식",
        images: [
          "https://ldb-phinf.pstatic.net/20211231_39/1640950618449LAgdc_PNG/KakaoTalk_20211231_202328098_05.png",
        ],
        isDelivery: false,
        isTakeOut: null,
        name: "김영태스시&사시미마을 강남본점",
        options: "단체 이용 가능,예약,포장,남/녀 화장실 구분",
        phone_number: "02-554-7002",
        rating: "4.22",
        ratingCount: "196",
        thumbnailImg:
          "https://ldb-phinf.pstatic.net/20211231_39/1640950618449LAgdc_PNG/KakaoTalk_20211231_202328098_05.png",
        _id: "65ad3daf5a419523bb358628",
      },
    ],
    finalPlace: [
      {
        address: "서울 강남구 논현로76길 6 노마빌딩 1층",
        food_category: "일식",
        images: [
          "https://ldb-phinf.pstatic.net/20211231_39/1640950618449LAgdc_PNG/KakaoTalk_20211231_202328098_05.png",
        ],
        isDelivery: false,
        isTakeOut: null,
        name: "김영태스시&사시미마을 강남본점",
        options: "단체 이용 가능,예약,포장,남/녀 화장실 구분",
        phone_number: "02-554-7002",
        rating: "4.22",
        ratingCount: "196",
        thumbnailImg:
          "https://ldb-phinf.pstatic.net/20211231_39/1640950618449LAgdc_PNG/KakaoTalk_20211231_202328098_05.png",
        _id: "65ad3daf5a419523bb358628",
      },
    ],
  });
  const [imgUrlList, setImgUrlList] = useState([]);

  useEffect(() => {
    if (!socket) return;
    socket.on("select-restaurant", handleAddSelectedRestaurant);
    socket.on("select-foodCategories", handleAddSelectedFoodCategories);
    socket.on("mode-change-response", handleModeChange);
    socket.on("receive-speech-foodCategory", handleReceiveFoodCategory);

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

  const handleAddSelectedFoodCategories = useCallback((resultList) => {
    console.log("select-foodCategories", resultList);
    setAllUserPlayerHand((prevAllUserHand) => {
      const updatedHand = {
        ...prevAllUserHand,
        selectedPlace: [...prevAllUserHand.selectedPlace, ...resultList],
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

  return (
    <PlayRoomContainer>
      {/* 스텝바 */}
      <Header roomMode={roomMode} />

      {/* 컨텐츠 시작 */}
      <GameArea>
        {/* 별 */}
        <LeftSideUserVideoContainer
          playerHand={playerHand}
          localStream={localStream}
          remoteStrem={roomDetail.userStreams}
          showMic={showModeTwoVoiceRecorder}
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
        />
        <RightSideUserVideoContainer
          // localStream={localStream}
          remoteStrem={roomDetail.userStreams}
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
