import { useEffect, useState } from "react";
import ResultCard from "./ResultCard";
import ShowDetailWithLikeModal from "../../../../components/modal/ShowDetailWithLikeModal";
import { useSocket } from "../../../../realtimeComunication/SocketContext";
import { useParams } from "react-router-dom";

const ResultCardLists = ({ combinedplaceList, positions }) => {
  const socket = useSocket();
  console.log("ResultCardLists", combinedplaceList);
  const [places, setPlaces] = useState(combinedplaceList);
  const { roomId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const handleCardClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    console.log(selectedRestaurant);

    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("like-updated", (data) => {
      console.log("like-updated", data.restId);
      console.log("like-updated", data.likes);
      setPlaces((currentPlaces) =>
        currentPlaces.map((place) =>
          place._id === data.restId ? { ...place, likes: data.likes } : place
        )
      );
    });

    return () => {
      socket.off("like-updated");
    };
  }, [socket]);

  const handleLike = (restaurantId) => {
    console.log("handleLike is called", restaurantId);
    const restaurant = places.find((place) => place._id === restaurantId);
    const updatedLikes = restaurant.likes + 1;

    socket.emit("like-restaurant", {
      restId: restaurantId,
      roomId: roomId,
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
            <ResultCard place={place} />
          </div>
        ))}
      </div>
      {isModalOpen && (
        <ShowDetailWithLikeModal
          restaurant={selectedRestaurant}
          closeModal={() => setIsModalOpen(false)}
          onLike={() => handleLike(selectedRestaurant._id)}
        />
      )}
    </>
  );
};

export default ResultCardLists;
