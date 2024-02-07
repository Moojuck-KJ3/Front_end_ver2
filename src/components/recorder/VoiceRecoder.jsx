import { useEffect, useRef, useState } from "react";
import VoiceRecoderContainer from "./VoiceRecoderContainer";
import Timer from "./Timer";

import { sendFoodCategorySpeech } from "../../api";
import { useParams } from "react-router";
import socket from "../../realtimeComunication/socket";
import KeyWordFlippableCard from "../button/keywordCard";

// isOwner : user의 voiceRecoder인지 아닌지 구분
// 그에 따라 말한 결과 Response의 userId와 비교하여 다른 user의 음성인식 결과를 보여주는지 구분
const DUMMY_KEYWORDS = ["한식", "중식", "분위기 좋은", "운치있는"];

const RECORD_STATE = {
  WAIT: 0,
  RECORDING: 1,
  FINISH: 2,
};

const VoiceRecoder = ({ playerHand, isCloseModal }) => {
  const [transcript, setTranscript] = useState("");
  const [showTimer, setShowTimer] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5);
  const [onReady, setOnReady] = useState(false);
  const [recordState, setRecordState] = useState(RECORD_STATE.WAIT);

  const [receiveCategories, setReceiveCategories] = useState([]);

  // Reference to store the SpeechRecognition instance
  const recognitionRef = useRef(null);
  const serverSendTextRef = useRef("");

  const { roomId } = useParams();

  useEffect(() => {
    console.log("serverSendText : ", transcript);
    serverSendTextRef.current = transcript;
  }, [transcript]);

  // Function to start recording
  const startRecording = () => {
    serverSendTextRef.current = "";

    // Create a new SpeechRecognition instance and configure it
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    // Event handler for speech recognition results
    recognitionRef.current.onresult = (event) => {
      const tempScript = event.results[event.results.length - 1][0].transcript;
      setTranscript(tempScript);
    };

    // Start the speech recognition
    recognitionRef.current.start();
  };

  const start = async () => {
    setShowTimer(true);
    await startRecording();
  };

  // Function to stop recording
  const stopRecording = () => {
    setShowTimer(false);
    sendTranscriptToServer();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  useEffect(() => {
    switch (recordState) {
      case RECORD_STATE.RECORDING:
        start();
        break;
      case RECORD_STATE.FINISH:
        stopRecording();
        break;
      default:
        break;
    }
  }, [recordState]);

  useEffect(() => {
    socket.on("receive-speech-foodCategory", (data) => {
      console.log("receive-speech-foodCategory : ", data);

      setReceiveCategories(data.foodCategories);
    });

    return () => {
      // Stop the speech recognition if it's active
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      socket.off("receive-speech-foodCategory");
    };
  }, []);

  const sendTranscriptToServer = () => {
    const data = {
      userSpeech: serverSendTextRef.current,
    };

    const sendFoodCategoryData = async (roomId, data) => {
      const response = sendFoodCategorySpeech(roomId, data);
      if (response.error) {
        console.log(response.exception);
      }
    };

    sendFoodCategoryData(roomId, data);
  };

  const onTimerTimeout = () => {
    setRecordState(RECORD_STATE.FINISH);
  };

  const handleReady = () => {
    setOnReady(true);

    // const data = {
    //   selectedKeywords: playerHand.foodTag,
    // };

    // const sendFoodCategoryData = async (roomId, data) => {
    //   const response = sendFoodCategory(roomId, data);
    //   if (response.error) {
    //     console.log(response.exception);
    //   }
    // };

    // sendFoodCategoryData(roomId, data);
  };

  return (
    <div
      style={{
        opacity: isCloseModal ? 1 : 0, // isCloseModal이 true이면 1(투명하지 않음), false이면 0(투명함)
        visibility: isCloseModal ? "visible" : "hidden", // isCloseModal이 true이면 visible(보임), false이면 hidden(숨김)
        transition: "opacity 0.5s ease-in-out", // 투명도 변화에 대한 transition 효과
      }}
    >
      <VoiceRecoderContainer onReady={onReady}>
        <img
          className="w-12 h-12 absolute -top-5 right-[40%] border-4 border-gray-200 rounded-full"
          src="./avatar.png"
          alt="avatar"
        />
        {/* 음성 텍스트 버전 */}
        <div className="w-full h-full flex flex-col my-2 rounded-md p-5  bg-white">
          {recordState === RECORD_STATE.WAIT && (
            <div className="w-full flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium leading-none text-start">
                  음성 인식 대기 중
                </p>
                <div className="rounded-full w-3 h-3 bg-red-400 animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground text-start">
                아직 시작하지 않았어요...
              </p>
              <div className="h-[130px] flex border items-center justify-center rounded-md m-4">
                <p className="font-semibold"> 사용자를 기다리는 중... </p>
              </div>
            </div>
          )}
          {recordState === RECORD_STATE.RECORDING && (
            <div className="w-full flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium leading-none text-start">
                  음성 인식 중
                </p>
                <div className="rounded-full w-3 h-3 bg-red-400 animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground text-start">
                말을 해주세요...
              </p>
              <div className="h-[130px] flex border items-center justify-center rounded-md m-4">
                <p className="font-semibold">
                  {transcript ? transcript : "입력 대기 중..."}
                </p>
              </div>
              {showTimer && (
                <Timer
                  onTimeout={onTimerTimeout}
                  timeLeft={timeLeft}
                  setTimeLeft={setTimeLeft}
                />
              )}
            </div>
          )}
          {recordState === RECORD_STATE.FINISH && (
            <div className="w-full flex flex-col gap-1">
              <div className="flex flex-col items-center">
                <p className="p-4 w-full text-lg font-medium leading-none text-center">
                  음성 분석 완료
                </p>
                <p className="text-sm text-muted-foreground text-start">
                  선택 완료 버튼을 눌러주세요.
                </p>
              </div>

              <div className="h-[70px] flex border items-center justify-center rounded-md m-4">
                {receiveCategories.length > 0
                  ? receiveCategories.map((keyword, index) => (
                      <p key={index} className="font-semibold">
                        #{keyword}
                      </p>
                    ))
                  : DUMMY_KEYWORDS.map((keyword, index) => (
                      <KeyWordFlippableCard key={index}>
                        #{keyword}
                      </KeyWordFlippableCard>
                    ))}
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleReady}
                  className="p-2 w-32 bg-green-400 shadow-xl rounded-2xl hover:scale-105 transition-all"
                >
                  선택 완료
                </button>
              </div>
            </div>
          )}
        </div>
      </VoiceRecoderContainer>
    </div>
  );
};

export default VoiceRecoder;
//<div className="flex justify-center"></div>;
