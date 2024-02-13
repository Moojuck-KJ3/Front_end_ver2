import { VideoFeed } from "../../../components/video/VideoFeed";

const WaitingFreindVideoContainer = ({ localStream, remoteStreams }) => {
  console.log("remoteStrem", remoteStreams);

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="justify-center items-center">
        <VideoFeed stream={localStream} />
        <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
          유저 A 이름
        </h1>
      </div>
      {Object.values(remoteStreams).map((stream, index) => (
        <div key={index} className="justify-center items-center">
          <VideoFeed stream={stream} />
          <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
            User {index + 1}
          </h1>
        </div>
      ))}
    </div>
  );
};

export default WaitingFreindVideoContainer;
