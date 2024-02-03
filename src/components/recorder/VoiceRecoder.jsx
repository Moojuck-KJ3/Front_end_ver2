import { useEffect, useRef, useState } from "react";
import VoiceRecoderContainer from "./VoiceRecoderContainer";
import Timer from "./Timer";

import { sendFoodCategorySpeech } from "../../api";
import { useParams } from "react-router";

const VoiceRecoder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showTimer, setShowTimer] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5);
  const [onReady, setOnReady] = useState(false);
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
      const { tempScript } = event.results[event.results.length - 1][0];
      // Log the recognition results and update the transcript state
      console.log("results : ", event.results);
      console.log("tempScript : ", tempScript);
      setTranscript(tempScript);
    };

    // Start the speech recognition
    recognitionRef.current.start();
  };

  useEffect(() => {
    setShowTimer(true);
    startRecording();
    const start = async () => {
      await startRecording();

      setTimeout(() => {
        stopRecording();
        setShowTimer(false);
      }, 5000); // Stop recording after 5 seconds
    };

    start();

    return () => {
      // Stop the speech recognition if it's active
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
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

    sendFoodCategorySpeech(roomId, data);
  };

  const onTimerTimeout = () => {
    // Function to handle when the timer runs out

    stopRecording();
  };

  const handleReady = () => {
    setOnReady(true);
  };

  return (
    <VoiceRecoderContainer onReady={onReady}>
      <img
        className="w-12 h-12 absolute -top-5 right-[40%] border-4 border-gray-200 rounded-full"
        src="./avatar.png"
        alt="avatar"
      />
      {/* 음성 텍스트 버전 */}
      <div className="w-full h-full flex flex-col my-2 rounded-md p-5  bg-white">
        {isRecording ? (
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
        ) : (
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
              <p className="font-semibold">#한식, #한식당, #일식, #중식</p>
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
  );
};

export default VoiceRecoder;
<div className="flex justify-center"></div>;
