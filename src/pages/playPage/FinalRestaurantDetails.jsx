import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const FinalRestaurantDetails = ({ allUserPlayerHand, currentIndex }) => {
  const [map, setMap] = useState();
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const currentRestaurant = allUserPlayerHand.finalPlace[currentIndex];
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
      <div className="image-container ">
        <img
          src={currentRestaurant.thumbnailImg}
          alt="Main Dish"
          className="shine-animation"
        />
      </div>
      {/* Top-right cell for details */}
      <div className="p-2 flex justify-center flex-col gap-4 overflow-hidden">
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
            📞{currentRestaurant.phone_number}
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

      <div className="w-full h-full max-w-[600px] max-h-[400px] gap-2 col-span-1 row-span-1 justify-center items-center overflow-auto overflow-y-auto scrollbar-hide p-4 mx-auto">
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

      <div className="w-full h-full gap-2 col-span-1 row-span-1 justify-center items-center overflow-hidden overflow-y-hidden p-4">
        <Map // 로드뷰를 표시할 Container
          center={{
            lat: 37.498,
            lng: 127.028,
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
    </div>
  );
};
export default FinalRestaurantDetails;
