import {
  useChatConnection,
  usePeerConnection,
} from "../../realtimeComunication/webRTCManager";
import { VideoFeed } from "./VideoFeed";
import { useLocalCameraStream } from "./useLocalCameraStream";

const VideoContainer = ({ isGuest }) => {
  const { localStream } = useLocalCameraStream();
  // const { peerConnection, guestStream } = usePeerConnection(localStream);
  // useChatConnection(peerConnection);

  return (
    <VideoFeed
      // mediaStream={isGuest ? guestStream : localStream}
      mediaStream={localStream}
      isMuted={true}
    />
  );
};

export default VideoContainer;
