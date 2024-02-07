export const VideoFeed = ({ mediaStream, isMuted = false, isReady }) => {
  return (
    <video
      className={` w-40 h-40 items-center border-4 bg-gray-300 border-white shadow-2xl rounded-full object-cover animate-fade ${
        isReady ? " border-8 border-blue-300" : ""
      }`}
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
