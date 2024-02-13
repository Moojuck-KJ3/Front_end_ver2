import { VideoFeed } from "../../../components/video/VideoFeed";

const WaitingFreindVideoContainer = ({ localStream, remoteStreams }) => {
  console.log("remoteStrem", remoteStreams[1]);
  console.log("remoteStrem", remoteStreams[2]);
  console.log("remoteStrem", remoteStreams[3]);
  console.log("remoteStrem", remoteStreams[4]);
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="justify-center items-center">
        <VideoFeed stream={localStream} />
        <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
          유저 A 이름
        </h1>
      </div>
      {remoteStreams[2] && (
        <div className="justify-center items-center">
          <VideoFeed stream={remoteStreams[2]} />
          <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
            유저 B 이름
          </h1>
        </div>
      )}
      {remoteStreams[3] && (
        <div className="justify-center items-center">
          <VideoFeed stream={remoteStreams[3]} />
          <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
            유저 C 이름
          </h1>
        </div>
      )}
      {/* Assuming you want to conditionally render remoteStrem[4] as well */}
      {remoteStreams[4] && (
        <div className="justify-center items-center">
          <VideoFeed stream={remoteStreams[4]} />
          <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
            유저 D 이름
          </h1>
        </div>
      )}
    </div>
  );
};

export default WaitingFreindVideoContainer;
