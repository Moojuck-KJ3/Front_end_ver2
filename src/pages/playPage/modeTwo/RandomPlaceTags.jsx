import { useEffect, useState } from "react";
import { tagNames } from "./TagList";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const getRandomColor = () =>
  `rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(
    0,
    255
  )})`;

const RandomPlaceTags = ({ addTagToSideBar }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const chosenTags = Array.from({ length: 28 }, () => {
      const randomIndex = getRandomInt(0, tagNames.length - 1);
      return tagNames[randomIndex];
    });

    const initialTags = chosenTags.map((tagName, i) => ({
      id: i.toString(),
      title: tagName,
      x: getRandomInt(0, 50),
      y: getRandomInt(0, 50),
      size: getRandomInt(1, 3),
      isFixed: false,
    }));
    setTags(initialTags);

    // Move tags to random positions every 3 seconds
    const intervalId = setInterval(() => {
      setTags((prevTags) => {
        return prevTags.map((tag) => ({
          ...tag,
          x: tag.isFixed ? tag.x : getRandomInt(10, 70),
          y: tag.isFixed ? tag.y : getRandomInt(10, 70),
        }));
      });
    }, 4000);

    return () => clearInterval(intervalId); // Cleanup the interval when the component unmounts
  }, []);

  const handleTagClick = (clickedTag) => {
    // Add the clicked tag to the fixed tags
    setTags((prevTags) =>
      prevTags.map((tag) =>
        tag.id === clickedTag.id ? { ...tag, isFixed: true } : tag
      )
    );
    addTagToSideBar(clickedTag);

    setTimeout(() => {
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== clickedTag.id));
    }, 1000);
  };

  const tagLists = [
    { id: "8", title: "포근한", x: 58, y: 2, size: 3 },
    { id: "20", title: "편안한", x: 22, y: 1, size: 3 },
    { id: "15", title: "스타일리쉬한", x: 41, y: 13, size: 3 },
    // Add more tags as needed
    { id: "27", title: "이국적", x: 32, y: 19, size: 3 },
    { id: "3", title: "조그마한", x: 60, y: 25, size: 2 },
    { id: "19", title: "럭셔리한", x: 19, y: 18, size: 2 },
    // Add more tags as needed
  ];

  const handleDeleteTagsList = () => {
    tagLists.forEach((tag) => {
      handleTagClick(tag);
    });
  };

  return (
    <div className="w-full h-full relative">
      <button onClick={handleDeleteTagsList}>삭제</button>
      {tags.map((tag, i) => (
        <div
          className={`w-38 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl ${
            tag.isFixed ? "fixed-tag transition-all opacity-0" : ""
          }`}
          key={i}
          style={{
            position: "absolute",
            top: `${tag.y + i}%`,
            left: `${tag.x + i}%`,
            background: getRandomColor(),
            transform: "translate(-50%, -50%)", // Center the tag
          }}
          onClick={() => handleTagClick(tag)}
        >
          <div className="px-4 py-3">
            <p
              className="font-bold text-black truncate block capitalize text-center"
              style={{
                fontSize: `${tag.size}vw`,
              }}
            >
              {tag.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RandomPlaceTags;
