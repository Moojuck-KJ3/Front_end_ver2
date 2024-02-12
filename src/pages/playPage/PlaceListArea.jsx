import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import PlayerHand from "./PlayerHand";
import ModeThreeCombineArea from "./modeThree/card/ModeThreeCombineArea";
import ShowDetailModal from "../../components/modal/ShowDetailModal";
import FinalRestaurantDetails from "./FinalRestaurantDetails";
import Star from "./StarComponent";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const PlaceListArea = ({
  restaurantList,
  resultFoodTags,
  resultMoodTags,
  resultPlaceTags,
  selectedCombineList,
  playerHand,
  setPlayerHand,
  roomMode,
  setRoomMode,
  handleSetReady,
  roomDetail,
}) => {
  const [stars, setStars] = useState([]);
  const [hoveredStarId, setHoveredStarId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleStarClick = (star) => {
    console.log(star);
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

    closeModal();
  };

  let content;
  if (roomMode === 3) {
    content = <ModeThreeCombineArea roomDetail={roomDetail} />;
  } else if (roomMode === 4) {
    content = <FinalRestaurantDetails />;
  } else {
    // Content for other roomModes
    content = stars.map((star, i) => (
      <Star
        key={i}
        star={star}
        handleStarClick={handleStarClick}
        setHoveredStarId={setHoveredStarId}
        hoveredStarId={hoveredStarId}
      ></Star>
    ));
  }

  useEffect(() => {
    const starsData = restaurantList.map((restaurant) => {
      const matchesResultTag = resultFoodTags.includes(restaurant.category);

      const matchesResultMoodTag = restaurant.mood.some((mood) =>
        resultMoodTags.includes(mood)
      );

      const combineListMatch = selectedCombineList.find(
        (combineItem) => combineItem.restId === restaurant.restId
      );

      let imageUrl;
      if (combineListMatch) {
        imageUrl = combineListMatch.thumbnailURL;
      } else if (matchesResultTag && matchesResultMoodTag) {
        imageUrl = restaurant.FoodUrl;
      } else if (matchesResultTag) {
        imageUrl = restaurant.BigStarUrl;
      } else {
        imageUrl = restaurant.miniStarUrl;
      }

      let size;
      if (combineListMatch) {
        size = 6;
      } else if (matchesResultTag && matchesResultMoodTag) {
        size = 6;
      } else if (matchesResultTag) {
        size = 4;
      } else {
        size = 1;
      }

      let className;
      if (combineListMatch) {
        className = "w-4 h-4 rounded-full cursor-pointer duration-500";
      } else if (matchesResultTag && matchesResultMoodTag) {
        className = `w-4 h-4 hover:bg-yellow-200 rounded-full cursor-pointer duration-500 `;
      } else if (matchesResultTag) {
        className = `w-4 h-4 hover:bg-yellow-200 rounded-full cursor-pointer duration-500 ju`;
      } else {
        className = `w-6 h-6 hover:bg-yellow-200 rounded-full cursor-pointer duration-500  `;
      }

      return {
        id: restaurant.restId,
        title: "토니모리",
        x: getRandomInt(10, 90),
        y: getRandomInt(10, 90),
        className: className,
        size: size,
        imageUrl: imageUrl,
        miniStarUrl: restaurant.miniStarUrl,
        BigStarUrl: restaurant.BigStarUrl,
        FoodUrl: restaurant.FoodUrl,
      };
    });

    setStars(starsData);
  }, [restaurantList, resultFoodTags, resultMoodTags, selectedCombineList]);

  return (
    <div className="flex flex-col flex-grow bg-white border-8 rounded-2xl">
      <div className="w-full h-2/3 justify-center items-center bg-black rounded-2xl relative">
        {content}
      </div>
      <PlayerHand
        playerHand={playerHand}
        setPlayerHand={setPlayerHand}
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
