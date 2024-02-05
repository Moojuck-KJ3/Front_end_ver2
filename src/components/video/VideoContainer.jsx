import { VideoFeed } from "./VideoFeed";

const VideoContainer = ({ mediaStream }) => {
  // const { peerConnection, guestStream } = usePeerConnection(localStream);
  // useChatConnection(peerConnection);

  return (
    <VideoFeed
      // mediaStream={isGuest ? guestStream : localStream}
      mediaStream={mediaStream}
      isMuted={true}
    />
  );
};

export default VideoContainer;
