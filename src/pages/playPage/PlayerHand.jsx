import { useState } from "react";
import PlaceCard from "./modeThree/card/PlaceCard";

const PlayerHand = ({ Hands, playerName, avatarUrl }) => {
  const [placeList, setPlaceList] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (event, restaurant) => {
    setIsDragging(true);
    console.log("handleDragStart");
    const restaurantData = JSON.stringify({
      id: restaurant.id,
      thumbnailURL: restaurant.FoodUrl,
    });

    event.dataTransfer.setData("restaurant", restaurantData);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const restaurantData = event.dataTransfer.getData("restaurant");
    const parsedRestaurantData = JSON.parse(restaurantData);

    if (restaurantData) {
      setPlaceList((prev) => [...prev, parsedRestaurantData]);
    }
  };

  const handleDragEnd = (event) => {
    console.log("handleDragEnd");
    setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
  };

  return (
    <div className="w-2/3 h-[200px] mt-4 flex justify-center bg-white border-1 border-gray-200 shadow-md rounded-lg mx-10">
      <div
        className="w-full bg-gray-100 border-2 m-2 rounded-md shadow-inner p-2 grid grid-cols-8 gap-2 justify-items-center items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 mt-10 mb-52 mx-40 rounded-xl grid grid-cols-3 items-center justify-center text-lg font-semibold ">
            <div>
              <img src="/음식돋보기.png" alt="" />
            </div>
            <div>안녕</div>
            <div>안녕</div>
          </div>
        )}
        {placeList.map((place, index) => (
          <div
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
  );
};

export default PlayerHand;

// {/* Container for trump indicator and cards */}
// <div className="flex items-center z-10 w-full">
//   <div className="flex -ml-2">
//     {cards.map((card, index) => (
//       <Card
//         key={index}
//         suit={card.suit}
//         rank={card.rank}
//         className="shadow-lg"
//       />
//     ))}
//   </div>
// </div>
