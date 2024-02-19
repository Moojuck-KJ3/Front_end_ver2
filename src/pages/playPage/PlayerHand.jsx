import { useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ShowDetailModalWithDiscard from "../../components/modal/ShowDetailModalWithDiscard";
import { useSocket } from "../../realtimeComunication/SocketContext";
import { useParams } from "react-router-dom";
import ShowDetailModal from "../../components/modal/ShowDetailModal";
import JustShowDetailModal from "../../components/modal/JustShowDetailModal";
import MicIcon from "@mui/icons-material/Mic";

const PlayerHand = ({
  allUserPlayerHand,
  onSetAllUserPlayerHand,
  roomMode,
  setRoomMode,
  handleSetReady,
  currentIndex,
  setCurrentIndex,
  showModeTwoVoiceRecorder,
  speechText,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleCardClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRestaurant(null);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === allUserPlayerHand.finalPlace.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? allUserPlayerHand.finalPlace.length - 1 : prevIndex - 1
    );
  };

  const getModeStyle = (modeValue) => {
    if (modeValue === roomMode) {
      return "transform scale-105 border-4 border-blue-600"; // Current mode: Highlighted
    } else if (modeValue < roomMode) {
      return " border-green-400 border-4 text-gray-600 opacity-50";
    }
    return "border-dashed text-gray-40 ";
  };

  const handleDragStart = (event, restaurant) => {
    console.log(restaurant);
    console.log("handleDragStart");
    const restaurantData = JSON.stringify({
      _id: restaurant._id,
      thumbnailImg: restaurant.thumbnailImg,
      name: restaurant.name,
      foodCategories: restaurant.food_category,
      moodKeywords: restaurant.moodKeywords,
      rating: restaurant.rating,
    });

    event.dataTransfer.setData("restaurant", restaurantData);
  };

  const handleClick = (i) => {
    setRoomMode(i);
  };

  const handleReady = () => {
    handleSetReady();
  };

  const countTags = (tags) => {
    const tagCounts = new Map();
    tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
    return tagCounts;
  };

  const moodTagCounts = allUserPlayerHand.selectedMoodTag
    ? countTags(allUserPlayerHand.selectedMoodTag)
    : new Map();

  const foodTagCounts = allUserPlayerHand.selectedFoodTag
    ? countTags(allUserPlayerHand.selectedFoodTag)
    : new Map();

  return (
    <div className="w-full h-1/3">
      <div className="w-full h-full bg-white rounded-md shadow-inner flex ">
        <div
          // onClick={() => handleClick(1)}
          className={`w-1/4 flex flex-col justify-between text-center m-2 border-2 rounded-xl box ${getModeStyle(
            1
          )}`}
        >
          <h1 className="mt-3 font-bold font-DalseoHealing text-4xl">
            선호하는 음식🍔
          </h1>

          <div className="flex-grow h-full scrollbar-hide overflow-y-auto m-2">
            <ul>
              {[...foodTagCounts]
                .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
                .map(([tag, count], index) => (
                  <li
                    key={index}
                    style={{ animationDelay: `${index * 0.2}s` }}
                    className="bg-gray-200 flex justify-between items-center w-5/6 mx-auto my-2 py-2 rounded-lg font-tenada animate-customFadeUp"
                  >
                    <span className="text-lg font-semibold ml-2">{`${
                      index + 1
                    }. `}</span>
                    <h1 className="flex-grow text-center text-xl">{`#${tag}`}</h1>
                    <p className="bg-green-400 font-semibold text-white mr-3 w-7 h-7 text-center rounded-full flex items-center justify-center">
                      {count}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
          {roomMode === 1 && (
            <button
              onClick={handleReady}
              className="w-2/3 mx-auto mb-2 font-DalseoHealing font-bold py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 duration-150 ease-in-out hover:scale-105 transition-all"
            >
              선택 완료
            </button>
          )}
        </div>

        <div
          // onClick={() => handleClick(2)}
          className={`  w-1/4 p-1 flex flex-col text-center m-2 border-2 rounded-xl  justify-between ${getModeStyle(
            2
          )}`}
        >
          <h1 className="mt-3 font-bold font-DalseoHealing text-4xl relative ">
            선호하는 분위기👀
          </h1>
          {showModeTwoVoiceRecorder && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <div className="bg-white border-4 border-blue-500 p-2 rounded-full">
                <MicIcon style={{ color: "black", fontSize: "2rem" }} />
              </div>
              {speechText && (
                <div
                  className="animate-fade absolute items-center justify-center inline-block px-10 py-2 font-2xl font-medium text-black bg-white rounded-lg shadow-sm -translate-x-1/2 left-1/2 bottom-full mb-2 "
                  style={{
                    transition: "opacity 300ms",
                    opacity: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {speechText}
                </div>
              )}
            </div>
          )}
          <ul className="flex-grow h-full scrollbar-hide overflow-y-auto m-2">
            {[...moodTagCounts]
              .sort((a, b) => b[1] - a[1])
              .map(([tag, count], index) => (
                <li
                  key={index}
                  style={{ animationDelay: `${index * 0.2}s` }}
                  className="bg-gray-200 flex justify-between items-center w-5/6 mx-auto my-2 py-2 rounded-lg font-tenada animate-customFadeUp"
                >
                  <span className="text-lg font-semibold ml-2">{`${
                    index + 1
                  }. `}</span>
                  <h1 className="flex-grow text-center text-xl">{`#${tag}`}</h1>
                  <p className="bg-green-400 font-semibold text-white mr-3 w-7 h-7 text-center rounded-full flex items-center justify-center">
                    {count}
                  </p>
                </li>
              ))}
          </ul>
          {roomMode === 2 && (
            <button
              onClick={handleReady}
              className="w-2/3 mx-auto font-DalseoHealing font-bold mb-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 duration-150 ease-in-ou hover:scale-105 transition-all"
            >
              선택 완료
            </button>
          )}
        </div>
        <div
          // onClick={() => handleClick(3)}
          className={`w-2/4 p-1 flex flex-col text-center m-2 border-2 rounded-xl justify-between ${getModeStyle(
            3
          )}`}
        >
          <h1 className="mt-3 font-bold font-DalseoHealing text-4xl ">
            가고 싶은 장소💫
          </h1>

          <div className="flex-grow h-full scrollbar-hide overflow-y-auto m-2">
            <div className="grid grid-cols-4 gap-4">
              {allUserPlayerHand.selectedPlace?.map((place, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(place)}
                  onDragStart={(event) => handleDragStart(event, place)}
                  draggable
                  className="w-full h-full justify-center items-center hover:scale-105 transition-all rounded-xl hover:cursor-pointer  hover: shadow-2xl"
                >
                  <img
                    src={place.thumbnailImg}
                    alt="thumbnailImg"
                    className="w-full h-24  mx-auto object-cover rounded-xl animate-jump"
                  />
                </div>
              ))}
            </div>
          </div>

          {roomMode === 3 && (
            <button
              onClick={handleReady}
              className="w-2/3 mx-auto mb-2 font-DalseoHealing font-bold py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 duration-150 ease-in-ou hover:scale-105 transition-all"
            >
              선택 완료
            </button>
          )}
        </div>
        {isModalOpen && (
          <JustShowDetailModal
            restaurant={selectedRestaurant}
            closeModal={closeModal}
          />
        )}
        {/* <div
          // onClick={() => handleClick(4)}
          className={`w-1/4 p-1 flex flex-col text-center m-2 border-2 rounded-xl justify-between ${getModeStyle(
            4
          )}`}
        >
          <div>
            <h1 className="mt-1 font-tenada text-2xl">최종 목적지⛳️</h1>
            <div className="text-center flex flex-col gap-4 font-tenada">
              {allUserPlayerHand.finalPlace.length > 0 && (
                <>
                  <img
                    src={
                      allUserPlayerHand.finalPlace[currentIndex]?.thumbnailImg
                    }
                    alt="PlacePhoto"
                    className="my-3 w-full max-h-32 shadow-md overflow-hidden mx-auto bg-gray-300 rounded-lg shrink-0 object-cover object-center"
                  />
                  <h1 className="text-xl font-bold truncate">
                    {allUserPlayerHand.finalPlace[currentIndex]?.name}
                  </h1>
                  <h1 className="bg-gray-300 rounded-lg p-1 w-full text-xl">
                    #{allUserPlayerHand.finalPlace[currentIndex]?.food_category}
                  </h1>
                  <h1 className="text-2xl">
                    ⭐️{allUserPlayerHand.finalPlace[currentIndex]?.rating}
                  </h1>
                  <button
                    onClick={handlePrevious}
                    className="bg-white shadow-2xl rounded-full absolute bottom-5 left-2 hover:bg-green-400 transition-all"
                  >
                    <NavigateBeforeIcon fontSize="large" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="bg-white rounded-full absolute bottom-5 right-2 hover:bg-green-400 transition-all"
                  >
                    <NavigateNextIcon fontSize="large" />
                  </button>
                </>
              )}
            </div>
          </div> */}
      </div>
    </div>
  );
};

export default PlayerHand;
