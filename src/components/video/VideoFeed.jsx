export const VideoFeed = ({ mediaStream, isMuted = false }) => {
  return (
    <video
      className=" w-40 h-40 items-center border-4 bg-gray-300 border-white shadow-2xl rounded-full object-cover"
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
