import { useEffect, useState } from "react";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const StarryBackground = ({ restaurantList }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const starsData = restaurantList.map((restaurant) => ({
      id: restaurant.restId,
      x: getRandomInt(10, 90),
      y: getRandomInt(0, 70),
      size: getRandomInt(1, 1.5),
      miniStarUrl: restaurant.miniStarUrl,
      BigStarUrl: restaurant.BigStarUrl,
      FoodUrl: restaurant.FoodUrl,
    }));

    setStars(starsData);
  }, [restaurantList]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {stars.map((star, i) => (
        <div
          className="w-7 h-7 hover:bg-yellow-200 rounded-full cursor-pointer duration-500"
          key={i}
          style={{
            position: "absolute",
            top: `${star.y}%`,
            left: `${star.x}%`,
            transform: `scale(${star.size})`,
          }}
        >
          <img src={star.miniStarUrl} alt="" />
        </div>
      ))}
    </div>
  );
};
