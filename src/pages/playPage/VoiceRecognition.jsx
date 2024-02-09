import { useEffect, useRef } from "react";

import { useParams } from "react-router-dom";
import socket from "../../realtimeComunication/socket";

const VoiceRecognition = ({
  onSetResult,
  onAddRest,
  onSetTestResult,
  selectedFoodCategories,
}) => {
  const recognitionRef = useRef(null);
  const { roomId } = useParams();

  const handleSetMoodTags = (text) => {
    // const data = { speechSentence: text };

    // const sendTransText = async (roomId, data) => {
    //   const response = await sendMoodKeywordSpeech(roomId, data);
    //   if (response.error) {
    //     console.error("Error occured in sending mood tags", response.exception);
    //   }
    // };
    // sendTransText(roomId, data);

    const serverSendData = {
      roomId: roomId,
      speechSentence: text,
      selectedFoodCategories: selectedFoodCategories,
    };

    console.log("send-speech-keyword serverSendData", serverSendData);

    socket.emit("send-speech-keyword", serverSendData);

    // 반응은 response로 받을 예정
    //onSetResult("조용한");

    // TEST
    onSetTestResult((prevPlayerHand) => ({
      ...prevPlayerHand,
      selectedMoodTag: [...prevPlayerHand.selectedMoodTag, "조용한"],
    }));
  };

  useEffect(() => {
    setupSpeechRecognition();

    socket.on("receive-speech-keyword", handleReceiveSpeechKeyword);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
      }

      socket.off("receive-speech-keyword", handleReceiveSpeechKeyword);
    };
  }, []);

  const handleReceiveSpeechKeyword = (data) => {
    console.log("receive speech keyword Datas : ", data);
    if (data.keywords.length > 0) {
      onSetResult(data.keywords);
    }

    if (Array.isArray(data.restaurantList) && data.restaurantList.length > 0) {
      for (let i = 0; i < data.restaurantList.length; i++) {
        onAddRest(data.restaurantList[i]);
      }
    }
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
        handleSetMoodTags(text);
      };
      recognitionRef.current.start();

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error", event.error);
      };

      recognitionRef.current.onend = () => {
        recognitionRef.current.start();
      };
    }
  };

  return <div></div>;
};

export default VoiceRecognition;