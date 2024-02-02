import { useLocalCameraStream } from "../../../components/video/useLocalCameraStream";

const WaitingFriendVideo = () => {
  const { localStream } = useLocalCameraStream();

  return (
    <video
      className=" w-36 h-36 items-center border rounded-full object-cover"
      ref={(ref) => {
        if (ref) {
          ref.srcObject = localStream;
        }
      }}
      autoPlay={true}
      muted={true}
    />
  );
};

export default WaitingFriendVideo;
