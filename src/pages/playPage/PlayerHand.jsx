import { useState } from "react";
import PlaceCard from "./modeThree/card/PlaceCard";
import { StepProgressBar } from "./StepProgressBar";

const PlayerHand = ({ Hands, playerName, avatarUrl }) => {
  const [placeList, setPlaceList] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (event, restaurant) => {
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

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  return (
    <div className="w-2/3 h-[200px] mt-4 flex justify-center bg-white border-1 border-gray-200 shadow-md rounded-lg mx-10">
      <div
        className="w-full bg-gray-100 border-2 m-2 rounded-md shadow-inner p-2 grid grid-cols-8 gap-2 justify-items-center items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {placeList.map((place, index) => (
          <PlaceCard key={index} place={place} /> // Displaying as images for example
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
