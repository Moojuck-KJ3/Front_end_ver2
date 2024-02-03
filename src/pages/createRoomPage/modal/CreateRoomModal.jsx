import { useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

import { createRoom } from "../../../api";
import { useDispatch } from "react-redux";
import { setRoomId } from "../../../redux_states/rooms";

const API_KEY = "33d3165b1407ac3d92203219d067a088";
const JS_KEY = "fa77f847dc1c042e320456f1f78748ad";

const START_LAT = "37.498";
const START_LNG = "127.028";
const START_NAME = "강남역 2호선";

const CreateRoomModal = ({ onSetting }) => {
  const navigate = useNavigate();
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  // 만들때, back에 전달할 목표의 위도 경도
  const [purPosePosition, setPurposePosition] = useState([
    START_LAT,
    START_LNG,
  ]);
  const [purPoseName, setPurposeName] = useState(START_NAME);
  const dispatch = useDispatch();

  const handleCreateRoom = () => {
    // 방 생성 로직 여기
    const createRoomData = {
      purposeName: purPoseName,
      purposeAddress: purPosePosition,
    };

    const createRooms = async (createRoomData) => {
      const response = await createRoom(createRoomData);
      if (response.error) {
        console.log(response.exception);
      } else {
        dispatch(setRoomId(response.roomId));
        navigate("/waiting-friends");
      }
    };

    createRooms(createRoomData);
  };

  const handleSearch = () => {
    if (!searchQuery) {
      // Handle empty search query (optional)
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

        setPurposePosition([centerPosition.lat, centerPosition.lng]);
        setPurposeName(marker.content);

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
            <h1 className="w-full text-2xl font-bold text-center">
              방 생성하기
            </h1>
          </div>
          <div className="flex justify-center m-2">
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
              className=" p-2 rounded-lg bg-emerald-500 text-white ml-2"
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
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onSetting(false)}
              className=" bg-gray-300 px-5 py-3 rounded-lg text-gray-600 font-bold"
            >
              취소
            </button>
            <button
              onClick={handleCreateRoom}
              className=" bg-emerald-500 px-5 py-3 rounded-lg text-white font-bold"
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
