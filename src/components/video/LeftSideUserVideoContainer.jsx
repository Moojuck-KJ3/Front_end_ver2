import VideoContainer from "./VideoContainer";
import MicIcon from "@mui/icons-material/Mic";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import VideocamIcon from "@mui/icons-material/Videocam";

const LeftSideUserVideoContainer = ({
  localStream,
  remoteStrem,
  showMic,
  playerHand,
}) => {
  const handleDragStart = (event, restaurant) => {
    event.preventDefault();

    console.log("handleDragStart");
    console.log(restaurant);

    const restaurantData = JSON.stringify({
      _id: restaurant._id,
      thumbnailImg: restaurant.thumbnailImg,
    });
    console.log(restaurantData);

    event.dataTransfer.setData("restaurant", restaurantData);
    // console.log(restaurantData);
  };

  return (
    <div className=" flex flex-col w-1/5 min-w-[300px] h-full gap-4 ">
      <div className="flex flex-col justify-center bg-white p-4 mx-2 min-h-[300px]  rounded-lg shadow-2xl border-2 relative">
        <VideoContainer mediaStream={localStream} />
        {showMic && (
          <button className="w-10 h-10 bg-green-500 rounded-full absolute top-6 right-6 animate-fade">
            <MicIcon />
          </button>
        )}
      </div>
      <div className="flex flex-col justify-center bg-white p-4 mx-2 min-h-[300px] rounded-lg shadow-2xl border-2 ">
        <VideoContainer mediaStream={remoteStrem[1]?.stream} />
      </div>
      <div className="flex flex-col flex-grow justify-between items-center bg-white p-3 mx-2  rounded-lg shadow-2xl border-2">
        <h1 className="text-2xl font-tenada">⭐️나의 선호도</h1>

        <div className="flex-grow h-full w-full overflow-y-auto m-2">
          <div className="grid grid-cols-2 grid-rows-3 gap-3 overflow-y-auto max-h-98">
            {playerHand.selectedFoodTag?.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-200 w-full h-full py-2 text-center items-center justify-center rounded-lg font-tenada"
              >{`#${tag}`}</div>
            ))}
            {playerHand.selectedMoodTag?.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-200 w-full h-full py-2 text-center items-center justify-center rounded-lg font-tenada"
              >{`#${tag}`}</div>
            ))}
          </div>
        </div>
        <h1 className="text-2xl font-tenada">✅나의 장소 Pick!</h1>

        <div className="flex flex-col h-full w-full">
          <div className="grid grid-cols-3 gap-1 justify-between">
            {playerHand.selectedPlace?.map((place, index) => (
              <div
                key={index}
                draggable
                onDragStart={(event) => handleDragStart(event, place)}
                className="w-full border-2 m-1 rounded-xl border-red-600 cursor-move"
              >
                <img
                  className="w-full h-full rounded-lg object-cover"
                  src={place.thumbnailImg}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full mt-3">
          <button className=" mx-auto font-tenada py-2 px-2 bg-green-500  text-white rounded hover:bg-green-600 duration-150 ease-in-out hover:scale-105 transition-all">
            <VideocamIcon /> Video
          </button>
          <button className="font-tenada py-2 px-2 bg-green-500  text-white rounded hover:bg-green-600 duration-150 ease-in-out hover:scale-105 transition-all">
            <MicIcon /> Mic
          </button>
          <button className=" mx-auto font-tenada py-2 px-2 bg-green-500 text-white rounded hover:bg-green-600 duration-150 ease-in-out hover:scale-105 transition-all">
            <ExitToAppIcon /> 나가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSideUserVideoContainer;
