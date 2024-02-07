import { useEffect, useRef, useState } from "react";

const VoiceRecognition = ({ onSetResult }) => {
  const recognitionRef = useRef(null);

  const handleSetMoodTags = () => {
    // TODO
    // 서버에 음성 인식 결과 받고, 그 결과를 SET하기
    onSetResult("조용한");
  };

  useEffect(() => {
    setupSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
      }
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
        handleSetMoodTags();
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
