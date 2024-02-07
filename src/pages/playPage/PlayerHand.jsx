import PlayerHandPlace from "./modeThree/PlayerHandPlace";

const PlayerHand = ({ Hands, playerName, avatarUrl }) => {
  const foodTags = Hands?.foodTag ?? [];
  const placeTag = Hands?.placeTag ?? [];
  const selectedTag = Hands?.selectedTag ?? [];

  const handleDragStart = (event, tag) => {
    const restaurantData = JSON.stringify({
      address: tag.address,
      keyword_list: tag.keyword_list,
      name: tag.name,
      rating: tag.rating,
      restarantId: tag.restarantId,
      thumbnailURL: tag.thumbnailURL,
    });

    event.dataTransfer.setData("tag", restaurantData);
  };

  const renderFoodTags = (tags, label) => (
    <div className="col-span-1 flex flex-col">
      {tags.map((tag, index) => (
        <div
          key={`${label}-${index}`}
          className="m-1 p-1 text-xs bg-blue-200 rounded text-center"
        >
          {`#${tag}`}
        </div>
      ))}
    </div>
  );

  const renderMoodTag = (tags, label) => (
    <div className="col-span-1 flex flex-col">
      {tags.map((tag, index) => (
        <div
          key={`${label}-${index}`}
          className="m-1 p-1 text-xs bg-blue-200 rounded text-center"
        >
          {`#${tag}`}
        </div>
      ))}
    </div>
  );

  const renderPlaceTag = (tags, label) => (
    <div className=" col-span-5">
      <div className=" flex flex-wrap gap-4 m-1">
        {tags.map((tag, index) => (
          <div
            key={index}
            id={tag.restarantId}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, tag)}
          >
            <PlayerHandPlace imgUrl={tag.thumbnailURL} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-2/3 h-[140px] absolute bottom-2 flex justify-center bg-white border-1 border-gray-200 shadow-md rounded-lg mx-10">
      <div className="w-full bg-gray-100 border-2 m-2 rounded-md shadow-inner p-2 grid grid-cols-8 justify-center items-center ">
        {renderMoodTag(placeTag, "장소 태그")}

        <div className=" absolute right-10 flex flex-col items-center justify-center">
          <img
            src={avatarUrl}
            alt={`${playerName} avatar`}
            className="w-14 h-14 rounded-full border-2 border-gray-300 shadow"
          />
          <p className="mt-2 text-sm">{playerName}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerHand;

// {/* Container for trump indicator and cards */}
// <div className="flex items-center z-10 w-full">
//   <div className="flex -ml-2">
//     {cards.map((card, index) => (
//       <Card
//         key={index}
//         suit={card.suit}
//         rank={card.rank}
//         className="shadow-lg"
//       />
//     ))}
//   </div>
// </div>
