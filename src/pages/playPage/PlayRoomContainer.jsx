const PlayRoomContainer = ({ children }) => {
  return (
    <div className=" min-h-screen text-gray-900 flex justify-center">
      <div className="m-12 max-w-screen-xl sm-m-10 bg-white shadow-lg sm:rounded-lg flex justify-center flex-1 animate-fade-up">
        <div className="flex flex-col w-full h-full p-6 sm:p-12 m-auto ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PlayRoomContainer;
