import { useEffect, useRef } from "react";

export const VideoFeed = ({ stream }) => {
  console.log(stream);

  return (
    <video
      ref={stream}
      autoPlay
      muted
      className="w-36 h-36 items-center shadow-lg border rounded-full object-cover"
    />
  );
};

// <video autoPlay />;
