import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import PlayerHand from "./PlayerHand";
import ModeThreeCombineArea from "./modeThree/card/ModeThreeCombineArea";
import ShowDetailModal from "../../components/modal/ShowDetailModal";
import FinalRestaurantDetails from "./FinalRestaurantDetails";
import { useSocket } from "../../realtimeComunication/SocketContext";
import { useParams } from "react-router-dom";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const PlaceListArea = ({
  restaurantList,
  allUserSelectedFoodTags,
  allUserSelectedMoodTags,
  allUserSelectedPlaceTags,
  playerHand,
  setPlayerHand,
  allUserPlayerHand,
  setAllUserPlayerHand,
  roomMode,
  setRoomMode,
  handleSetReady,
  roomDetail,
  imgUrls,
  modeTwoResultRestList,
}) => {
  const socket = useSocket();
  const [stars, setStars] = useState([]);
  const [hoveredStarId, setHoveredStarId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const { roomId } = useParams();

  const handleStarClick = (star) => {
    setSelectedRestaurant(star);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const addToPlayerHand = (selectedRestaurant) => {
    setPlayerHand((prevPlayerHand) => {
      const updatedHand = {
        ...prevPlayerHand,
        selectedPlace: [...prevPlayerHand.selectedPlace, selectedRestaurant],
      };
      return updatedHand;
    });
    console.log("select-restaurant is emitted");
    console.log({ roomId, selectedRestaurant });
    socket.emit("select-restaurant", { roomId, selectedRestaurant });
    closeModal();
  };

  let content;
  if (roomMode === 3) {
    content = <ModeThreeCombineArea roomDetail={roomDetail} />;
  } else if (roomMode === 4) {
    content = <FinalRestaurantDetails allUserPlayerHand={allUserPlayerHand} />;
  } else {
    // Content for other roomModes
    content = stars.map((star, i) => (
      <div
        onClick={() => handleStarClick(star)}
        onMouseEnter={() => setHoveredStarId(star._id)}
        onMouseLeave={() => setHoveredStarId(null)}
        className={`${star.className} relative animate-fade ${
          !star.signatureUrl && roomMode === 2
            ? "animate-opacityPulse moveToBottomRight"
            : ""
        }`}
        key={i}
        id={star._id}
        style={{
          position: "absolute",
          top: `${star.y}%`,
          left: `${star.x}%`,
          transform: `scale(${star.size})`,
          opacity: !star.signatureUrl && roomMode === 2 ? 0 : 1,
          pointerEvents: !star.signatureUrl && roomMode === 2 ? "none" : "auto",
        }}
      >
        <div className={`absolute w-20.5 h-20.5 bg-white`}></div>
        <div className="text-yellow-400">
          {star.signatureUrl ? (
            <div className="w-20 h-20 animate-jump-in">
              <img src={star.signatureUrl} alt="" />
            </div>
          ) : (
            <div className="w-6 h-6 hover:bg-yellow-200 rounded-full cursor-pointer duration-500 opacity-70">
              {<FontAwesomeIcon icon={faStar} />}
            </div>
          )}
        </div>
        {hoveredStarId === star._id && (
          <div
            className="animate-fade absolute items-center justify-center inline-block px-3 py-2 font-2xl font-medium text-black bg-white rounded-lg shadow-sm -translate-x-1/2 left-1/2 bottom-full mb-2 "
            style={{
              transition: "opacity 300ms",
              opacity: 1,
              whiteSpace: "nowrap",
            }}
          >
            <h1 className="font-tenada ">{star.name}</h1>
            <img
              className="rounded-lg"
              src={star.thumbnailImg}
              alt="thumbnailImg"
            />
          </div>
        )}
      </div>
    ));
  }

  useEffect(() => {
    const starsData = restaurantList.map((restaurant) => {
      const matchesResultTag = allUserSelectedFoodTags.some((tag) =>
        restaurant.food_category.startsWith(tag)
      );

      let imageUrl = null;
      const targetNames = allUserSelectedFoodTags.filter((tag) =>
        restaurant.food_category.startsWith(tag)
      );

      if (targetNames.length > 0) {
        imageUrl = imgUrls.find((img) => img.name === "큰별");
      }

      let matchesResultMoodTag = true;
      if (roomMode === 2) {
        console.log("modeTwoResultRestList", modeTwoResultRestList);
        if (matchesResultTag && restaurant.moodKeywords !== undefined) {
          matchesResultMoodTag = restaurant.moodKeywords?.some((moodKeyword) =>
            allUserSelectedMoodTags.includes(moodKeyword)
          );

          const restaurantExistsInModeTwoResult =
            modeTwoResultRestList.includes(restaurant.id);

          if (restaurantExistsInModeTwoResult) {
            const tempImgUrl = imgUrls.find((img) =>
              targetNames.some((name) => img.name === name)
            );

            if (tempImgUrl) {
              imageUrl = tempImgUrl;
            }
          }
        } else {
          matchesResultMoodTag = false;
        }
      }

      return {
        ...restaurant,
        size: 1,
        x: getRandomInt(5, 90),
        y: getRandomInt(5, 90),
        signatureUrl: imageUrl?.imgUrl,
      };
    });

    setStars(starsData);
  }, [restaurantList, allUserSelectedFoodTags, allUserSelectedMoodTags]);

  return (
    <div className="flex flex-col flex-grow bg-white border-8 rounded-2xl">
      <div className="w-full h-2/3 justify-center items-center bg-black rounded-2xl relative">
        {content}
      </div>
      <PlayerHand
        allUserPlayerHand={allUserPlayerHand}
        onSetAllUserPlayerHand={setAllUserPlayerHand}
        roomMode={roomMode}
        setRoomMode={setRoomMode}
        handleSetReady={handleSetReady}
      />
      {isModalVisible && (
        <ShowDetailModal
          restaurant={selectedRestaurant}
          closeModal={closeModal}
          addToPlayerHand={addToPlayerHand}
        />
      )}
    </div>
  );
};
