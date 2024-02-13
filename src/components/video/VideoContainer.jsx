import { VideoFeed } from "./VideoFeed";

const VideoContainer = ({ mediaStream }) => {
  console.log(mediaStream);
  return (
    <video
      className="w-full h-full object-cover rounded-lg border-1 bg-gray-400"
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
