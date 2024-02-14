import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../realtimeComunication/SocketContext";

const VoiceRecognition = ({
  onSetResultRestaurant,
  onSetPlayerResult,
  userSelectedFoodCategories,
  onSetAllUserPlayerHand,
}) => {
  const socket = useSocket();
  const recognitionRef = useRef(null);
  const { roomId } = useParams();
  const socket = useSocket();

  const handleSetMoodTags = (text) => {
    const serverSendData = {
      roomId: roomId,
      speechSentence: text,
      selectedFoodCategories: userSelectedFoodCategories,
    };

    console.log("send-speech-keyword serverSendData", serverSendData);
    socket.emit("send-speech-keyword", serverSendData);
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
        } else {
          console.log("No speech detected or speech was empty.");
        }
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

  useEffect(() => {
    if (!socket) return;

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
  }, [socket]);

  return <div></div>;
};

export default VoiceRecognition;
