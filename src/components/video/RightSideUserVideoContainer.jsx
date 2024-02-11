import VideoContainer from "./VideoContainer";
import MicIcon from "@mui/icons-material/Mic";

const RightSideUserVideoContainer = ({
  localStream,
  remoteStrem,
  handList,
  showMic,
  onReady,
}) => {
  const handleClickMic = () => {
    console.log("handleClickMic is called");
    onReady();
  };
  return (
    <div className=" flex flex-col w-1/5 min-w-[300px] h-full gap-4 ">
      <div className="flex flex-col justify-center bg-white p-4 mx-2  rounded-lg shadow-2xl border-2 relative">
        <VideoContainer mediaStream={remoteStrem} />
        {/* {showMic && (
          <button
            onClick={handleClickMic}
            className="w-10 h-10 bg-white rounded-full absolute top-6 right-6 animate-fade"
          >
            <MicIcon />
          </button>
        )} */}
      </div>
      <div className="flex flex-col justify-center bg-white p-4 mx-2  rounded-lg shadow-2xl border-2 ">
        <VideoContainer mediaStream={remoteStrem} />
      </div>
    </div>
  );
};

export default RightSideUserVideoContainer;
