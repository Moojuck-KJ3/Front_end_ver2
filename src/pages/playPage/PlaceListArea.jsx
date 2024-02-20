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
  handleupdateFinalPlace,
  showModeTwoVoiceRecorder,
  speechText,
  activeTags,
}) => {
  const socket = useSocket();
  const [stars, setStars] = useState([]);
  const [hoveredStarId, setHoveredStarId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCategoryReceive, setIsCateforyReceive] = useState(false);

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
    content = (
      <ModeThreeCombineArea
        roomDetail={roomDetail}
        handleupdateFinalPlace={handleupdateFinalPlace}
      />
    );
  } else if (roomMode === 4) {
    content = (
      <FinalRestaurantDetails
        allUserPlayerHand={allUserPlayerHand}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    );
  } else {
    content = stars.map((star, i) => {
      const isMatchingTag =
        activeTags.length === 0 ||
        activeTags.some(
          (tag) =>
            star.food_category &&
            typeof star.food_category === "string" &&
            star.food_category.startsWith(tag)
        );

      const isMoodMatchingTag =
        activeTags.length === 0 ||
        activeTags.every(
          (tag) =>
            (star.food_category &&
              typeof star.food_category === "string" &&
              star.food_category.includes(tag)) ||
            (star.moodKeywords &&
              Array.isArray(star.moodKeywords) &&
              star.moodKeywords.includes(tag))
        );

      // console.log(activeTags);
      // console.log(star.moodKeywords);
      const starStyle =
        isMatchingTag || isMoodMatchingTag ? "opacity-100" : "opacity-20";

      return (
        <div
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => setHoveredStarId(star._id)}
          onMouseLeave={() => setHoveredStarId(null)}
          className={`${star.className} ${starStyle} relative animate-fade ${
            !star.signatureUrl && roomMode === 2 ? "animate-opacityPulse" : ""
          }`}
          key={i}
          id={star._id}
          style={{
            position: "absolute",
            top: `${star.y}%`,
            left: `${star.x}%`,
            transform: `scale(${star.size})`,
            opacity: !star.signatureUrl && roomMode === 2 ? 0 : 1,
            pointerEvents:
              !star.signatureUrl && roomMode === 2 ? "none" : "auto",
            zIndex: hoveredStarId === star._id ? 1 : 0,
            transition: "transform 0.3s ease, opacity 0.3s ease",
          }}
        >
          <div className={`absolute w-20.5 h-20.5 bg-white`}></div>
          <div className="text-yellow-400">
            {star.signatureUrl ? (
              <div
                className={`${starStyle} w-20 h-20 ${
                  star.isChangeAnimOn ? "animate-jump-in" : ""
                }`}
                style={{
                  zIndex: hoveredStarId === star._id ? 1 : 0,
                }}
              >
                <img src={star.signatureUrl} alt="" />
              </div>
            ) : (
              <div
                className={`${starStyle}  w-6 h-6 hover:bg-yellow-200 rounded-full cursor-pointer duration-500`}
                style={{
                  opacity: isCategoryReceive ? 0.4 : 1,
                }}
              >
                {<FontAwesomeIcon icon={faStar} />}
              </div>
            )}
          </div>
          {hoveredStarId === star._id && (
            <div
              className="animate-fade z-50  w-64 h-68 absolute items-center text-2xl justify-center inline-block px-3 py-4 text-black bg-white rounded-lg shadow-sm -translate-x-1/2 left-1/2 bottom-full mb-2 "
              style={{
                transition: "opacity 300ms",
                opacity: 1,
                whiteSpace: "nowrap",
              }}
            >
              <h1 className=" font-DalseoHealing font-bold mb-1 ">
                {star.name}
              </h1>
              <div className="flex gap-2">
                <h1 className="w-fit p-2 rounded-lg bg-gray-300 font-DalseoHealing text-lg font-bold mb-1 ">
                  #{star.food_category}
                </h1>
                <h1 className="w-fit p-2 rounded-lg bg-gray-300 font-DalseoHealing text-lg font-bold mb-1 ">
                  ⭐️{star.rating}
                </h1>
              </div>
              <img
                className="w-full max-h-40 object-cover rounded-lg"
                src={star.thumbnailImg}
                alt="thumbnailImg"
              />
            </div>
          )}
        </div>
      );
    });
  }

  useEffect(() => {
    const starsData = restaurantList.map((restaurant) => {
      const matchesResultTag = allUserSelectedFoodTags.some((tag) =>
        restaurant.food_category.startsWith(tag)
      );

      let isChangeAnimOn = false;

      let imageUrl = null;
      const targetNames = allUserSelectedFoodTags.filter((tag) =>
        restaurant.food_category.startsWith(tag)
      );

      if (targetNames.length > 0) {
        imageUrl = imgUrls.find((img) => img.name === "큰별");
        setIsCateforyReceive(true);
        isChangeAnimOn = true;
      }

      // 어차피 server에서 추천해주는 녀석들만 PNG 로 만들어줄거라
      // 별도의 mood Keywords 관리 로직 주석처리
      if (roomMode === 2) {
        isChangeAnimOn = false;
        if (matchesResultTag && restaurant.moodKeywords !== undefined) {
          const restaurantExistsInModeTwoResult =
            modeTwoResultRestList.includes(restaurant._id);

          if (restaurantExistsInModeTwoResult) {
            const tempImgUrl = imgUrls.find((img) =>
              targetNames.some((name) => img.name === name)
            );

            if (tempImgUrl) {
              imageUrl = tempImgUrl;
              isChangeAnimOn = true;
            }
          }
        }
      }

      return {
        ...restaurant,
        size: 1,
        x: restaurant.coodX,
        y: restaurant.coodY,
        signatureUrl: imageUrl?.imgUrl,
        isChangeAnimOn: isChangeAnimOn,
      };
    });

    setStars(starsData);
  }, [
    restaurantList,
    allUserSelectedFoodTags,
    allUserSelectedMoodTags,
    modeTwoResultRestList,
  ]);

  return (
    <div className=" flex flex-col flex-grow bg-white border-8 rounded-2xl">
      <div className=" h-2/3 justify-center items-center bg-black rounded-2xl relative">
        {content}
      </div>
      <PlayerHand
        allUserPlayerHand={allUserPlayerHand}
        onSetAllUserPlayerHand={setAllUserPlayerHand}
        roomMode={roomMode}
        setRoomMode={setRoomMode}
        handleSetReady={handleSetReady}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        showModeTwoVoiceRecorder={showModeTwoVoiceRecorder}
        speechText={speechText}
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
