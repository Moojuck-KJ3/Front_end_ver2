import { useEffect, useState } from "react";
import ResultCard from "./ResultCard";
import ShowDetailWithLikeModal from "../../../../components/modal/ShowDetailWithLikeModal";
import socket from "../../../../realtimeComunication/socket";

export const DUMMY_PLACE = [
  {
    id: "item1",
    title: "토니모리",
    imgUrl: "/초밥.png",
    likes: 0,
  },
  {
    id: "item2",
    title: "역전할맥",
    imgUrl: "/돈까스.png",
    likes: 0,
  },
  {
    id: "item3",
    title: "교촌치킨",
    imgUrl: "/샤브샤브.png",
    likes: 0,
  },
  {
    id: "item4",
    title: "할매국밥",
    imgUrl: "/된장찌개.png",
    likes: 0,
  },
  {
    id: "item5",
    title: "돈까스",
    imgUrl: "/국밥.png",
    likes: 0,
  },
  {
    id: "item6",
    title: "돈까스",
    imgUrl: "/국밥.png",
    likes: 0,
  },
  {
    id: "item7",
    title: "돈까스",
    imgUrl: "/국밥.png",
    likes: 0,
  },
  {
    id: "item8",
    title: "돈까스",
    imgUrl: "/국밥.png",
    likes: 0,
  },
  {
    id: "item9",
    title: "돈까스",
    imgUrl: "/국밥.png",
    likes: 0,
  },
];

const ResultCardLists = ({ combinedplaceList, positions }) => {
  console.log("ResultCardLists", combinedplaceList);
  const [places, setPlaces] = useState(combinedplaceList); //DUMMY_PLACE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleCardClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  useEffect(() => {
    socket.on("likes-updated", (updatedPlace) => {
      setPlaces((currentPlaces) =>
        currentPlaces.map((place) =>
          place._id === updatedPlace._id
            ? { ...place, likes: updatedPlace.likes }
            : place
        )
      );
    });

    return () => {
      socket.off("likes-updated");
    };
  }, []);

  const handleLike = (restaurantId) => {
    console.log("handleLike is called", restaurantId);
    const restaurant = places.find((place) => place._id === restaurantId);
    const updatedLikes = restaurant.likes + 1;

    socket.emit("like-restaurant", {
      restId: restaurantId,
      likes: updatedLikes,
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-3 gap-4">
        {places.map((place, i) => (
          <div
            key={place._id}
            onClick={() => handleCardClick(place)}
            className={`animate-fade animate-ease-in ${
              [0, 2, 4, 6].includes(i) ? "col-start-1" : "col-start-2"
            }`}
            style={{
              animationDelay: `${
                [0, 2, 4, 6].includes(i)
                  ? 0
                  : [1, 3, 5, 7].includes(i)
                  ? 0.5
                  : 1
              }s`,
              position: "absolute",
              left: `${positions[i].x * window.innerWidth - 75}px`,
              top: `${positions[i].y * window.innerHeight - 75}px`,
            }}
          >
            <ResultCard
              // title={place.name}
              // imgUrl={place.thumbnailImg}
              // id={place.id}
              // likesCount={place.likes}
              place={place}
            />
          </div>
        ))}
      </div>
      {isModalOpen && (
        <ShowDetailWithLikeModal
          restaurant={selectedRestaurant}
          closeModal={() => setIsModalOpen(false)}
          onLike={() => handleLike(selectedRestaurant.id)}
        />
      )}
    </>
  );
};

export default ResultCardLists;
