export const VideoFeed = ({ mediaStream, isMuted = false }) => {
  return (
    <video
      className=" w-36 h-36 items-center border-4 border-white shadow-2xl rounded-full object-cover"
      ref={(ref) => {
        if (ref) {
          ref.srcObject = mediaStream;
        }
      }}
      autoPlay={true}
      muted={isMuted}
    />
  );
};

<video autoPlay />;
