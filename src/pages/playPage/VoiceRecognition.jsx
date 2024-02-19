import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../realtimeComunication/SocketContext";

const SERVER_SEND_TIME = 3000;

const VoiceRecognition = ({
  onSetResultRestaurant,
  onSetPlayerResult,
  userSelectedFoodCategories,
  onSetAllUserPlayerHand,
  setSpeechText,
}) => {
  const socket = useSocket();
  const recognitionRef = useRef(null);
  const { roomId } = useParams();

  // 버퍼 역할을 하는 상태 변수
  const [buffer, setBuffer] = useState([]);

  const throttleTimeout = useRef();

  const handleSetMoodTags = (text) => {
    // 버퍼에 데이터 추가
    console.log("handleSetMoodTags : ", text);
    setBuffer((prevBuffer) => [...prevBuffer, text]);
  };

  useEffect(() => {
    // throttleTimeout.current가 설정되지 않았다면 sendBufferToServer 실행
    if (!throttleTimeout.current) {
      sendBufferToServer();

      // 다음 sendBufferToServer 실행까지 일정 시간 대기
      throttleTimeout.current = setTimeout(() => {
        throttleTimeout.current = null;
      }, SERVER_SEND_TIME);
    }
  }, [buffer]); // buffer 상태가 변경될 때마다 실행

  const sendBufferToServer = () => {
    console.log("sendBufferToServer", buffer);
    if (buffer.length === 0) return;

    const serverSendData = {
      roomId: roomId,
      speechSentence: buffer.join(" "),
      selectedFoodCategories: userSelectedFoodCategories,
    };

    console.log("send-speech-keyword serverSendData", serverSendData);
    socket.emit("send-speech-keyword", serverSendData);

    // 버퍼 비우기
    setBuffer([]);
  };

  const handleReceiveSpeechKeyword = (data) => {
    console.log("receive speech keyword Datas : ", data);
    if (data.keywords.length > 0) {
      onSetPlayerResult((prevPlayerHand) => ({
        ...prevPlayerHand,
        selectedMoodTag: [...prevPlayerHand.selectedMoodTag, ...data.keywords],
      }));

      onSetAllUserPlayerHand((prevAllUserHand) => ({
        ...prevAllUserHand,
        selectedMoodTag: [...prevAllUserHand.selectedMoodTag, ...data.keywords],
      }));
    }
    onSetResultRestaurant(data.restaurantList);
  };

  const setupSpeechRecognition = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = new window.webkitSpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = "ko-KR";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript.trim();
        console.log("Voice Input:", text);
        if (text) {
          handleSetMoodTags(text);
          setSpeechText(text);
        } else {
          console.log("No speech detected or speech was empty.");
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error", event.error);
        recognitionRef.current.isStarted = false;
      };

      recognitionRef.current.onend = () => {
        recognitionRef.current.start();
        recognitionRef.current.isStarted = true;
      };

      recognitionRef.current.isStarted = false;
    }

    if (!recognitionRef.current.isStarted) {
      recognitionRef.current.start();
      recognitionRef.current.isStarted = true;
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("receive-speech-keyword", handleReceiveSpeechKeyword);
    setupSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      socket.off("receive-speech-keyword", handleReceiveSpeechKeyword);
      clearTimeout(throttleTimeout);
    };
  }, [socket]);

  useEffect(() => {
    // Component did mount
    setupSpeechRecognition();

    return () => {
      // Component will unmount
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
      }
      clearTimeout(throttleTimeout);
    };
  }, []);

  return <div></div>;
};

export default VoiceRecognition;
