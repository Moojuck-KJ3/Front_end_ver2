import { createRef, useEffect, useState } from "react";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const StarryBackground = ({
  restaurantList,
  resultTags,
  resultMoodTags,
  combineList,
}) => {
  const [stars, setStars] = useState([]);

  const handleDragStart = (event, restaurant) => {
    const restaurantData = JSON.stringify({
      restId: restaurant.restId,
      thumbnailURL: restaurant.FoodUrl,
    });

    event.dataTransfer.setData("restaurant", restaurantData);
  };

  useEffect(() => {
    const starsData = restaurantList.map((restaurant) => {
      const matchesResultTag = resultTags.includes(restaurant.category);
      const matchesResultMoodTag = restaurant.mood.some((mood) =>
        resultMoodTags.includes(mood)
      );

      const combineListMatch = combineList.find(
        (combineItem) => combineItem.restId === restaurant.restId
      );

      let imageUrl;
      if (combineListMatch) {
        imageUrl = combineListMatch.thumbnailURL;
      } else if (matchesResultTag && matchesResultMoodTag) {
        imageUrl = restaurant.FoodUrl;
      } else if (matchesResultTag) {
        imageUrl = restaurant.BigStarUrl;
      } else {
        imageUrl = restaurant.miniStarUrl;
      }

      let size;
      if (combineListMatch) {
        size = 6;
      } else if (matchesResultTag && matchesResultMoodTag) {
        size = 6;
      } else if (matchesResultTag) {
        size = 4;
      } else {
        size = 2;
      }

      let className;
      if (combineListMatch) {
        className = "w-4 h-4 rounded-full cursor-pointer duration-500";
      } else if (matchesResultTag && matchesResultMoodTag) {
        className =
          "w-4 h-4 hover:bg-yellow-200 rounded-full cursor-pointer duration-500";
      } else if (matchesResultTag) {
        className =
          "w-4 h-4 hover:bg-yellow-200 rounded-full cursor-pointer duration-500";
      } else {
        className =
          "w-4 h-4 hover:bg-yellow-200 rounded-full cursor-pointer duration-500";
      }

      return {
        id: restaurant.restId,
        x: getRandomInt(10, 90),
        y: getRandomInt(0, 70),
        className: className,
        size: size,
        imageUrl: imageUrl,
        miniStarUrl: restaurant.miniStarUrl,
        BigStarUrl: restaurant.BigStarUrl,
        FoodUrl: restaurant.FoodUrl,
        ref: createRef(),
      };
    });

    setStars(starsData);
  }, [restaurantList, resultTags, resultMoodTags, combineList]);

  return (
    <div
      className="bg-black border-2 border-dashed border-spacing-4 rounded-xl relative w-full h-full
    "
    >
      {stars.map((star, i) => (
        <div
          ref={star.ref}
          className={star.className}
          key={i}
          id={star.id}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, star)}
          style={{
            position: "absolute",
            top: `${star.y}%`,
            left: `${star.x}%`,
            transform: `scale(${star.size})`,
          }}
        >
          <img
            className="rounded-full object-cover"
            src={star.imageUrl}
            alt=""
          />
        </div>
      ))}
    </div>
  );
};
