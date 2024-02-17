import VideoContainer from "./VideoContainer";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { useEffect, useState } from "react";
import { useSocket } from "../../realtimeComunication/SocketContext";
import { useParams } from "react-router-dom";
import ShowDetailModalWithDiscard from "../modal/ShowDetailModalWithDiscard";

const LeftSideUserVideoContainer = ({
  localStream,
  remoteStrem,
  showMic,
  playerHand,
  setPlayerHand,
  roomDetail,
}) => {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const socket = useSocket();
  const { roomId } = useParams();

  const sortedUserStreams = roomDetail.userStreams.sort((a, b) =>
    a.socketId.localeCompare(b.socketId)
  );
  const streamsToShow = sortedUserStreams.filter((_, index) => index % 2 === 0);

  const handleCardClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRestaurant(null);
  };

  const removeFromPlayerHand = (restaurantToRemoveId) => {
    const updatedHand = playerHand.selectedPlace.filter(
      (restaurant) => restaurant._id !== restaurantToRemoveId
    );

    setPlayerHand((prevState) => ({
      ...prevState,
      selectedPlace: updatedHand,
    }));

    socket.emit("remove-selected-place", { roomId, restaurantToRemoveId });

    closeModal();
  };

  const toggleMic = () => {
    if (!localStream) return;
    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length === 0) return;
    const currentState = audioTracks[0].enabled;

    audioTracks[0].enabled = !currentState;
    setIsMicMuted(currentState); // Reflects the state before toggling
  };

  const toggleVideo = () => {
    if (!localStream) return;
    const videoTracks = localStream.getVideoTracks();
    if (videoTracks.length === 0) return;
    const currentState = videoTracks[0].enabled;

    videoTracks[0].enabled = !currentState;
    setIsVideoOff(currentState); // Reflects the state before toggling
  };
  const handleDragStart = (event, restaurant) => {
    event.preventDefault();
    const restaurantData = JSON.stringify({
      id: restaurant._id,
      thumbnailImg: restaurant.thumbnailImg,
    });

    event.dataTransfer.setData("restaurant", restaurantData);
  };

  const renderPlaceholders = (count) => {
    let placeholders = [];
    for (let i = 0; i < count; i++) {
      placeholders.push(
        <div
          key={`placeholder-${i}`}
          className="flex  min-h-[300px] flex-col justify-center bg-white p-4 mx-2  rounded-lg shadow-2xl border-2 relative"
        >
          <div className="w-full h-full object-cover rounded-lg border-1 bg-gray-500 animate-pulse" />
        </div>
      );
    }
    return placeholders;
  };

  return (
    <div className=" relative flex flex-col w-1/5 min-w-[300px] h-full gap-4 ">
      {localStream ? (
        <VideoContainer mediaStream={localStream} isLocalStream={true} />
      ) : (
        renderPlaceholders(1)
      )}
      {showMic && (
        <button className="w-14 h-14 bg-green-500 rounded-full absolute top-6 right-8 animate-fade">
          <MicIcon />
        </button>
      )}
      {streamsToShow.length > 0
        ? streamsToShow.map((userStream, index) => (
            <VideoContainer
              key={index}
              stream={userStream.stream}
              isLocalStream={false}
            />
          ))
        : renderPlaceholders(1)}
      <div className="flex flex-col h-full justify-between items-center bg-white p-3 mx-2  rounded-lg shadow-2xl border-2">
        <h1 className="text-2xl font-tenada">⭐️나의 선호도</h1>

        <div className="flex-grow h-full w-full overflow-y-auto scrollbar-hide m-2">
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

        <div className=" w-full h-full overflow-y-auto scrollbar-hide m-2">
          <div className="grid grid-cols-3 gap-1 justify-between">
            {playerHand.selectedPlace?.map((place, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(place)}
                draggable
                onDragStart={(event) => handleDragStart(event, place)}
                className="w-full border-2 m-1 rounded-xl border-red-600 cursor-move animate-fade"
              >
                <img
                  className="w-full h-24 rounded-lg object-cover"
                  src={place.thumbnailImg}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full mt-3">
          <button
            onClick={toggleVideo}
            className=" mx-auto font-tenada py-2 px-2 bg-green-500  text-white rounded hover:bg-green-600 duration-150 ease-in-out hover:scale-105 transition-all"
          >
            {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />} Video
          </button>
          <button
            onClick={toggleMic}
            className="font-tenada py-2 px-2 bg-green-500  text-white rounded hover:bg-green-600 duration-150 ease-in-out hover:scale-105 transition-all"
          >
            {isMicMuted ? <MicOffIcon /> : <MicIcon />} Mic
          </button>
          <button className=" mx-auto font-tenada py-2 px-2 bg-green-500 text-white rounded hover:bg-green-600 duration-150 ease-in-out hover:scale-105 transition-all">
            <ExitToAppIcon /> 나가기
          </button>
        </div>
        {isModalOpen && (
          <ShowDetailModalWithDiscard
            restaurant={selectedRestaurant}
            closeModal={closeModal}
            removeFromPlayerHand={removeFromPlayerHand}
          />
        )}
      </div>
    </div>
  );
};

export default LeftSideUserVideoContainer;
