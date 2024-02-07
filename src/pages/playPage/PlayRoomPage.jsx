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
import { getMoodKeyword } from "../../api";
import { useParams } from "react-router-dom";
import socket from "../../realtimeComunication/socket";
import { StarryBackground } from "./StarryBackground";

const PlayRoomPage = () => {
  const { roomId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [roomMode, setRoomMode] = useState(MODE.MODE1);
  const [modeThreeContent, setModeThreeContent] = useState(
    MODEThree_Content.Content1
  );
  const [localStream, setLocalStream] = useState(null);
  const [remoteStrem, setRemoteStream] = useState(null);
  const [tags, setTags] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [roomReadyCount, setRoomReadyCount] = useState(0);

  useEffect(() => {
    const local = getLocalStream();
    setLocalStream(local);
    const remote = getRemoteStream();
    setRemoteStream(remote);

    const getMoodKeywords = async (roomId) => {
      const response = await getMoodKeyword(roomId);

      if (response.error) {
        console.log(response.exception);
      } else {
        setTags(response.moodKeywords);
      }
    };

    getMoodKeywords(roomId);
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
    console.log({ roomId, roomMode, roomReadyCount });
    socket.emit("select-done", { roomId, roomReadyCount, roomMode });
  };

  const [playerHand, setPlayerHand] = useState({
    foodTag: ["ex : 일식", "중식", "한식"],
    placeTag: ["조용한"],
    selectedTag: [],
  });

  const handleChangeContent = (contentNum) => {
    switch (contentNum) {
      case MODEThree_Content.Content1:
        return setModeThreeContent(1);

      case MODEThree_Content.Content2:
        return setModeThreeContent(2);

      case MODEThree_Content.Content3:
        return setModeThreeContent(3);
    }
  };

  const updatePlayerHand = (cardType, cardValue) => {
    console.log(cardValue);
    setPlayerHand((prevHand) => {
      // Copy previous state to avoid direct mutation
      const newHand = { ...prevHand };

      // Determine the action based on the mode and card type
      switch (cardType) {
        case "foodTag":
          newHand.foodTag.push(cardValue);
          break;
        case "placeTag":
          newHand.placeTag.push(cardValue);
          break;
        case "selectedTag":
          newHand.selectedTag.push(cardValue);
          break;
        default:
          break;
      }

      return newHand;
    });
  };

  return (
    <PlayRoomContainer>
      <div className="mt-5 bg-white flex flex-col justify-center items-center border-8 shadow-inner font-tenada rounded-xl w-2/3 mx-auto">
        <div className=" rounded-full absolute bottom-5 -left-10 z-10">
          {isReady && <div className="bg-white">나 준비 완료~</div>}
          <button
            onClick={handleSetReady}
            className="bg-blue-300 p-2 rounded-lg"
          >
            선택완료
          </button>
          <VideoContainer mediaStream={localStream} />
        </div>
        <div className=" rounded-full absolute bottom-5 -right-10 z-10">
          <VideoContainer mediaStream={remoteStrem} />
        </div>
        <div className=" rounded-full absolute top-5 -right-10 z-10">
          <img
            className=" w-40 h-40 items-center border-4 bg-gray-300 border-white
            shadow-2xl rounded-full object-cover"
            src="/현재훈_profile.jpg"
            alt=""
          />
        </div>
        <div className=" rounded-full absolute top-5 -left-10 z-10">
          <img
            className=" w-40 h-40 items-center border-4 bg-gray-300 border-white
            shadow-2xl rounded-full object-cover"
            src="/이서연_profile.png"
            alt=""
          />
        </div>
        <h1 className="font-bold text-2xl py-2 text-center">
          오늘은 어떤 음식을 먹고 싶으세요?
        </h1>
        <ModeSetButton setRoomMode={setRoomMode} />
      </div>
      {roomMode === MODE.MODE1 && (
        <GameArea>
          <StarryBackground />
          {!showModal ? (
            <ModeOneExpainModal isShowModal={showModal} onShow={setShowModal} />
          ) : (
            <div className=" absolute top-[25%] left-[25%] flex flex-col">
              {/* 컨텐츠 */}
              <div className="flex gap-5">
                {/* 좌측이 나 */}
                <VoiceRecoder isOwner={true} playerHand={playerHand} />
                {/* 우측이 다른 user */}
                <VoiceRecoder isOwner={false} playerHand={playerHand} />
              </div>
            </div>
          )}

          <PlayerHand
            Hands={playerHand}
            playerName="마찬옥님"
            avatarUrl="./avatar.png"
          />
        </GameArea>
      )}
      {roomMode === MODE.MODE2 && (
        <GameArea>
          {/* 컨텐츠 */}
          <RandomPlaceTags
            tags={tags}
            onCardClick={(cardType, cardValue) =>
              updatePlayerHand(cardType, cardValue)
            }
          />

          {/* 플레이어 핸드 */}
          <PlayerHand
            Hands={playerHand}
            playerName="마찬옥님"
            avatarUrl="./avatar.png" // Replace with the actual path to John's avatar
          />
        </GameArea>
      )}
      {roomMode === MODE.MODE3 && (
        <GameArea>
          {/* 버튼 */}
          <SelectModeButtons onClick={handleChangeContent} />

          {/* 컨텐츠 */}
          <div className="w-3/4 flex border-1 shadow-md rounded-lg mx-10 bg-white justify-center ">
            <div className="w-full bg-gray-100 m-3 rounded-md shadow-md justify-center items-center flex ">
              <PlaceCombineArea
                contentNumber={modeThreeContent}
                onCardClick={(cardType, cardValue) =>
                  updatePlayerHand(cardType, cardValue)
                }
              />
            </div>
          </div>
          {/* 플레이어 핸드 */}
          <PlayerHand
            Hands={playerHand}
            playerName="마찬옥님"
            avatarUrl="./avatar.png" // Replace with the actual path to John's avatar
          />
        </GameArea>
      )}
      {roomMode === MODE.MODE4 && (
        <GameArea>
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

const MODEThree_Content = {
  Content1: 1,
  Content2: 2,
  Content3: 3,
};

export default PlayRoomPage;
