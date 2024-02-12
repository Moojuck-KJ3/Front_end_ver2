import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

/*
star: {
id: restaurant.restId,
        title: "토니모리",
        x: getRandomInt(10, 90),
        y: getRandomInt(10, 90),
        className: className,
        size: size,
        imageUrl: imageUrl,
        miniStarUrl: restaurant.miniStarUrl,
        BigStarUrl: restaurant.BigStarUrl,
        FoodUrl: restaurant.FoodUrl,
}
*/

const Star = ({ star, hoveredStarId, handleStarClick, setHoveredStarId }) => {
  const handleMouseEnter = () => {
    setHoveredStarId(star.id);
  };

  const handleMouseLeave = () => {
    setHoveredStarId(null);
  };

  return (
    <div
      className={`${star.className} relative`}
      style={{
        position: "absolute",
        top: `${star.y}%`,
        left: `${star.x}%`,
        transform: `scale(${star.size})`,
      }}
      onClick={() => handleStarClick(star)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="text-yellow-400">
        <FontAwesomeIcon icon={faStar} />
      </div>
      {hoveredStarId === star.id && (
        <div
          className="animate-fade  absolute z-10  items-center justify-center inline-block px-3 py-2 text-sm font-medium text-black bg-white rounded-lg shadow-sm -translate-x-1/2 left-1/2 bottom-full mb-2 "
          style={{
            transition: "opacity 300ms",
            opacity: 1,
            whiteSpace: "nowrap",
          }}
        >
          <h1 className="font-tenada">{star.title}</h1>
        </div>
      )}
    </div>
  );
};

export default Star;
