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

const MODE = {
  MODE1: "MODE_NUMBER_ONE",
  MODE2: "MODE_NUMBER_TWO",
  MODE3: "MODE_NUMBER_THREE",
  MODE4: "MODE_NUMBER_FOUR",
};

const PlayRoomPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSelectDone, setIsSelectDone] = useState(false);
  const [roomMode, setRoomMode] = useState(MODE.MODE1);
  console.log(roomMode);

  const handleSelectionDone = () => {
    if (roomMode === MODE.MODE1) {
      setRoomMode(MODE.MODE2);
    }
    if (roomMode === MODE.MODE2) {
      setRoomMode(MODE.MODE3);
    }

    if (roomMode === MODE.MODE3) {
      setRoomMode(MODE.MODE4);
    }

    if (roomMode === MODE.MODE4) {
      setRoomMode(MODE.MODE5);
    }
  };

  return (
    <PlayRoomContainer>
      <div className="mt-5 flex flex-col justify-center items-center border shadow-lg rounded-xl w-2/3 mx-auto">
        <div className=" rounded-full absolute bottom-[40%] -right-5 z-10">
          <VideoContainer />
        </div>
        <div className=" rounded-full absolute bottom-[40%] -left-5 z-10">
          <VideoContainer />
        </div>
        <h1 className="font-bold text-2xl py-2 text-center">
          오늘은 어떤 음식을 먹고 싶으세요?
        </h1>
        <ModeSetButton setRoomMode={setRoomMode} />
      </div>
      {roomMode === MODE.MODE1 && (
        <GameArea>
          <div className="text-center">
            {!showModal ? (
              <ModeOneExpainModal
                isShowModal={showModal}
                onShow={setShowModal}
              />
            ) : (
              <div className="w-full flex flex-col">
                <div className="flex gap-5">
                  <VoiceRecoder />
                  <VoiceRecoder />
                </div>
              </div>
            )}
          </div>
          <PlayerHand
            cards={[
              { suit: "hearts", rank: "A" },
              { suit: "hearts", rank: "8" },
            ]}
            playerName="마찬옥 님"
            avatarUrl="./avatar.png" // Replace with the actual path to John's avatar
          />
        </GameArea>
      )}
      {roomMode === MODE.MODE2 && (
        <GameArea>
          <RandomPlaceTags />
          <PlayerHand
            cards={[
              { suit: "hearts", rank: "A" },
              { suit: "hearts", rank: "8" },
            ]}
            playerName="마찬옥 님"
            playerScore={[6, 6]}
            avatarUrl="./avatar.png" // Replace with the actual path to John's avatar
          />
        </GameArea>
      )}
      {roomMode === MODE.MODE3 && (
        <GameArea>
          <PlaceCombineArea />
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

export default PlayRoomPage;
