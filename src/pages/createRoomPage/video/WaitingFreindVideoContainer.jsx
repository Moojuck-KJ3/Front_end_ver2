import { VideoFeed } from "../../../components/video/VideoFeed";

const WaitingFreindVideoContainer = ({ localStream, users }) => {
  console.log(users);
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="justify-center items-center">
        <VideoFeed stream={localStream} />
        <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
          Player 1
        </h1>
      </div>
      {users.slice(1).map((user, index) => (
        <div key={index} className="justify-center items-center">
          <VideoFeed key={user.socketId} stream={user.stream} />
          <h1 className="p-2 m-4 text-center text-gray-500 font-semibold border-2 rounded-2xl">
            {`Player ${index + 2}`}
          </h1>
        </div>
      ))}
    </div>
  );
};

export default WaitingFreindVideoContainer;
