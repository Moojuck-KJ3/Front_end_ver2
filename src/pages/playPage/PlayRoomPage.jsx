import { useState } from "react";
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
  useChatConnection,
  usePeerConnection,
} from "../../realtimeComunication/webRTCManager";

const PlayRoomPage = ({ localStream }) => {
  const [showModal, setShowModal] = useState(false);
  const [roomMode, setRoomMode] = useState(MODE.MODE1);
  const [modeThreeContent, setModeThreeContent] = useState(
    MODEThree_Content.Content1
  );
  const { guestStream } = usePeerConnection(localStream);

  const lg = getLocalStream();
  const rg = getRemoteStream();

  console.log("PlayRoomPage");
  console.log(lg);
  console.log(rg);

  const [playerHand, setPlayerHand] = useState({
    foodTag: ["ex : 일식", "중식", "한식"],
    placeTag: ["분위기 좋은", "운치있는", "조용한"],
    selectedTag: [],
  });

  const handleChangeContent = (contentNum) => {
    console.log(contentNum);
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
      <div className="mt-5 flex flex-col justify-center items-center border shadow-lg rounded-xl w-2/3 mx-auto">
        <div className=" rounded-full absolute bottom-[40%] -left-5 z-10">
          <VideoContainer mediaStream={localStream} />
        </div>
        <div className=" rounded-full absolute bottom-[40%] -right-5 z-10">
          <VideoContainer mediaStream={guestStream} />
        </div>
        <h1 className="font-bold text-2xl py-2 text-center">
          오늘은 어떤 음식을 먹고 싶으세요?
        </h1>
        <ModeSetButton setRoomMode={setRoomMode} />
      </div>
      {roomMode === MODE.MODE1 && (
        <GameArea>
          {/* 설명 모달 */}
          <div className="text-center">
            {!showModal ? (
              <ModeOneExpainModal
                isShowModal={showModal}
                onShow={setShowModal}
              />
            ) : (
              <div className="w-full flex flex-col">
                {/* 컨텐츠 */}
                <div className="flex gap-5">
                  <VoiceRecoder />
                  <VoiceRecoder />
                </div>
              </div>
            )}
          </div>

          {/* 플레이어 핸드 */}
          <PlayerHand
            Hands={playerHand}
            playerName="마찬옥님"
            avatarUrl="./avatar.png" // Replace with the actual path to John's avatar
          />
        </GameArea>
      )}
      {roomMode === MODE.MODE2 && (
        <GameArea>
          {/* 컨텐츠 */}
          <RandomPlaceTags
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
  MODE1: "MODE_NUMBER_ONE",
  MODE2: "MODE_NUMBER_TWO",
  MODE3: "MODE_NUMBER_THREE",
  MODE4: "MODE_NUMBER_FOUR",
};

const MODEThree_Content = {
  Content1: 1,
  Content2: 2,
  Content3: 3,
};

export default PlayRoomPage;
