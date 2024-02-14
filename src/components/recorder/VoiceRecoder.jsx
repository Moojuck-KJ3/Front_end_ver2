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
    const start = async () => {
      await startRecording();

      setTimeout(() => {
        stopRecording();
        setShowTimer(false);
      }, 5000);
    };

    start();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const stopRecording = () => {
    setIsRecording(false);
    sendTranscriptToServer();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const sendTranscriptToServer = () => {
    console.log("Sending transcript to server:", serverSendScript);

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
    socket.emit("select-foodCategories", resultList);
    console.log("select-foodCategories is emitted");
    onSetResult((prevPlayerHand) => ({
      ...prevPlayerHand,
      selectedFoodTag: [...prevPlayerHand.selectedFoodTag, ...resultList],
    }));
    onSetAllUserPlayerHand((prevAllUserHand) => ({
      ...prevAllUserHand,
      selectedFoodTag: [...prevAllUserHand.selectedFoodTag, ...resultList],
    }));

    onClick();
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

            <div className="h-[130px] flex border items-center justify-center rounded-md m-4 gap-2">
              {(resultList || []).map((tag, i) => (
                <p
                  className="font-semibold font-tenada text-xl bg-gray-200 rounded-xl px-3 py-2"
                  key={i}
                >
                  {`#${tag}`}
                </p>
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
  );
};

export default VoiceRecoder;
<div className="flex justify-center"></div>;
