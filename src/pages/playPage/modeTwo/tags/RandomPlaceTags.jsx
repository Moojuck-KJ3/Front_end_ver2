import { useEffect, useState } from "react";
import TagCard from "./TagCard";
import { tagNames } from "./tagName";

const RandomPlaceTags = () => {
  const [tags, setTags] = useState([]);

  // Function to get 12 random tags
  const getRandomTags = () => {
    const shuffledTags = [...tagNames].sort(() => 0.5 - Math.random());
    return shuffledTags.slice(0, 12);
  };

  useEffect(() => {
    setTags(getRandomTags());
  }, []);

  return (
    <div className="w-3/4 flex border-1 shadow-md rounded-lg mx-10 bg-white justify-center ">
      <div className="w-full bg-gray-100 m-3 rounded-md shadow-md justify-center items-center flex ">
        <ul className="grid grid-cols-4 gap-3 p-10">
          {tags.map((tag, i) => (
            <TagCard key={i} data={tag} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RandomPlaceTags;
