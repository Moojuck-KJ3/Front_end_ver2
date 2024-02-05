import { useEffect, useRef } from "react";
import TagCard from "./TagCard";

const RandomPlaceTags = ({ onCardClick, tags }) => {
  const recognitionRef = useRef(null);
  const handleCardClick = (type, card) => {
    onCardClick(type, card.name);
  };

  // Function to get 12 random tags
  // const getRandomTags = () => {
  //   const shuffledTags = [...tagNames].sort(() => 0.5 - Math.random());
  //   return shuffledTags.slice(0, 12);
  // };

  useEffect(() => {
    setupSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, []);

  const handleMatchedTag = (type, tag) => {
    onCardClick(type, tag.name);
    // const data = {
    //   keywordId: tag.id,
    //   isDelete: false,
    // };
    // postMoodKeywordButton(roomId, data);
  };

  const setupSpeechRecognition = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = new window.webkitSpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = "ko-KR";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript.trim();
        console.log("Voice Input:", text);
        matchTagByText(text);
      };
      recognitionRef.current.start();

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error", event.error);
      };

      recognitionRef.current.onend = () => {
        // Automatically restart the recognition in case of end
        recognitionRef.current.start();
      };
    }
  };

  const matchTagByText = (spokenText) => {
    const tag = tags.find((tag) =>
      tag.name.toLowerCase().includes(spokenText.toLowerCase())
    );

    if (tag) {
      console.log("Tag is matched");
      handleMatchedTag("placeTag", tag);
    } else {
      console.log("Tag is not matched");
    }
  };

  return (
    <div className="w-3/4 flex border-1 shadow-md rounded-lg mx-10 bg-white justify-center ">
      <div className="w-full bg-gray-100 m-3 rounded-md shadow-md justify-center items-center flex ">
        <div className="grid grid-cols-4 gap-3 p-10">
          {tags.map((tag, i) => (
            <button key={i} onClick={() => handleCardClick("placeTag", tag)}>
              <TagCard data={tag.name} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RandomPlaceTags;
