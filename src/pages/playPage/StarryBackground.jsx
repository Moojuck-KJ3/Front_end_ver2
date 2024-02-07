import { useEffect, useState } from "react";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const restaurantLists = [
  {
    id: 1,
    name: "토리모리",
  },
];

export const StarryBackground = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const chosenTags = Array.from({ length: 100 }, () => {
      const randomIndex = getRandomInt(0, restaurantLists.length - 1);
      return restaurantLists[randomIndex];
    });

    const initialTags = chosenTags.map((tagName, i) => ({
      id: i.toString(),
      title: tagName,
      x: getRandomInt(10, 90),
      y: getRandomInt(0, 70),
      size: getRandomInt(1, 3),
      isFixed: false,
    }));
    setList(initialTags);

    return () => clearInterval(initialTags); // Cleanup the interval when the component unmounts
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {" "}
      {/* Ensure overflow is hidden */}
      {list.map((tag, i) => (
        <div
          className="w-5 h-5 hover:bg-yellow-200 rounded-full cursor-pointer duration-500"
          key={i}
          style={{
            position: "absolute",
            top: `${tag.y}%`, // Directly use tag.y
            left: `${tag.x}%`, // Directly use tag.x
          }}
        >
          <img src="/Star_2.png" alt="" />
        </div>
      ))}
    </div>
  );
};
