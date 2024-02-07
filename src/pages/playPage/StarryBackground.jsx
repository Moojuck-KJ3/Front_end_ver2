import { useEffect, useState } from "react";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const StarryBackground = ({
  restaurantList,
  resultTags,
  resultMoodTags,
}) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const starsData = restaurantList.map((restaurant) => {
      // Check if the restaurant's category matches the result tags
      const matchesResultTag = resultTags.includes(restaurant.category);
      // Check if the restaurant's category matches the mood result tags
      const matchesResultMoodTag = restaurant.mood.some((mood) =>
        resultMoodTags.includes(mood)
      );
      console.log(matchesResultMoodTag);
      // Determine which image URL to use

      let imageUrl;
      if (matchesResultTag && matchesResultMoodTag) {
        // If both conditions are true, use the FoodUrl
        imageUrl = restaurant.FoodUrl;
        console.log(imageUrl);
      } else if (matchesResultTag) {
        // If only matchesResultTag is true, use the BigStarUrl
        imageUrl = restaurant.BigStarUrl;
      } else {
        // If none are true, default to miniStarUrl
        imageUrl = restaurant.miniStarUrl;
      }

      let size;
      if (matchesResultTag && matchesResultMoodTag) {
        // If both conditions are true, use the FoodUrl
        size = 6;
      } else if (matchesResultTag) {
        // If only matchesResultTag is true, use the BigStarUrl
        size = 4;
      } else {
        // If none are true, default to miniStarUrl
        size = 2;
      }

      return {
        id: restaurant.restId,
        x: getRandomInt(10, 90),
        y: getRandomInt(0, 70),
        size: size,
        imageUrl: imageUrl, // Use the determined image URL
        // You might still want to keep the original URLs for any reason, so they're still included
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
