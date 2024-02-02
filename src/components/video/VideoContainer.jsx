import { VideoFeed } from "./VideoFeed";
import { useLocalCameraStream } from "./useLocalCameraStream";

const VideoContainer = () => {
  const { localStream } = useLocalCameraStream();

  return <VideoFeed clas mediaStream={localStream} isMuted={true} />;
};

export default VideoContainer;
