import { useState } from "react";
import ShowDetailModalWithDiscard from "../../components/modal/ShowDetailModalWithDiscard";
import { useSocket } from "../../realtimeComunication/SocketContext";
import { useParams } from "react-router-dom";
import ShowDetailModal from "../../components/modal/ShowDetailModal";
import JustShowDetailModal from "../../components/modal/JustShowDetailModal";
import MicIcon from "@mui/icons-material/Mic";

const SHOW_ANIM_LIMIT = 7;

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

  const getModeStyle = (modeValue) => {
    if (modeValue === roomMode) {
      return "transform scale-105 border-4 border-blue-600"; // Current mode: Highlighted
    } else if (modeValue < roomMode) {
      return " border-green-400 max-h-[420px] border-4 text-gray-600 opacity-50";
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
      foodCategories: restaurant.foodCategory,
      newMoods: restaurant.newMoods,
      rating: restaurant.rating,
    });

    event.dataTransfer.setData("restaurant", restaurantData);
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
                    key={index + count * 1000}
                    style={{ animationDelay: `${index * 0.2}s` }}
                    className={`bg-gray-200 flex justify-between items-center w-5/6 mx-auto my-2 py-2 rounded-lg text-2xl font-bold font-DalseoHealing ${
                      index < SHOW_ANIM_LIMIT ? "animate-customFadeUp" : ""
                    }`}
                  >
                    <span className="text-2xl font-semibold ml-2">{`${
                      index + 1
                    }. `}</span>
                    <h1 className="flex-grow text-center ">{`#${tag}`}</h1>
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
              <div className="bg-white border-4 border-blue-500 p-2 rounded-full  animate-fade">
                <MicIcon style={{ color: "black", fontSize: "2rem" }} />
              </div>
              {speechText && (
                <div
                  className="animate-fade absolute items-center justify-center inline-block px-10 py-2 font-2xl font-medium text-black bg-white rounded-lg shadow-sm -translate-x-1/2 left-1/2 bottom-full mb-2 "
                  style={{
                    transition: "opacity 300ms",
                    opacity: 1,
                    whiteSpace: "nowrap",
                    maxWidth: "250px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {speechText}
                </div>
              )}
            </div>
          )}
          <div className="max-h-70 h-full overflow-y-auto scrollbar-hide ">
            <ul className="m-2">
              {[...moodTagCounts]
                .sort((a, b) => b[1] - a[1])
                .map(([tag, count], index) => (
                  <li
                    key={index + count * 1000} // key 값이 겹치지 않도록 * 100 하여 설정
                    style={{ animationDelay: `${index * 0.2}s` }}
                    className={`bg-gray-200 flex justify-between items-center w-5/6 mx-auto my-2 py-2 rounded-lg text-2xl font-bold font-DalseoHealing ${
                      index < SHOW_ANIM_LIMIT ? "animate-customFadeUp" : ""
                    }`}
                  >
                    <span className="font-semibold ml-2">{`${
                      index + 1
                    }. `}</span>
                    <h1 className="flex-grow text-center ">{`#${tag}`}</h1>
                    <p className="bg-green-400 font-semibold text-white mr-3 w-7 h-7 text-center rounded-full flex items-center justify-center">
                      {count}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
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
              className="w-44 mx-auto mb-2 font-DalseoHealing font-bold py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 duration-150 ease-in-ou hover:scale-105 transition-all"
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
      </div>
    </div>
  );
};

export default PlayerHand;
