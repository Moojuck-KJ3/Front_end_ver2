import VideoContainer from "./VideoContainer";

const UserVideoContainer = ({ localStream, remoteStrem }) => {
  return (
    <>
      <div className=" rounded-full absolute bottom-44 left-10 z-10">
        <VideoContainer mediaStream={localStream} />
      </div>
      <div className=" rounded-full absolute bottom-44 right-10 z-10">
        <VideoContainer mediaStream={remoteStrem} />
      </div>
      <div className=" rounded-full absolute top-40 right-10 z-10">
        <img
          className=" w-40 h-40 items-center border-4 bg-gray-300 border-white
      shadow-2xl rounded-full object-cover"
          src="/현재훈_profile.jpg"
          alt=""
        />
      </div>
      <div className=" rounded-full absolute top-40 left-10 z-10">
        <img
          className=" w-40 h-40 items-center border-4 bg-gray-300 border-white
      shadow-2xl rounded-full object-cover"
          src="/이서연_profile.png"
          alt=""
        />
      </div>
    </>
  );
};

export default UserVideoContainer;
