import { VideoFeed } from "../../../components/video/VideoFeed";

const WaitingFreindVideoContainer = ({ localStream, users }) => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="justify-center items-center">
        <VideoFeed stream={localStream} />
        <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
          유저 A 이름
        </h1>
      </div>
      {users.map((user, index) => (
        <VideoFeed key={index} stream={user.stream} />
      ))}
    </div>
  );
};

export default WaitingFreindVideoContainer;
