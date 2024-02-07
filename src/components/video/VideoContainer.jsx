import { VideoFeed } from "./VideoFeed";

const VideoContainer = ({ mediaStream }) => {
  return <VideoFeed mediaStream={mediaStream} isMuted={true} />;
};

export default VideoContainer;
