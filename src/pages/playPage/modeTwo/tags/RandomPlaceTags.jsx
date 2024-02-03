import { useEffect, useState } from "react";
import TagCard from "./TagCard";
import { tagNames } from "./tagName";

import { getMoodKeyword, postMoodKeywordButton } from "../../../../api";
import { useSelector } from "react-redux";

const RandomPlaceTags = ({ onCardClick }) => {
  const [tags, setTags] = useState([]);
  const roomId = useSelector((state) => state.roomId);

  const handleCardClick = (type, card) => {
    onCardClick(type, card);
  };
  // Function to get 12 random tags
  const getRandomTags = () => {
    const shuffledTags = [...tagNames].sort(() => 0.5 - Math.random());
    return shuffledTags.slice(0, 12);
  };

  useEffect(() => {
    const getMoodKeywords = async (roomId) => {
      const response = await getMoodKeyword(roomId);

      if (response.error) {
        console.log(response.exception);
      } else {
        // 가져온 수식어들을 태그처럼 활용할 예정
        console.log(response.moodKeywords);
        setTags(response.moodKeywords);
      }
    };

    getMoodKeywords(roomId);

    //setTags(getRandomTags());
  }, []);

  const handleTagClick = (tag) => {
    const data = {
      keywordId: tag.id,
      isDelete: false,
    };

    postMoodKeywordButton(roomId, data);
  };

  return (
    <div className="w-3/4 flex border-1 shadow-md rounded-lg mx-10 bg-white justify-center ">
      <div className="w-full bg-gray-100 m-3 rounded-md shadow-md justify-center items-center flex ">
        <div className="grid grid-cols-4 gap-3 p-10">
          {tags.map((tag, i) => (
            <button key={i} onClick={() => handleCardClick("placeTag", tag)}>
              <TagCard data={tag} handleClick={handleTagClick} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RandomPlaceTags;
