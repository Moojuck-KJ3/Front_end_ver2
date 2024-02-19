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
  playerHand,
  setPlayerHand,
  roomDetail,
  highlightedStreamId,
  readyUserIds,
}) => {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const socket = useSocket();
  const { roomId } = useParams();

  const [selectedFoodTag, setSelectedFoodTag] = useState([]);
  const [selectedMoodTag, setSelectedMoodTag] = useState([]);

  useEffect(() => {
    if (playerHand.selectedFoodTag) {
      playerHand.selectedFoodTag.forEach((tag) => {
        setSelectedFoodTag((prev) => {
          if (!prev.includes(tag)) {
            return [...prev, tag];
          } else {
            return prev;
          }
        });
      });
    }
  }, [playerHand.selectedFoodTag]);

  useEffect(() => {
    if (playerHand.selectedMoodTag) {
      playerHand.selectedMoodTag.forEach((tag) => {
        setSelectedMoodTag((prev) => {
          if (!prev.includes(tag)) {
            return [...prev, tag];
          } else {
            return prev;
          }
        });
      });
    }
  }, [playerHand.selectedMoodTag]);

  const renderStreams = (streamIndexArray) => {
    return streamIndexArray.map((index) => {
      const streamInfo = remoteStrem[index];

      if (streamInfo) {
        const isLocalStream = streamInfo.socketId === socket.id;
        const isHighlighted = streamInfo.socketId === highlightedStreamId;
        const isUserReady = readyUserIds.includes(streamInfo.socketId);
        return (
          <div
            key={index}
            className={`${
              isHighlighted ? " relative z-20 ring-4 ring-red-500" : ""
            }`}
          >
            <VideoContainer
              mediaStream={isLocalStream ? localStream : streamInfo.stream}
              isLocalStream={isLocalStream}
              isUserReady={isUserReady}
            />
            {isHighlighted && (
              <img
                className=" w-52 h-52 absolute -top-10 left-72 animate-jump-in"
                src="/확성기.png"
                alt="확성기"
              />
            )}
          </div>
        );
      } else {
        return renderPlaceholder(index);
      }
    });
  };

  const renderPlaceholder = (index) => (
    <div
      key={index}
      className="flex  min-h-[300px] flex-col justify-center bg-white p-4 mx-2  rounded-lg shadow-2xl border-2 relative animate-pulse"
    >
      <div className="w-full h-full rounded-lg border-1 bg-gray-400"></div>
    </div>
  );

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
    // event.preventDefault();
    const restaurantData = JSON.stringify({
      _id: restaurant._id,
      thumbnailImg: restaurant.thumbnailImg,
      name: restaurant.name,
      foodCategories: restaurant.food_category,
      moodKeywords: restaurant.moodKeywords,
      rating: restaurant.rating,
    });
    console.log(restaurantData);

    event.dataTransfer.setData("restaurant", restaurantData);
  };

  return (
    <div className=" relative flex flex-col w-1/5 min-w-[300px] h-full gap-4 ">
      {/* <VideoContainer
        mediaStream={remoteStrem[0]?.stream}
        isLocalStream={true}
      /> */}
      {renderStreams([0, 2])}
      {/* {showMic && (
        <button className="w-14 h-14 bg-green-500 rounded-full absolute top-6 right-8 animate-fade">
          <MicIcon />
        </button>
      )} */}
      {/* <VideoContainer
        mediaStream={remoteStrem[2]?.stream}
        isLocalStream={false}
      /> */}
      <div className="flex flex-col h-full justify-between items-center bg-white p-3 mx-2  rounded-lg shadow-2xl border-2">
        <h1 className="mt-1 text-3xl font-bold font-DalseoHealing">
          ⭐️나의 선호도
        </h1>

        <div className="max-h-52 w-full h-full overflow-y-auto scrollbar-hide m-2">
          <div className="grid grid-cols-2 grid-rows-3 gap-3 overflow-y-auto max-h-98">
            {selectedFoodTag?.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-200 w-full h-full py-2 text-center items-center justify-center rounded-lg text-xl font-DalseoHealing font-bold"
              >{`#${tag}`}</div>
            ))}
            {selectedMoodTag?.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-200 w-full h-full py-2 text-center items-center justify-center rounded-lg text-xl font-DalseoHealing font-bold"
              >{`#${tag}`}</div>
            ))}
          </div>
        </div>
        <h1 className="mt-1 text-3xl font-bold font-DalseoHealing">
          ✅나의 장소 Pick!
        </h1>

        <div className=" w-full h-full overflow-y-auto scrollbar-hide m-2">
          <div className="grid grid-cols-5 gap-1 justify-between">
            {playerHand.selectedPlace?.map((place, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(place)}
                onDragStart={(event) => handleDragStart(event, place)}
                draggable="true"
                className="w-full border-2 m-1 rounded-xl border-red-600 cursor-move animate-fade"
              >
                <img
                  className="w-28 h-16 rounded-lg object-cover"
                  src={place.thumbnailImg}
                  alt="thumbnailImg"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full mt-3">
          <button
            onClick={toggleVideo}
            className=" mx-auto font-DalseoHealing font-bold py-2 px-2 bg-green-500  text-white rounded hover:bg-green-600 duration-150 ease-in-out hover:scale-105 transition-all"
          >
            {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />} Video
          </button>
          <button
            onClick={toggleMic}
            className="font-DalseoHealing font-bold py-2 px-2 bg-green-500  text-white rounded hover:bg-green-600 duration-150 ease-in-out hover:scale-105 transition-all"
          >
            {isMicMuted ? <MicOffIcon /> : <MicIcon />} Mic
          </button>
          <button className=" mx-auto font-DalseoHealing font-bold py-2 px-2 bg-green-500 text-white rounded hover:bg-green-600 duration-150 ease-in-out hover:scale-105 transition-all">
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
