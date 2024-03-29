import { useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import SearchIcon from "@mui/icons-material/Search";

const CreateRoomModal = ({ onModal, onCreate, setRoomDetail }) => {
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
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

    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(searchQuery, (data, status, _pagination) => {
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

        // start-play-room에서 사용할 목적지 좌표
        // 이거 검색 안하면 undefined가 들어간다는 단점이 있으니 고려
        // localStorage.setItem(
        //   "purposeCoordinate",
        //   JSON.stringify(centerPosition)
        // );

        setRoomDetail((prev) => ({
          ...prev,
          purposeCoordinate: centerPosition,
        }));

        if (map) {
          map.setCenter(
            new kakao.maps.LatLng(centerPosition.lat, centerPosition.lng)
          );
        }
      } else {
        // Handle no results or other errors (optional)
        console.error("Search failed:", status);
      }
    });
  };

  return (
    <div className="modal fixed w-full h-full left-0 flex items-center justify-center">
      {/* overlay  */}
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

      <div className="modal-container bg-white w-10/12 md:max-w-md mx-auto rounded-lg shadow-lg z-50  animate-jump-in">
        {/* Add modal content here */}
        <div className="modal-content py-4 text-left px-6">
          <div className="flex justify-between items-center pb-3 border-b ">
            <h1 className="font-[Tenada] w-full text-2xl font-bold text-center">
              방 생성하기
            </h1>
          </div>
          <div className="font-[Tenada] flex justify-center m-2">
            <p className="p-2 text-lg">
              어떤 지역을 기반으로 맛집을 추천해드릴까요?
            </p>
          </div>
          <div className="flex h-full">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 w-full rounded-lg"
            />
            <button
              className=" p-2 rounded-lg bg-emerald-400 hover:bg-emerald-500 transition-all  text-white ml-2"
              onClick={handleSearch}
            >
              <SearchIcon />
            </button>
          </div>
          <div className="py-4 rounded-xl">
            <Map // 로드뷰를 표시할 Container
              center={{
                lat: 37.498,
                lng: 127.028,
              }}
              style={{
                width: "100%",
                height: "250px",
                borderRadius: "20px",
              }}
              level={3}
            >
              {/* Render only the first marker, if available */}
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
          <div className="flex justify-center gap-4 font-[Tenada]">
            <button
              onClick={() => onModal(false)}
              className=" bg-gray-200 hover:bg-gray-300 transition-all px-5 py-3 rounded-lg text-gray-600 font-bold"
            >
              취소
            </button>
            <button
              onClick={onCreate}
              className=" bg-emerald-400 hover:bg-emerald-500 transition-all px-5 py-3 rounded-lg text-white font-bold"
            >
              방 생성하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;
