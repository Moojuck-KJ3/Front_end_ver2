import { useState } from "react";
import VideoContainer from "../../components/video/VideoContainer";
import FoodTagVoiceRecoder from "../../components/modal/FoodTagVoiceRecoder";
import VoiceRecoder from "../../components/recorder/VoiceRecoder";
import ModeSetButton from "../../components/button/ModeSetButton";
import RandomPlaceTags from "./modeTwo/RandomPlaceTags";
import PlaceCombineArea from "./modeThree/card/PlaceCombineArea";
import ImageSilderBg from "./modeFour/ImageSilderBg";
import GameArea from "./GameArea";
import PlayerHand from "./PlayerHand";
import Card from "./Card";
import PlayRoomContainer from "./PlayRoomContainer";

const MODE = {
  MODE1: "MODE_NUMBER_ONE",
  MODE2: "MODE_NUMBER_TWO",
  MODE3: "MODE_NUMBER_THREE",
  MODE4: "MODE_NUMBER_FOUR",
};

const playerCards = ["A", "8", "7", "A"];

const PlayRoomPage = () => {
  const [isFoodTagRecording, setIsFoodTagRecording] = useState(false);
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
      <div className="mt-5 flex flex-col justify-center items-center border shadow-xl rounded-xl">
        <h1 className="font-bold text-2xl w-2/3 py-2 text-center">
          오늘은 어떤 음식을 먹고 싶으세요?
        </h1>
        <ModeSetButton setRoomMode={setRoomMode} />
      </div>
      {roomMode === MODE.MODE1 && (
        <GameArea>
          <div className=" absolute -right-16">
            <VideoContainer />
          </div>
          <div className="absolute -left-16 ">
            <VideoContainer />
          </div>
          <PlayerHand
            cards={[
              { suit: "hearts", rank: "A" },
              { suit: "hearts", rank: "8" },
            ]}
            playerName="마찬옥 님"
            playerScore={[6, 6]}
            avatarUrl="./avatar.png" // Replace with the actual path to John's avatar
          />
          <div className="text-center">
            {!isFoodTagRecording ? (
              <FoodTagVoiceRecoder
                onRecord={setIsFoodTagRecording}
                isRecording={isFoodTagRecording}
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
        </GameArea>
      )}
      {roomMode === MODE.MODE2 && (
        <GameArea>
          <RandomPlaceTags />
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
