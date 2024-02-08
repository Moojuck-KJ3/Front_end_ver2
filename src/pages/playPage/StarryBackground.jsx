import { useEffect, useState } from "react";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const StarryBackground = ({
  restaurantList,
  resultTags,
  resultMoodTags,
}) => {
  const [stars, setStars] = useState([]);
  const [draggingId, setDraggingId] = useState(null);

  const handleDragStart = (event, restaurant) => {
    const restaurantData = JSON.stringify({
      id: restaurant.id,
      thumbnailURL: restaurant.FoodUrl,
    });

    event.dataTransfer.setData("restaurant", restaurantData);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    // Optionally, you can handle drag enter event if needed
    // console.log("handleDragEnter");
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow the drop event
    // Optionally, you can handle drag over event if needed
    // console.log("handleDragOver");
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    // Optionally, reset or handle drag leave event if needed
    // console.log("handleDragLeave");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    // const restaurantData = event.dataTransfer.getData("restaurant");
    // const restaurant = JSON.parse(restaurantData);
    // console.log(restaurant);
    // console.log("handleDrop");
  };

  const handleDragEnd = (event) => {
    // setDraggingId(null);
  };

  useEffect(() => {
    const starsData = restaurantList.map((restaurant) => {
      const matchesResultTag = resultTags.includes(restaurant.category);
      const matchesResultMoodTag = restaurant.mood.some((mood) =>
        resultMoodTags.includes(mood)
      );

      let imageUrl;
      if (matchesResultTag && matchesResultMoodTag) {
        imageUrl = restaurant.FoodUrl;
        console.log(imageUrl);
      } else if (matchesResultTag) {
        imageUrl = restaurant.BigStarUrl;
      } else {
        imageUrl = restaurant.miniStarUrl;
      }

      let size;
      if (matchesResultTag && matchesResultMoodTag) {
        size = 6;
      } else if (matchesResultTag) {
        size = 4;
      } else {
        size = 2;
      }

      return {
        id: restaurant.restId,
        x: getRandomInt(10, 90),
        y: getRandomInt(0, 70),
        size: size,
        imageUrl: imageUrl,
        miniStarUrl: restaurant.miniStarUrl,
        BigStarUrl: restaurant.BigStarUrl,
        FoodUrl: restaurant.FoodUrl,
      };
    });

    setStars(starsData);
  }, [restaurantList, resultTags, resultMoodTags]);

  return (
    <div
      className="bg-black border-2 border-dashed border-spacing-4 rounded-xl relative w-full h-full
    "
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {stars.map((star, i) => (
        <div
          className="w-4 h-4 hover:bg-yellow-200 rounded-full cursor-pointer duration-500"
          key={i}
          id={star.id}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, star)}
          onDragEnd={handleDragEnd} // Add this line to handle drag end
          style={{
            position: "absolute",
            top: `${star.y}%`,
            left: `${star.x}%`,
            transform: `scale(${star.size})`,
          }}
        >
          <img src={star.imageUrl} alt="" />
        </div>
      ))}

      {draggingId && (
        // This div is the new drop area that shows up when dragging
        <div
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-gray-700"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
        >
          <div className="text-white text-center">Drop here!</div>
        </div>
      )}
    </div>
  );
};
