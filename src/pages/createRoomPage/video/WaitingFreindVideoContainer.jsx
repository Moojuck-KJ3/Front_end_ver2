import { VideoFeed } from "../../../components/video/VideoFeed";

const WaitingFreindVideoContainer = ({ localStream, remoteStrem }) => {
  console.log(remoteStrem);
  return (
    <div className="grid grid-cols-2 gap-10">
      <div className="justify-center items-center">
        <VideoFeed stream={localStream} />
        <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
          유저 A 이름
        </h1>
      </div>
      <div className="justify-center items-cente">
        <VideoFeed stream={remoteStrem} />
        <h1 className="p-2 m-4 text-center text-gray-500  font-semibold border-2 rounded-2xl">
          유저 B 이름
        </h1>
      </div>
    </div>
  );
};

export default WaitingFreindVideoContainer;
