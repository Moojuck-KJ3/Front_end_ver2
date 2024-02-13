import PlaceCard from "./modeThree/card/PlaceCard";

const PlayerHand = ({
  playerHand,
  setPlayerHand,
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
      restId: restaurant.id,
      // name: restaurant.name,
      thumbnailURL: restaurant.FoodUrl,
      // category: restaurant.category,
    });
    console.log(restaurantData);

    event.dataTransfer.setData("restaurant", restaurantData);
    console.log(restaurantData);
  };

  const handleClick = (i) => {
    setRoomMode(i);
  };

  const handleReady = () => {
    handleSetReady();
  };

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
              {playerHand.selectedFoodTag?.map((tag, index) => (
                <li
                  key={index}
                  className="bg-gray-200 w-5/6 mx-auto my-2 py-2 text-center rounded-lg font-tenada"
                >{`#${tag}`}</li>
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
            <ul className="">
              {playerHand.selectedMoodTag?.map((tag, index) => (
                <li
                  key={index}
                  className="bg-gray-200 w-5/6 mx-auto my-2 py-2 text-center rounded-lg font-tenada"
                >{`#${tag}`}</li>
              ))}
            </ul>
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
            <h1 className="mt-1 font-tenada text-2xl ">조합하고 싶은 장소💫</h1>
            <div className="grid grid-cols-3">
              {playerHand.selectedPlace?.map((place, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(event) => handleDragStart(event, place)}
                >
                  <PlaceCard place={place} />
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
          <h1 className="mt-1 font-tenada text-2xl ">최종 목적지⛳️</h1>
          <ul className="">
            {/* {playerHand.selectedMoodTag?.map((tag, index) => (
              <li
                key={index}
                className="bg-gray-200 w-full my-2 text-center rounded-lg font-tenada"
              >{`#${tag}`}</li>
            ))} */}
          </ul>
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
