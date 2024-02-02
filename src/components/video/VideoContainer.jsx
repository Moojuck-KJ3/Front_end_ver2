import { VideoFeed } from "./VideoFeed";
import { useLocalCameraStream } from "./useLocalCameraStream";

const VideoContainer = () => {
  const { localStream } = useLocalCameraStream();

  return (
    <div className="fixed bottom-5 right-5">
      <VideoFeed clas mediaStream={localStream} isMuted={true} />
    </div>
  );
};

export default VideoContainer;
