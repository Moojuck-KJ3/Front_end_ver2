import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const FinalRestaurantDetails = ({
  allUserPlayerHand,
  currentIndex,
  setCurrentIndex,
}) => {
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [currentRestaurant, setCurrentRestaurant] = useState(
    allUserPlayerHand.finalPlace[currentIndex]
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleBefore = () => {
    setCurrentIndex((prev) => (prev === 0 ? prev : prev - 1));
  };

  const handleAfter = () => {
    setCurrentIndex((prev) =>
      prev >= allUserPlayerHand.finalPlace.length - 1 ? prev : prev + 1
    );
  };

  useEffect(() => {
    setCurrentRestaurant(allUserPlayerHand.finalPlace[currentIndex]);
  }, [currentIndex]);

  useEffect(() => {
    console.log("current Rest : ", currentRestaurant);
    setSearchQuery(currentRestaurant?.name);
  }, [currentRestaurant]);

  useEffect(() => {
    if (
      !searchQuery ||
      typeof kakao === "undefined" ||
      typeof kakao.maps === "undefined" ||
      typeof kakao.maps.services === "undefined" ||
      typeof kakao.maps.services.Places === "undefined"
    ) {
      console.error(
        "Kakao Maps SDK is not loaded or Places service is not available"
      );
      return;
    }

    console.log("se Q : ", searchQuery);

    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(searchQuery, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        if (data.length > 0) {
          const centerPosition = {
            lat: data[0].y,
            lng: data[0].x,
          };

          const marker = {
            position: centerPosition,
            content: data[0].place_name,
          };

          setMarkers([marker]);
          setInfo(marker);
        } else {
          setMarkers([]);
        }
      } else {
        // Handle no results or other errors (optional)
        console.error("Search failed:", status);
        setMarkers([]);
      }
    });
  }, [searchQuery]);

  // 가벼운 화살표 만들어서 currentIndex 수정하기
  const options = currentRestaurant?.options?.split(",") || [];
  if (!currentRestaurant) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <p className="text-white font-tenada text-2xl">
          선택한 레스토랑이 존재하지 않습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="final-restaurant-details text-white font-DalseoHealing font-bold p-14">
      {/* Top-left cell for the main image */}
      <div className="image-container max-w-[750px]">
        <img
          src={currentRestaurant.thumbnailImg}
          alt="Main Dish"
          className="shine-animation"
        />
      </div>
      {/* Top-right cell for details */}
      <div className="p-2 flex justify-center flex-col gap-4 overflow-hidden max-w-[650px]">
        <div className="flex items-center justify-between ">
          <p className="text-2xl ">식당 이름</p>
          <p className="text-2xl text-white">⭐️{currentRestaurant.name}</p>
        </div>
        <div className="flex items-center justify-between ">
          <p className="text-2xl ">리뷰 갯수</p>
          <p className="text-2xl text-white">
            ⭐️{currentRestaurant.ratingCount}
          </p>
        </div>
        <div className="flex items-center justify-between ">
          <p className="text-2xl">리뷰 점수</p>
          <p className="text-2xl text-white">⭐️{currentRestaurant.rating}</p>
        </div>
        <div className="flex items-center justify-between ">
          <p className="text-2xl ">전화번호</p>
          <p className="text-2xl text-emerald-300 underline ">
            📞{currentRestaurant.phoneNumber}
          </p>
        </div>
        <div className="flex items-center justify-between ">
          <p className="w-48 text-2xl">식당 주소</p>
          <p className="text-2xl text-white truncate">
            📍{currentRestaurant.address}
          </p>
        </div>
        <div className="flex mx-auto flex-wrap gap-2 items-center justify-center overflow-hidden max-h-38 scrollbar-hide max-w-[650px]">
          {options?.map((option, index) => (
            <div
              key={index}
              className="bg-gray-300 text-black p-2 text-center font-bold rounded-xl"
            >
              #{option}
            </div>
          ))}
        </div>
      </div>
      {/* Bottom-right cell for reviews */}

      {/* Additional cells can go here, e.g., for a map or other images */}
      {/* Map cell */}

      <div className="w-full h-full max-w-[500px] max-h-[400px] gap-2 col-span-1 row-span-1 justify-center items-center overflow-auto overflow-y-auto scrollbar-hide p-4 mx-auto">
        {currentRestaurant.reviews && currentRestaurant.reviews.length > 0 ? (
          currentRestaurant.reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-4 my-2 rounded hover:scale-105 transition-all"
            >
              <p className="text-black text-lg line-clamp-2">{review}</p>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-white text-2xl">리뷰가 없습니다.</p>
          </div>
        )}
      </div>

      <div className="w-full h-full gap-2 col-span-1 row-span-1 justify-center items-center overflow-hidden overflow-y-hidden p-4 max-w-[650px]">
        <Map // 로드뷰를 표시할 Container
          center={{
            lat:
              markers && markers.length > 0 ? markers[0].position.lat : 37.498,
            lng:
              markers && markers.length > 0 ? markers[0].position.lng : 127.028,
          }}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "5px",
          }}
          level={3}
        >
          {markers.length > 0 && (
            <MapMarker
              key={`marker-${markers[0].content}-${markers[0].position.lat},${markers[0].position.lng}`}
              position={markers[0].position}
              onClick={() => setInfo(markers[0])}
            >
              {info && info.content === markers[0].content && (
                <div style={{ color: "#000" }}>{markers[0].content}</div>
              )}
            </MapMarker>
          )}
        </Map>
      </div>

      <button
        onClick={handleBefore}
        className="bg-green-400 shadow-2xl rounded-full absolute top-1/2 -translate-y-1/2 left-2 hover:bg-blue-400 transition-all"
      >
        <NavigateBeforeIcon fontSize="large" />
      </button>
      <button
        onClick={handleAfter}
        className="bg-green-400 shadow-2xl rounded-full absolute top-1/2 -translate-y-1/2 right-2 hover:bg-blue-400 transition-all"
      >
        <NavigateNextIcon fontSize="large" />
      </button>
    </div>
  );
};
export default FinalRestaurantDetails;
