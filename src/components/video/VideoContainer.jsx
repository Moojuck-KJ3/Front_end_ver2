import { useEffect, useRef } from "react";
import { useSocket } from "../../realtimeComunication/SocketContext";

const VideoContainer = ({ mediaStream, attentionData, streamOwnerId }) => {
  console.log(streamOwnerId);
  const socket = useSocket();
  const isSender = attentionData.senderId === socket?.id;
  console.log(isSender);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  return (
    <div>
      {attentionData.show && (
        <div className="icon-overlay">
          {isSender ? (
            <span className="icon">⭐</span> // Star for the sender
          ) : (
            <span className="icon">❗</span> // Exclamation mark for others
          )}
        </div>
      )}
      <video
        className="w-full h-full object-cover rounded-lg border-1 bg-gray-400"
        ref={videoRef}
        autoPlay={true}
        muted={true}
      />
    </div>
  );
};

export default VideoContainer;
