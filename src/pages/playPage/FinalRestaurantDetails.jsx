import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const FinalRestaurantDetails = ({ allUserPlayerHand }) => {
  const [map, setMap] = useState();
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const options = allUserPlayerHand.finalPlace[0].options.split(",");

  useEffect(() => {
    console.log(allUserPlayerHand.finalPlace[0].address);
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(
      allUserPlayerHand.finalPlace[0].address,
      (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK && data.length > 0) {
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

          if (map) {
            map.setCenter(
              new kakao.maps.LatLng(centerPosition.lat, centerPosition.lng)
            );
          }
        } else {
          // Handle no results or other errors (optional)
          console.error("Search failed:", status);
        }
      }
    );
  }, []);

  return (
    <div className="w-full h-full grid grid-cols-2 grid-rows-2 p-4 gap-4 text-white font-tenada">
      {/* Top-left cell for the main image */}
      <div className="flex row-span-1 justify-center items-center">
        <img
          src={allUserPlayerHand.finalPlace[0].thumbnailImg}
          alt="Main Dish"
          className="w-full max-h-[300px] rounded-md"
        />
      </div>
      {/* Top-right cell for details */}
      <div className="p-2 flex justify-center flex-col gap-4">
        <div className="flex items-center justify-between ">
          <p className="text-4xl font-bold  font-tenada">식당 이름</p>
          <p className="text-2xl text-white font-bold  font-tenada">
            ⭐️{allUserPlayerHand.finalPlace[0].name}
          </p>
        </div>
        <div className="flex items-center justify-between ">
          <p className="text-4xl font-bold  font-tenada">리뷰 갯수</p>
          <p className="text-2xl text-white font-bold  font-tenada">
            ⭐️{allUserPlayerHand.finalPlace[0].ratingCount}
          </p>
        </div>
        <div className="flex items-center justify-between ">
          <p className="text-4xl font-bold  font-tenada">리뷰 점수</p>
          <p className="text-2xl text-white font-bold  font-tenada">
            ⭐️{allUserPlayerHand.finalPlace[0].rating}
          </p>
        </div>
        <div className="flex items-center justify-between ">
          <p className="text-4xl font-bold  font-tenada">전화번호</p>
          <p className="text-2xl font-bold text-emerald-300 underline font-tenada">
            📞{allUserPlayerHand.finalPlace[0].phone_number}
          </p>
        </div>
        <div className="flex items-center justify-between ">
          <p className="w-48 text-4xl font-bold font-tenada">식당 주소</p>
          <p className="text-2xl text-white font-bold truncate font-tenada  ">
            📍{allUserPlayerHand.finalPlace[0].address}
          </p>
        </div>
      </div>
      {/* Bottom-right cell for reviews */}

      {/* Additional cells can go here, e.g., for a map or other images */}
      {/* Map cell */}

      <div className="w-full h-full gap-2 col-span-1 row-span-1 justify-center items-center overflow-y-hidden">
        {options.map((option, index) => (
          <div
            key={index}
            className="bg-white p-2 m-3 text-center rounded-xl"
            style={{
              color: `hsl(${Math.random() * 360}, 100%, 30%)`, // Random color
              fontSize: `${Math.random() * (32 - 16) + 16}px`, // Random font size between 16px and 32px
            }}
          >
            #{option}
          </div>
        ))}
      </div>
      <div className="w-full h-full gap-2 col-span-1 row-span-1 justify-center items-center overflow-y-hidden">
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
