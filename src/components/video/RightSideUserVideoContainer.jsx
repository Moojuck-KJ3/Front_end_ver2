import VideoContainer from "./VideoContainer";
import MicIcon from "@mui/icons-material/Mic";

const RightSideUserVideoContainer = ({ remoteStrem }) => {
  return (
    <div className=" flex flex-col w-1/5 min-w-[300px] h-full gap-4 ">
      <div className="flex  min-h-[300px] flex-col justify-center bg-white p-4 mx-2  rounded-lg shadow-2xl border-2 relative">
        <VideoContainer mediaStream={remoteStrem[1]?.stream} />
        {/* {showMic && (
          <button
            onClick={handleClickMic}
            className="w-10 h-10 bg-white rounded-full absolute top-6 right-6 animate-fade"
          >
            <MicIcon />
          </button>
        )} */}
      </div>
      <div className="flex  min-h-[300px] flex-col justify-center bg-white p-4 mx-2  rounded-lg shadow-2xl border-2 ">
        <VideoContainer mediaStream={remoteStrem[4]?.stream} />
      </div>
      <div className="flex flex-col flex-grow  items-center justify-around bg-white px-10  mx-2 py-1 rounded-lg shadow-2xl border-4 border-red-500">
        <button className=" mx-auto w-full font-tenada text-4xl py-4 px-2  text-black bg-orange-400 hover:bg-orange-500 duration-150 ease-in-out hover:scale-105 transition-all rounded-full">
          여기 어때👍
        </button>
        <button className=" mx-auto w-full font-tenada text-4xl py-4 px-2  text-black bg-orange-400  rounded-full hover:bg-orange-500 duration-150 ease-in-out hover:scale-105 transition-all">
          잠깐 주목🗣️
        </button>
        <button className=" mx-auto w-full font-tenada text-4xl py-4 px-2  text-black bg-orange-400  rounded-full hover:bg-orange-500 duration-150 ease-in-out hover:scale-105 transition-all">
          이건 좀...🤬
        </button>
        <button className=" mx-auto w-full font-tenada text-4xl py-4 px-2  text-black bg-orange-400  rounded-full hover:bg-orange-500 duration-150 ease-in-out hover:scale-105 transition-all">
          이거 못 먹어😫
        </button>
      </div>
    </div>
  );
};

export default RightSideUserVideoContainer;
