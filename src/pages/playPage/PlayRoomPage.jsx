import { useState } from "react";
import VideoContainer from "../../components/video/VideoContainer";
import FoodTagVoiceRecoder from "../../components/modal/FoodTagVoiceRecoder";
import VoiceRecoder from "../../components/recorder/VoiceRecoder";
import ModeSetButton from "../../components/button/ModeSetButton";
import RandomPlaceTags from "./modeTwo/RandomPlaceTags";
import PlaceCombineArea from "./modeThree/card/PlaceCombineArea";
import ImageSilderBg from "./modeFour/ImageSilderBg";

const MODE = {
  MODE1: "MODE_NUMBER_ONE",
  MODE2: "MODE_NUMBER_TWO",
  MODE3: "MODE_NUMBER_THREE",
  MODE4: "MODE_NUMBER_FOUR",
};

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
    <div className=" min-h-screen text-gray-900 flex justify-center">
      <div className="m-12 max-w-screen-xl sm-m-10 bg-white shadow-lg sm:rounded-lg flex justify-center flex-1 animate-fade-up">
        <div className="flex flex-col w-full h-full p-6 sm:p-12 m-auto">
          <div className="mt-5 flex flex-col justify-center items-center border shadow-xl rounded-md">
            <h1 className="font-bold text-2xl w-2/3 py-2 text-center">
              5초 동안 먹고 싶은 음식을 말해주세요.
            </h1>
            <ModeSetButton setRoomMode={setRoomMode} />
          </div>
          {roomMode === MODE.MODE1 && (
            <div className="mt-5 w-full h-full flex flex-col justify-center items-center border shadow-xl rounded-md">
              {!isFoodTagRecording ? (
                <FoodTagVoiceRecoder
                  onRecord={setIsFoodTagRecording}
                  isRecording={isFoodTagRecording}
                />
              ) : (
                <div className="flex flex-col">
                  <div className="flex gap-5">
                    <VoiceRecoder />
                    <VoiceRecoder />
                  </div>
                  <div className="flex justify-center">
                    <button className="p-2 m-3 w-32 bg-green-400 shadow-xl rounded-2xl hover:scale-105 transition-all">
                      선택 완료
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {roomMode === MODE.MODE2 && (
            <div className="mt-5 w-full h-full flex flex-col justify-center items-center border shadow-xl rounded-md">
              <RandomPlaceTags />
            </div>
          )}
          {roomMode === MODE.MODE3 && (
            <div className="mt-5 w-full h-full flex flex-col justify-center items-center border shadow-xl rounded-md">
              <PlaceCombineArea />
            </div>
          )}
          {roomMode === MODE.MODE4 && (
            <div className="mt-5 w-full h-full flex flex-col justify-center items-center border shadow-xl rounded-md">
              <ImageSilderBg />
            </div>
          )}
        </div>
      </div>

      <VideoContainer />
    </div>
  );
};

export default PlayRoomPage;
