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
];

const ResultCardLists = ({ combinedplaceList }) => {
  console.log("ResultCardLists", combinedplaceList);
  const [places, setPlaces] = useState(DUMMY_PLACE);
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
          place.id === updatedPlace.id
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
    const restaurant = places.find((place) => place.id === restaurantId);
    const updatedLikes = restaurant.likes + 1;

    socket.emit("like-restaurant", {
      restId: restaurantId,
      likes: updatedLikes,
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <ul className="flex gap-10 roun">
        <li
          id={places[0].id}
          onClick={() => handleCardClick(places[0])}
          key={0}
          className="animate-fade animate-ease-in"
          style={{ animationDelay: `${0.5 * 1}s` }}
        >
          <ResultCard
            title={places[0].title}
            imgUrl={places[0].imgUrl}
            id={places[0].id}
            likesCount={places[0].likes}
          />
        </li>
        <li
          id={places[1].id}
          onClick={() => handleCardClick(places[1])}
          key={1}
          className="animate-fade animate-ease-in"
          style={{ animationDelay: `${0.5 * 2}s` }}
        >
          <ResultCard
            title={places[1].title}
            imgUrl={places[1].imgUrl}
            id={places[1].id}
            likesCount={places[1].likes}
          />
        </li>
        <li
          id={places[2].id}
          onClick={() => handleCardClick(places[2])}
          key={2}
          className="animate-fade animate-ease-in"
          style={{ animationDelay: `${0.5 * 3}s` }}
        >
          <ResultCard
            title={DUMMY_PLACE[2].title}
            imgUrl={DUMMY_PLACE[2].imgUrl}
            id={places[2].id}
            likesCount={places[2].likes}
          />
        </li>
        <li
          id={places[3].id}
          onClick={() => handleCardClick(places[3])}
          key={3}
          className="animate-fade animate-ease-in"
          style={{ animationDelay: `${0.5 * 2}s` }}
        >
          <ResultCard
            title={places[3].title}
            imgUrl={places[3].imgUrl}
            id={places[3].id}
            likesCount={places[3].likes}
          />
        </li>
        <li
          id={places[4].id}
          onClick={() => handleCardClick(places[4])}
          key={4}
          className="animate-fade animate-ease-in"
          style={{ animationDelay: `${0.5 * 1}s` }}
        >
          <ResultCard
            title={places[4].title}
            imgUrl={places[4].imgUrl}
            id={places[4].id}
            likesCount={places[4].likes}
          />
        </li>
      </ul>
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
