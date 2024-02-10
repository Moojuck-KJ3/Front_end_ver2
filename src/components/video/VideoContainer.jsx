import { VideoFeed } from "./VideoFeed";

const VideoContainer = ({ mediaStream }) => {
  return (
    <video
      className="w-full min-h-52 object-cover rounded-lg border-1 bg-gray-400"
      ref={(ref) => {
        if (ref) {
          ref.srcObject = mediaStream;
        }
      }}
      autoPlay={true}
      muted={true}
    />
  );
};

export default VideoContainer;
