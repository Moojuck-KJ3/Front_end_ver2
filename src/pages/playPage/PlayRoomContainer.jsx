const PlayRoomContainer = ({ children }) => {
  return (
    <div className=" min-h-screen text-gray-900 flex justify-center ">
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src="/Background.mp4" type="video/mp4" />
      </video>

      <div className="m-10 max-w-screen-xl shadow-lg sm:rounded-lg flex justify-center flex-1 animate-fade-up">
        <div className="flex flex-col w-full h-full m-auto ">{children}</div>
      </div>
    </div>
  );
};

export default PlayRoomContainer;
