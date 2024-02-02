import { useEffect, useRef, useState } from "react";

const VoiceRecoder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Reference to store the SpeechRecognition instance
  const recognitionRef = useRef(null);

  // Function to start recording
  const startRecording = () => {
    setTranscript("");
    setRecordingComplete(false);
    setIsRecording(true);
    // Create a new SpeechRecognition instance and configure it
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    // Event handler for speech recognition results
    recognitionRef.current.onresult = (event) => {
      const { transcript } = event.results[event.results.length - 1][0];

      // Log the recognition results and update the transcript state
      console.log(event.results);
      setTranscript(transcript);
    };

    // Start the speech recognition
    recognitionRef.current.start();
  };

  // Cleanup effect when the component unmounts
  useEffect(() => {
    return () => {
      // Stop the speech recognition if it's active
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Function to stop recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      // Stop the speech recognition and mark recording as complete
      recognitionRef.current.stop();
      setRecordingComplete(true);
    }
  };

  // Toggle recording state and manage recording actions
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const sendTranscriptToServer = () => {
    // TODO :
    // 서버에 transcript 보내고 응답 받기
    console.log("Sending transcript to server:", transcript);
    setRecordingComplete(false);
  };

  return (
    <div className="w-72 h-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl ">
      <div className="flex flex-col justify-center items-center px-4 py-3 w-72">
        <div>
          <span className="mr-3 uppercase text-lx font-bold">
            유저 A의 선호도
          </span>
        </div>
        {/* 음성 텍스트 버전 */}
        <div className="w-full my-2 rounded-md border p-4 bg-white">
          <div className="flex-1 flex w-full justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {recordingComplete ? "음성 인식 끝" : "음성 인식 중"}
              </p>
              <p className="text-sm text-muted-foreground py-1">
                {recordingComplete
                  ? "말해주셔서 감사합니다."
                  : "말을 해주세요..."}
              </p>
            </div>
            {isRecording && (
              <div className="rounded-full w-4 h-4 bg-red-400 animate-pulse" />
            )}
          </div>

          <div className="border rounded-md p-4">
            <p className="mb-0">
              {transcript ? transcript : "입력 대기 중..."}
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="flex items-center w-full">
          {isRecording ? (
            // Button for sending transcript to server
            <button
              onClick={handleToggleRecording}
              className="mt-2 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-20 h-20 focus:outline-none"
            >
              <svg
                className="h-12 w-12 "
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
          ) : (
            // Button for starting/stopping recording
            <button
              onClick={
                recordingComplete
                  ? sendTranscriptToServer
                  : handleToggleRecording
              }
              className="mt-2 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full w-20 h-20 focus:outline-none"
            >
              {recordingComplete ? (
                "전송"
              ) : (
                <svg
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-white"
                >
                  <path
                    fill="currentColor" // Change fill color to the desired color
                    d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceRecoder;
