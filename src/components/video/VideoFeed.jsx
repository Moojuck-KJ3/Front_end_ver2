import { useEffect, useRef } from "react";

export const VideoFeed = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      className="w-36 h-36 items-center shadow-lg border rounded-full object-cover"
    />
  );
};

// <video autoPlay />;
