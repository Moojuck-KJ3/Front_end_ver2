import { useEffect, useRef, useState } from "react";

import { sendMoodKeywordSpeech } from "../../../api";
import { useParams } from "react-router-dom";
import socket from "../../../realtimeComunication/socket";

const VoiceRecognition = ({ onSetResult }) => {
  const recognitionRef = useRef(null);
  const roomId = useParams();

  const handleSetMoodTags = (text) => {
    const data = { userSpeech: text };

    const sendTransText = async (roomId, data) => {
      const response = await sendMoodKeywordSpeech(roomId, data);
      if (response.error) {
        console.error("Error occured in sending mood tags", response.exception);
      }
    };

    sendTransText(roomId, data);

    // 반응은 response로 받을 예정
    onSetResult("조용한");
  };

  useEffect(() => {
    setupSpeechRecognition();

    socket.on("receive-speech-foodCategory", (data) => {
      console.log(data);
      onSetResult(data.keywords);
    });

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
      }

      socket.off("receive-speech-foodCategory");
    };
  }, []);

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
        // Automatically restart the recognition in case of end
        recognitionRef.current.start();
      };
    }
  };

  return <div></div>;
};

export default VoiceRecognition;
