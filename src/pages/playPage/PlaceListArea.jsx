import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import PlayerHand from "./PlayerHand";
import ModeThreeCombineArea from "./modeThree/card/ModeThreeCombineArea";
import ShowDetailModal from "../../components/modal/ShowDetailModal";
import FinalRestaurantDetails from "./FinalRestaurantDetails";
import socket from "../../realtimeComunication/socket";

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
}) => {
  const [stars, setStars] = useState([]);
  const [hoveredStarId, setHoveredStarId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleStarClick = (star) => {
    setSelectedRestaurant(star);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const addToPlayerHand = (selectedRestaurant) => {
    socket.emit("select-restaurant", selectedRestaurant);
    console.log("select-restaurant is emitted");

    setPlayerHand((prevPlayerHand) => {
      const updatedHand = {
        ...prevPlayerHand,
        selectedPlace: [selectedRestaurant],
      };
      return updatedHand;
    });

    // setAllUserPlayerHand((prevAllUserHand) => {
    //   const updatedHand = {
    //     ...prevAllUserHand,
    //     selectedPlace: [...prevAllUserHand.selectedPlace, selectedRestaurant],
    //   };

    //   return updatedHand;
    // });

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
      <div
        onClick={() => handleStarClick(star)}
        onMouseEnter={() => setHoveredStarId(star._id)}
        onMouseLeave={() => setHoveredStarId(null)}
        className={`${star.className} relative animate-fade `}
        key={i}
        id={star._id}
        style={{
          position: "absolute",
          top: `${star.y}%`,
          left: `${star.x}%`,
          transform: `scale(${star.size})`,
        }}
      >
        <div className="text-yellow-400">
          {star.showComponentOne ? (
            <div className="w-20 h-20 animate-jump-in">
              {star.signatureUrl ? (
                <img src={star.signatureUrl} alt="" />
              ) : (
                <img src="/Food.png" alt="" />
              )}
            </div>
          ) : (
            <div className="w-6 h-6 hover:bg-yellow-200 rounded-full cursor-pointer duration-500 ">
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

      let imageUrl;
      const targetNames = allUserSelectedFoodTags.filter((tag) =>
        restaurant.food_category.startsWith(tag)
      );

      if (targetNames.length > 0) {
        imageUrl = imgUrls.find((img) =>
          targetNames.some((name) => img.name === name)
        );

        if (imageUrl === undefined) {
          imageUrl = imgUrls.find((img) => img.name === "큰별");
        }
      } else {
        imageUrl = imgUrls.find((img) => img.name === "작은별");
      }

      let matchesResultMoodTag = true;
      if (roomMode === 2) {
        //console.log("restaurant : ", restaurant);
        if (restaurant.moodKeywords !== undefined) {
          //console.log("resultMoodTags : ", resultMoodTags);
          matchesResultMoodTag = restaurant.moodKeywords?.some((moodKeyword) =>
            allUserSelectedMoodTags.includes(moodKeyword)
          );
        } else {
          matchesResultMoodTag = false;
        }
      }

      return {
        ...restaurant,
        size: 1,
        x: getRandomInt(5, 90),
        y: getRandomInt(5, 90),
        showComponentOne: matchesResultTag && matchesResultMoodTag,
        signatureUrl: imageUrl.imgUrl,
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
