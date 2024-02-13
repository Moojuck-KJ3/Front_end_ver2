import { useEffect } from "react";
import { useRef, useState } from "react";

const Video = ({ stream, muted }) => {
  const ref = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
    if (muted) setIsMuted(muted);
  }, [stream, muted]);

  return (
    <video
      className="w-full h-full object-cover rounded-lg border-1 bg-gray-400"
      ref={ref}
      autoPlay
      muted={isMuted}
    />
  );
};

export default Video;
