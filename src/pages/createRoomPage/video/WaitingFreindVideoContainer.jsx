import { VideoFeed } from "../../../components/video/VideoFeed";

const WaitingFreindVideoContainer = ({ localStream, remoteStrem }) => {
  console.log("remoteStrem", remoteStrem);
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="justify-center items-center">
        <VideoFeed stream={localStream} />
        <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
          유저 A 이름
        </h1>
      </div>
      {remoteStrem[2] && (
        <div className="justify-center items-center">
          <VideoFeed stream={remoteStrem[2]} />
          <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
            유저 B 이름
          </h1>
        </div>
      )}
      {remoteStrem[3] && (
        <div className="justify-center items-center">
          <VideoFeed stream={remoteStrem[3]} />
          <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
            유저 C 이름
          </h1>
        </div>
      )}
      {/* Assuming you want to conditionally render remoteStrem[4] as well */}
      {remoteStrem[4] && (
        <div className="justify-center items-center">
          <VideoFeed stream={remoteStrem[4]} />
          <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
            유저 D 이름
          </h1>
        </div>
      )}
    </div>
  );
};

export default WaitingFreindVideoContainer;
