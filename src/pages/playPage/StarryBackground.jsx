import { useEffect, useState } from "react";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const StarryBackground = ({
  restaurantList,
  resultTags,
  resultMoodTags,
}) => {
  const [stars, setStars] = useState([]);

  const handleDragStart = (event, restaurant) => {
    console.log(restaurant);
    const restaurantData = JSON.stringify({
      id: restaurant.id,
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
    <div className="bg-black border-2 border-dashed border-spacing-4 rounded-xl relative w-full h-full">
      {stars.map((star, i) => (
        <div
          className="w-4 h-4 hover:bg-yellow-200 rounded-full cursor-pointer duration-500"
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
          <img src={star.imageUrl} alt="" />
        </div>
      ))}
    </div>
  );
};
