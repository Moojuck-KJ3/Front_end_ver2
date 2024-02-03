const WaitingFreindVideoContainer = ({ localStream, remoteStrem }) => {
  return (
    <div className="grid grid-cols-2 gap-10">
      <div className="justify-center items-center">
        <video
          className=" w-36 h-36 items-center border rounded-full object-cover"
          ref={localStream}
          autoPlay={true}
          muted={true}
        />
        <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
          마찬옥
        </h1>
      </div>
      <div className="justify-center items-center">
        <video
          className=" w-36 h-36 items-center border rounded-full object-cover"
          ref={remoteStrem}
          autoPlay={true}
          muted={true}
        />
        <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
          마찬옥
        </h1>
      </div>
    </div>
  );
};

export default WaitingFreindVideoContainer;
