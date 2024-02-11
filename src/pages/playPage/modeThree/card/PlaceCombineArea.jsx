import { useState } from "react";
import BigPlaceCard from "./BigPlaceCard";

const PlaceCombineArea = ({ onSetData }) => {
  const [draggedTag, setDraggedTag] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event) => {
    setDraggedTag(null);

    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const restaurantData = event.dataTransfer.getData("restaurant");
    const parsedRestaurantData = JSON.parse(restaurantData);
    if (parsedRestaurantData) {
      console.log("parsedRestaurantData", parsedRestaurantData);
      setDraggedTag(parsedRestaurantData);
      onSetData(parsedRestaurantData);
    }

    setIsDragging(false);
  };

  return (
    <div
      className={`w-2/3 h-full flex flex-col justify-center items-center my-4 bg-white shadow-lg border-dashed border-2 min-h-40 border-black ${
        isDragging ? "additional-styles-if-dragging" : ""
      }`}
      onDragOver={handleDragOver}
      onDrop={(event) => handleDrop(event)}
    >
      {draggedTag ? (
        <BigPlaceCard img={"/돈까스.png"} />
      ) : (
        <div className="text-center">여기에 올리기</div>
      )}
    </div>
  );
};

export default PlaceCombineArea;
