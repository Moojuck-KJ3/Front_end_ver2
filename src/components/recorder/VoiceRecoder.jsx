import { useEffect, useRef, useState } from "react";
import VoiceRecoderContainer from "./VoiceRecoderContainer";
import Timer from "./Timer";
import { useParams } from "react-router";
import { useSocket } from "../../realtimeComunication/SocketContext";

const VoiceRecoder = ({
  onClick,
  onSetResult,
  resultList,
  onSetAllUserPlayerHand,
}) => {
  const socket = useSocket();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showTimer, setShowTimer] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5);
  const recognitionRef = useRef(null);
  const serverSendScript = useRef("");
  const { roomId } = useParams();
  const startRecording = () => {
    setTranscript("");

    setIsRecording(true);
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.onresult = (event) => {
      const tempScript = event.results[event.results.length - 1][0].transcript;
      console.log("tempScript : ", tempScript);
      setTranscript(tempScript);
    };

    recognitionRef.current.start();
  };

  useEffect(() => {
    serverSendScript.current = transcript;
  }, [transcript]);

  useEffect(() => {
    setShowTimer(true);
    startRecording();

    const timer = setTimeout(() => {
      stopRecording();
      setShowTimer(false);
    }, 5500);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
      }
      clearTimeout(timer);
    };
  }, []);

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.onend = () => {
        sendTranscriptToServer();
      };
    }
  };

  const sendTranscriptToServer = () => {
    console.log("Sending transcript to server:", serverSendScript.current);

    const serverSendData = {
      roomId: roomId,
      speechSentence: serverSendScript.current,
    };

    socket.emit("send-speech-foodCategory", serverSendData);
  };

  const onTimerTimeout = () => {
    stopRecording();
  };

  const handleReady = () => {
    socket.emit("select-foodCategories", { roomId, resultList });
    console.log("select-foodCategories is emitted");
    onSetResult((prevPlayerHand) => ({
      ...prevPlayerHand,
      selectedFoodTag: [...prevPlayerHand.selectedFoodTag, ...resultList],
    }));

    onClick();
  };

  return (
    <VoiceRecoderContainer>
      <img
        className="w-12 h-12 bg-gray-300 absolute -top-5 right-[45%] border-4 border-gray-400 rounded-full"
        src="/마이크.png"
        alt="avatar"
      />
      {/* 음성 텍스트 버전 */}
      <div className="w-full h-full flex flex-col my-2 rounded-md p-5  bg-white">
        {isRecording ? (
          <div className="w-full flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <p className="text-3xl py-2 leading-none text-start font-DalseoHealing font-bold">
                음성 인식 중
              </p>
              <div className="rounded-full w-3 h-3 bg-red-400 animate-pulse" />
            </div>
            <p className=" text-xl text-muted-foreground text-start">
              말을 해주세요...
            </p>
            <div className="h-[130px] flex border items-center justify-center rounded-md m-4">
              <p className=" font-DalseoHealing font-bold text-2xl">
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
              <p className="font-DalseoHealing font-bold py-2 w-full text-3xl  leading-none text-center">
                음성 분석 완료
              </p>
              <p className="text-xl py-2 text-muted-foreground text-start">
                선택 완료 버튼을 눌러주세요.
              </p>
            </div>

            <div className="h-[130px] flex flex-wrap p-2 border items-center justify-center rounded-md m-4 gap-2  animate-fade ">
              {(resultList || []).map((tag, i) => (
                <p
                  className="font-DalseoHealing font-bold text-xl bg-gray-200 rounded-xl px-3 py-2"
                  key={i}
                >
                  {`#${tag}`}
                </p>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleReady}
                className="p-2 w-32 bg-green-400 font-DalseoHealing font-bold shadow-xl rounded-2xl hover:scale-105 transition-all"
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
