import VideoContainer from "./VideoContainer";
import MicIcon from "@mui/icons-material/Mic";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import VideocamIcon from "@mui/icons-material/Videocam";

const LeftSideUserVideoContainer = ({ localStream, remoteStrem, showMic }) => {
  return (
    <div className=" flex flex-col w-1/5 min-w-[300px] h-full gap-4 ">
      <div className="flex flex-col justify-center bg-white p-4 mx-2  rounded-lg shadow-2xl border-2 relative">
        <VideoContainer mediaStream={localStream} />
        {showMic && (
          <button className="w-10 h-10 bg-green-500 rounded-full absolute top-6 right-6 animate-fade">
            <MicIcon />
          </button>
        )}
      </div>
      <div className="flex flex-col justify-center bg-white p-4 mx-2  rounded-lg shadow-2xl border-2 ">
        <VideoContainer mediaStream={remoteStrem} />
      </div>
      <div className="flex flex-col flex-grow justify-between items-center bg-white p-4 mx-2  rounded-lg shadow-2xl border-2">
        <div className=" text-2xl font-tenada border-">나의 선호도</div>
        <div className=" text-2xl font-tenada">내가 가고 싶은 장소</div>

        <div className="flex w-full">
          <button className=" mx-auto font-tenada py-2 px-2 bg-blue-500 text-white rounded hover:bg-blue-700 duration-150 ease-in-out hover:scale-105 transition-all">
            <VideocamIcon />
          </button>
          <button className="font-tenada py-2 px-2 bg-blue-500 text-white rounded hover:bg-blue-700 duration-150 ease-in-out hover:scale-105 transition-all">
            <MicIcon />
          </button>
          <button className=" mx-auto font-tenada py-2 px-2 bg-blue-500 text-white rounded hover:bg-blue-700 duration-150 ease-in-out hover:scale-105 transition-all">
            <ExitToAppIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSideUserVideoContainer;
