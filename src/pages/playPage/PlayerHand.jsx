import PlaceCard from "./modeThree/card/PlaceCard";

const PlayerHand = ({ handList, onSetHandList }) => {
  const handleDragStart = (event, restaurant) => {
    console.log("handleDragStart");
    const restaurantData = JSON.stringify({
      restId: restaurant.restId,
      // name: restaurant.name,
      thumbnailURL: restaurant.thumbnailURL,
      // category: restaurant.category,
    });
    console.log(restaurantData);

    event.dataTransfer.setData("restaurant", restaurantData);
    console.log(restaurantData);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const restaurantData = event.dataTransfer.getData("restaurant");
    const parsedRestaurantData = JSON.parse(restaurantData);
    console.log(parsedRestaurantData);
    if (restaurantData) {
      onSetHandList((prevHand) => ({
        ...prevHand,
        selectedPlace: [...prevHand.selectedPlace, parsedRestaurantData],
      }));
    }
  };

  const handleDragEnd = (event) => {
    console.log("handleDragEnd");
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
  };

  return (
    <div className="w-2/3 h-[260px] mt-2 mb-2 flex justify-center bg-white border-1 border-gray-200 shadow-md rounded-lg mx-10">
      <div
        className="w-full bg-gray-100 border-2 m-2 rounded-md shadow-inner p-2 grid grid-cols-5 items-center  "
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="col-span-1 flex flex-col justify-center items-center">
          <ul>
            {handList.selectedFoodTag.map((tag, index) => (
              <li key={index}>음식 태그</li>
            ))}
          </ul>
        </div>
        <div className="col-span-1 flex flex-col justify-center items-center">
          <ul className="">
            {handList.selectedMoodTag.map((tag, index) => (
              <li key={index}>분위기 태그</li>
            ))}
          </ul>
        </div>

        <div className=" justify-end flex col-span-3 gap-2 ">
          {handList.selectedPlace.map((place, index) => (
            <div
              className="h-full"
              onDragStart={(e) => handleDragStart(e, place)}
              onDragEnd={handleDragEnd}
              onDragLeave={handleDragLeave}
              key={index}
            >
              <PlaceCard place={place} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerHand;
