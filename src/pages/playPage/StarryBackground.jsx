import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const StarryBackground = ({
  restaurantList,
  resultFoodTags,
  resultMoodTags,
  resultPlaceTags,
  selectedCombineList,
}) => {
  const [stars, setStars] = useState([]);
  const handleDragStart = (event, restaurant) => {
    console.log(restaurant);
    const restaurantData = JSON.stringify({
      restId: restaurant.id,
      thumbnailURL: restaurant.FoodUrl,
    });

    event.dataTransfer.setData("restaurant", restaurantData);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prevStars) =>
        prevStars.map((star) => ({
          ...star,
          isTwinkling: Math.random() < 0.5, // Randomly determine if the star should twinkle
        }))
      );
    }, 1000); // Adjust the interval as needed

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const starsData = restaurantList.map((restaurant) => {
      const matchesResultTag = resultFoodTags.includes(restaurant.category);
      let foodTagVisibilityClass = matchesResultTag ? "" : "hidden";
      const matchesResultMoodTag = restaurant.mood.some((mood) =>
        resultMoodTags.includes(mood)
      );
      let moodTagVisibilityClass = matchesResultMoodTag ? "" : "hidden";

      const combineListMatch = selectedCombineList.find(
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
        className = `w-4 h-4 hover:bg-yellow-200 rounded-full cursor-pointer duration-500 `;
      } else if (matchesResultTag) {
        className = `w-4 h-4 hover:bg-yellow-200 rounded-full cursor-pointer duration-500`;
      } else {
        className = `w-4 h-4 hover:bg-yellow-200 rounded-full cursor-pointer duration-500 `;
      }

      return {
        id: restaurant.restId,
        x: getRandomInt(5, 95),
        y: getRandomInt(5, 95),
        className: className,
        size: size,
        imageUrl: imageUrl,
        miniStarUrl: restaurant.miniStarUrl,
        BigStarUrl: restaurant.BigStarUrl,
        FoodUrl: restaurant.FoodUrl,
      };
    });

    setStars(starsData);
  }, [restaurantList, resultFoodTags, resultMoodTags, selectedCombineList]);

  return (
    <div className=" flex-grow bg-black relative border-4 border-dashed">
      {stars.map((star, i) => (
        <div
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
          {/* <div className=" text-yellow-400 ">
            <FontAwesomeIcon icon={faStar} />
          </div> */}
        </div>
      ))}
    </div>
  );
};
