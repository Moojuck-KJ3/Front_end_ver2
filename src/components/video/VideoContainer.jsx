import { useEffect, useRef } from "react";
import { useSocket } from "../../realtimeComunication/SocketContext";

const VideoContainer = ({ mediaStream, isLocalStream, isUserReady }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  return (
    <div
      className={`flex min-h-[300px] flex-col justify-center p-4 mx-2 rounded-lg shadow-2xl border-2 relative ${
        isUserReady ? "bg-green-500" : "bg-white"
      }`}
    >
      <video
        className="w-full h-full object-cover rounded-lg border-1 bg-gray-400"
        ref={videoRef}
        autoPlay={true}
        muted={isLocalStream}
        playsInline
      />
    </div>
  );
};

export default VideoContainer;
