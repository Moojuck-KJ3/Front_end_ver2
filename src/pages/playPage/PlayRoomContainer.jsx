const PlayRoomContainer = ({ children }) => {
  return (
    <div className="h-screen w-full text-gray-900 flex justify-center ">
      <video
        autoPlay
        loop
        muted
        className="absolute -z-10 w-full h-full object-cover"
      >
        <source src="/Background.mp4" type="video/mp4" />
      </video>

      {/* <div className="shadow-lg sm:rounded-lg flex justify-center animate-fade-up"> */}
      <div className="flex flex-col w-full h-full">{children}</div>
    </div>
    // </div>
  );
};

export default PlayRoomContainer;
