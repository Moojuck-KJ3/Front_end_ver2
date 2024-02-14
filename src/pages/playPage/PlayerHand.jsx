import PlaceCard from "./modeThree/card/PlaceCard";

const PlayerHand = ({
  allUserPlayerHand,
  onSetAllUserPlayerHand,
  roomMode,
  setRoomMode,
  handleSetReady,
}) => {
  const getModeStyle = (modeValue) => {
    if (modeValue === roomMode) {
      return "transform scale-105 border-4 border-blue-600"; // Current mode: Highlighted
    } else if (modeValue < roomMode) {
      return " border-green-400 border-4 text-gray-600 opacity-50";
    }
    return "border-dashed text-gray-400 opacity-50 ";
  };

  const handleDragStart = (event, restaurant) => {
    console.log(restaurant);
    console.log("handleDragStart");
    const restaurantData = JSON.stringify({
      _id: restaurant._id,
      thumbnailImg: restaurant.thumbnailImg,
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
          onClick={() => handleClick(1)}
          className={`w-1/4 flex flex-col justify-between text-center m-2 border-2 rounded-xl box ${getModeStyle(
            1
          )}`}
        >
          <div>
            <h1 className="mt-2 font-tenada text-2xl">선호하는 음식🍔</h1>
            <ul>
              {[...foodTagCounts]
                .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
                .map(([tag, count], index) => (
                  <li
                    key={index}
                    className="bg-gray-200 flex justify-between items-center w-5/6 mx-auto my-2 py-2 rounded-lg font-tenada"
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
              className="w-2/3 mx-auto mb-2 font-tenada py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 duration-150 ease-in-out hover:scale-105 transition-all"
            >
              선택 완료
            </button>
          )}
        </div>

        <div
          onClick={() => handleClick(2)}
          className={`w-1/4 p-1 flex flex-col text-center m-2 border-2 rounded-xl justify-between ${getModeStyle(
            2
          )}`}
        >
          <div>
            <h1 className="mt-1 font-tenada text-2xl ">선호하는 분위기👀</h1>
            <div className="">
              {[...moodTagCounts]
                .sort((a, b) => b[1] - a[1])
                .map(([tag, count], index) => (
                  <div
                    key={index}
                    className="bg-gray-200 flex justify-between items-center w-5/6 mx-auto my-2 py-2 rounded-lg font-tenada"
                  >
                    <span className="text-lg font-semibold ml-2">{`${
                      index + 1
                    }. `}</span>
                    <h1 className="flex-grow text-center text-xl">{`#${tag}`}</h1>
                    <p className="bg-green-400 font-semibold text-white mr-3 w-7 h-7 text-center rounded-full flex items-center justify-center">
                      {count}
                    </p>
                  </div>
                ))}
            </div>
          </div>
          {roomMode === 2 && (
            <button
              onClick={handleReady}
              className="w-2/3 mx-auto mb-2 font-tenada py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 duration-150 ease-in-ou hover:scale-105 transition-all"
            >
              선택 완료
            </button>
          )}
        </div>
        <div
          onClick={() => handleClick(3)}
          className={`w-2/4 p-1 flex flex-col text-center m-2 border-2 rounded-xl justify-between ${getModeStyle(
            3
          )}`}
        >
          <div>
            <h1 className="mt-1 font-tenada text-2xl ">가고 싶은 장소💫</h1>
            <div className="grid grid-cols-3 gap-4">
              {allUserPlayerHand.selectedPlace?.map((place, index) => (
                <div
                  key={index}
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
              className="w-2/3 mx-auto mb-2 font-tenada py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 duration-150 ease-in-ou hover:scale-105 transition-all"
            >
              선택 완료
            </button>
          )}
        </div>
        <div
          onClick={() => handleClick(4)}
          className={`w-1/4 p-1 flex flex-col text-center m-2 border-2 rounded-xl justify-between ${getModeStyle(
            4
          )}`}
        >
          <div>
            <h1 className="mt-1 font-tenada text-2xl ">최종 목적지⛳️</h1>
            <ul className="">
              {allUserPlayerHand.finalPlace?.map((Place, index) => (
                <li
                  key={index}
                  className="bg-white shadow-2xl flex justify-between items-center w-5/6 mx-auto my-2 py-2 rounded-lg font-tenada"
                >
                  <span className="text-lg font-semibold ml-2">{`${
                    index + 1
                  }. `}</span>
                  <h1 className="ml-2 p-1 flex-grow text-center text-xl truncate">{`${Place.name}`}</h1>
                </li>
              ))}
            </ul>
          </div>
          {roomMode === 4 && (
            <button
              onClick={handleReady}
              className="w-2/3 mx-auto mb-2 font-tenada py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 duration-150 ease-in-ou hover:scale-105 transition-all"
            >
              선택 완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerHand;

// <div className=" justify-end flex col-span-3 gap-2 ">
// {playerHand.selectedPlace.map((place, index) => (
//   <div
//     className="h-full"
//     onDragStart={(e) => handleDragStart(e, place)}
//     onDragEnd={handleDragEnd}
//     onDragLeave={handleDragLeave}
//     key={index}
//   >
//     <PlaceCard place={place} />
//   </div>
// ))}
// </div>

// const handleDrop = (event) => {
//   event.preventDefault();

//   const restaurantData = event.dataTransfer.getData("restaurant");
//   const parsedRestaurantData = JSON.parse(restaurantData);
//   console.log(parsedRestaurantData);
//   if (restaurantData) {
//     setPlayerHand((prevHand) => ({
//       ...prevHand,
//       selectedPlace: [...prevHand.selectedPlace, parsedRestaurantData],
//     }));
//   }
// };

// const handleDragEnd = (event) => {
//   console.log("handleDragEnd");
// };

// const handleDragOver = (event) => {
//   event.preventDefault();
// };

// const handleDragLeave = (event) => {
//   event.preventDefault();
// };
