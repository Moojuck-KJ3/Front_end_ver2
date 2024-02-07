import { useEffect, useRef, useState } from "react";
import VoiceRecoderContainer from "./VoiceRecoderContainer";
import Timer from "./Timer";

import { sendFoodCategorySpeech } from "../../api";
import { useParams } from "react-router";

const VoiceRecoder = ({ onClick, onSetResult, playerHand, isCloseModal }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showTimer, setShowTimer] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5);
  const [onReady, setOnReady] = useState(false);
  const [recordState, setRecordState] = useState(RECORD_STATE.WAIT);

  const [receiveCategories, setReceiveCategories] = useState([]);

  // Reference to store the SpeechRecognition instance
  const recognitionRef = useRef(null);

  const { roomId } = useParams();

  // Function to start recording
  const startRecording = () => {
    setTranscript("");

    setIsRecording(true);
    // Create a new SpeechRecognition instance and configure it
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    // Event handler for speech recognition results
    recognitionRef.current.onresult = (event) => {
      const tempScript = event.results[event.results.length - 1][0].transcript;
      // Log the recognition results and update the transcript state
      console.log("tempScript : ", tempScript);
      setTranscript(tempScript);
    };

    // Start the speech recognition
    recognitionRef.current.start();
  };

  useEffect(() => {
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

  // Function to stop recording
  const stopRecording = () => {
    setIsRecording(false);
    sendTranscriptToServer();
    if (recognitionRef.current) {
      // Stop the speech recognition and mark recording as complete
      recognitionRef.current.stop();
    }
  };

  const sendTranscriptToServer = () => {
    console.log("Sending transcript to server:", transcript);

    const data = {
      userSpeech: transcript,
    };

    const sendFoodCategoryData = async (roomId, data) => {
      const response = sendFoodCategorySpeech(roomId, data);
      if (response) {
        onSetResult(["한식"]);
      } else {
        console.log(response.error);
      }
    };

    sendFoodCategoryData(roomId, data);
  };

  const onTimerTimeout = () => {
    // Function to handle when the timer runs out

    stopRecording();
  };

  const handleReady = () => {
    onClick();
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
    <VoiceRecoderContainer>
      <img
        className="w-12 h-12 absolute -top-5 right-[45%] border-4 border-gray-200 rounded-full"
        src="/avatar.png"
        alt="avatar"
      />
      {/* 음성 텍스트 버전 */}
      <div className="w-full h-full flex flex-col my-2 rounded-md p-5  bg-white">
        {isRecording ? (
          <div className="w-full flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-medium leading-none text-start font-tenada">
                음성 인식 중
              </p>
              <div className="rounded-full w-3 h-3 bg-red-400 animate-pulse" />
            </div>
            <p className=" text-lg text-muted-foreground text-start">
              말을 해주세요...
            </p>
            <div className="h-[130px] flex border items-center justify-center rounded-md m-4">
              <p className="font-tenada text-xl">
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
        ) : (
          <div className="w-full h-full flex flex-col my-2 rounded-md p-5  bg-white animate-fade">
            <div className="flex flex-col items-center">
              <p className="font-tenada p-2 w-full text-2xl font-medium leading-none text-center">
                음성 분석 완료
              </p>
              <p className="text-lg text-muted-foreground text-start">
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
<div className="flex justify-center"></div>;
