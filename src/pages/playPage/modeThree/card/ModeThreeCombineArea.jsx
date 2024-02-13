import { useEffect, useState } from "react";
import BigPlaceCard from "./BigPlaceCard";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import HelpIcon from "@mui/icons-material/Help";
import LoopIcon from "@mui/icons-material/Loop";
import { useParams } from "react-router-dom";
import socket from "../../../../realtimeComunication/socket";
import CombineAnimation from "../combineAni/CombineAnimation";

const ModeThreeCombineArea = ({ roomDetail }) => {
  const [draggedTagA, setDraggedTagA] = useState(null);
  const [draggedTagB, setDraggedTagB] = useState(null);
  const [draggedTagC, setDraggedTagC] = useState(null);
  const [draggedTagD, setDraggedTagD] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isSpining, setIsSpining] = useState(false);
  const [combinedplaceList, setCombinedPlaceList] = useState([]);

  const { roomId } = useParams();

  // 최대 기준 1000일때 0.2로 치환된다
  const testPositions = [
    { x: -1000, y: -900 },
    { x: -500, y: -850 },
    { x: 1000, y: -900 },
    { x: 500, y: -600 },
    { x: -1000, y: 650 },
    { x: -500, y: 300 },
    { x: 1000, y: 750 },
    { x: 500, y: 500 },
    { x: 0, y: 0 }, // Center
  ];

  useEffect(() => {
    if (draggedTagA && draggedTagB) {
      setIsSpining(true);
      const delay = setTimeout(() => {
        setShowContent(true);
      }, 3000);
      return () => clearTimeout(delay);
    } else {
      setShowContent(false);
      setIsSpining(false);
    }
  }, [draggedTagA, draggedTagB]);
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };
  const handleDrop = (event, playerId) => {
    event.preventDefault();
    const restaurantData = event.dataTransfer.getData("restaurant");

    console.log("handleDrop is called ");
    const parsedRestaurantData = JSON.parse(restaurantData);
    console.log(parsedRestaurantData);

    if (parsedRestaurantData) {
      if (playerId === 1) {
        setDraggedTagA(parsedRestaurantData);
        console.log(draggedTagA);
      } else if (playerId === 2) {
        setDraggedTagB(parsedRestaurantData);
      } else if (playerId === 3) {
        setDraggedTagC(parsedRestaurantData);
        console.log(draggedTagA);
      } else if (playerId === 4) {
        setDraggedTagD(parsedRestaurantData);
      }
    }
    socket.emit("user-selected-card", {
      roomId,
      playerId,
      restaurantData: parsedRestaurantData,
    });
    console.log("socket emited!");
    setIsDragging(false);
  };
  useEffect(() => {
    socket.connect();
    socket.on("other-user-selected-card", ({ playerId, restaurantData }) => {
      console.log("other-user-selected-card is called,!");
      if (playerId === 1) {
        setDraggedTagA(restaurantData);
        console.log(draggedTagA);
      } else if (playerId === 2) {
        setDraggedTagB(restaurantData);
      } else if (playerId === 3) {
        setDraggedTagC(restaurantData);
        console.log(draggedTagA);
      } else if (playerId === 4) {
        setDraggedTagD(restaurantData);
      }
    });
    return () => {
      socket.off("other-user-selected-card");
    };
  }, [socket]);
  useEffect(() => {
    if (draggedTagA && draggedTagB) {
      socket.emit("both-users-selected", {
        roomId,
        userSelectedList: [
          {
            playerId: 1,
            restId: draggedTagA.restId,
          },
          {
            playerId: 2,
            restId: draggedTagB.restId,
          },
        ],
      });
    }
  }, [draggedTagA, draggedTagB, roomId]);
  useEffect(() => {
    socket.on("combined-result", handleCombineResult);
    return () => {
      socket.off("combined-result", handleCombineResult);
    };
  }, [socket]);
  const handleCombineResult = (data) => {
    console.log("Combined result received:", data.restaurantList);
    if (data) {
      setCombinedPlaceList(data.restaurantList);
    } else {
      console.log("No results received or empty results array");
      setCombinedPlaceList([]);
    }
  };
  const handleResetTarget = () => {
    setDraggedTagA(null);
    setDraggedTagB(null);
    setDraggedTagC(null);
    setDraggedTagD(null);
  };
  return (
    <div className="w-full h-full flex justify-center items-center">
      {showContent ? (
        <div className="w-full h-full flex flex-col flex-grow justify-center items-center relative">
          {/* 애니메이션에 absolute position 지정 */}
          <CombineAnimation
            combinedplaceList={testPositions}
            onDragOver={handleResetTarget}
          />
        </div>
      ) : (
        <div className="flex flex-col w-full h-full justify-between items-center">
          <div className="w-full justify-between flex p-10 ">
            {/* USER A Target Area */}
            <div
              className={`w-48  juitems-center py-1 shadow-lg border-dashed border-2 border-white min-h-40 ${
                isDragging ? "" : ""
              }`}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, 1)}
            >
              {draggedTagA && <BigPlaceCard img={draggedTagA.thumbnailImg} />}
            </div>

            {/* USER B Target Area */}
            <div
              className={`w-48 items-center py-1 shadow-lg border-dashed border-2 min-h-40 border-white ${
                isDragging ? "" : ""
              }`}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, 2)}
            >
              {draggedTagB && <BigPlaceCard img={draggedTagB.thumbnailImg} />}
            </div>
          </div>
          {/* Middle */}
          <div className="flex">
            <div className=" flex justify-center items-center mt-2 ">
              <div>
                <MoreHorizIcon fontSize="large" style={{ color: "white" }} />
              </div>
              <button
                className={`hover:scale-105 text-white font-semibold rounded-full p-2
      px-2 ${isSpining && "animate-spin animate-infinite"}`}
              >
                {isSpining ? <LoopIcon /> : <HelpIcon />}
              </button>
              <MoreHorizIcon fontSize="large" style={{ color: "white" }} />
            </div>
          </div>
          <div className=" w-full flex justify-between p-10">
            {/* USER C Target Area */}
            <div
              className={`w-48  juitems-center py-1 shadow-lg border-dashed border-2 border-white min-h-40 ${
                isDragging ? "" : ""
              }`}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, 3)}
            >
              {draggedTagC && <BigPlaceCard img={draggedTagC.thumbnailImg} />}
            </div>
            {/* USER D Target Area */}
            <div
              className={`w-48 items-center py-1 shadow-lg border-dashed border-2 min-h-40 border-white ${
                isDragging ? "" : ""
              }`}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, 4)}
            >
              {draggedTagD && <BigPlaceCard img={draggedTagD.thumbnailImg} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ModeThreeCombineArea;
