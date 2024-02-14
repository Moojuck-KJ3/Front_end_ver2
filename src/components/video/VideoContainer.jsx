import { useEffect, useRef } from "react";

const VideoContainer = ({ mediaStream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  return (
    <video
      className="w-full h-full object-cover rounded-lg border-1 bg-gray-400"
      ref={videoRef}
      autoPlay={true}
      muted={true}
    />
  );
};

export default VideoContainer;
