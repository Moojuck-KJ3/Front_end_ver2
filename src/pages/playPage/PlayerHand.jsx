import { useState } from "react";
import PlaceCard from "./modeThree/card/PlaceCard";

const PlayerHand = ({ handList, onSetHandList }) => {
  const handleDragStart = (event, restaurant) => {
    console.log(restaurant);
    console.log("handleDragStart");
    const restaurantData = JSON.stringify({
      restId: restaurant.restId,
      name: restaurant.name,
      thumbnailURL: restaurant.thumbnailURL,
      category: restaurant.category,
    });

    event.dataTransfer.setData("restaurant", restaurantData);
    console.log(restaurantData);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const restaurantData = event.dataTransfer.getData("restaurant");
    const parsedRestaurantData = JSON.parse(restaurantData);

    if (restaurantData) {
      onSetHandList((prev) => [...prev, parsedRestaurantData]);
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
        className="w-full bg-gray-100 border-2 m-2 rounded-md shadow-inner p-2 flex gap-2 justify-items-center items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {handList.map((place, index) => (
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

// {isDragging && (
//   <div className="absolute inset-0 mt-10 mb-52 mx-40 rounded-xl grid grid-cols-3 items-center justify-center text-lg font-semibold ">
//     <div>안녕</div>
//     <div>안녕</div>
//     <div>안녕</div>
//   </div>
// )}
