import { useEffect, useState } from "react";
import BigPlaceCard from "./BigPlaceCard";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import HelpIcon from "@mui/icons-material/Help";
import LoopIcon from "@mui/icons-material/Loop";
import { useParams } from "react-router-dom";
import { useSocket } from "../../../../realtimeComunication/SocketContext";
import CombineAnimation from "../combineAni/CombineAnimation";

const ModeThreeCombineArea = ({ roomDetail, handleupdateFinalPlace }) => {
  const socket = useSocket();
  const [draggedTagA, setDraggedTagA] = useState(null);
  const [draggedTagB, setDraggedTagB] = useState(null);
  const [draggedTagC, setDraggedTagC] = useState(null);
  const [draggedTagD, setDraggedTagD] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isSpining, setIsSpining] = useState(false);
  const [combinedplaceList, setCombinedPlaceList] = useState([]);
  const [limitShowContent, setLimitShowContent] = useState(false);
  const { roomId } = useParams();

  useEffect(() => {
    if (draggedTagA && draggedTagB && draggedTagC && draggedTagD) {
      setIsSpining(true);
      const delay = setTimeout(() => {
        setLimitShowContent(true);
      }, 3000);
      return () => clearTimeout(delay);
    } else {
      setShowContent(false);
      setIsSpining(false);
    }
  }, [draggedTagA, draggedTagB, draggedTagC, draggedTagD]);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (event, playerId) => {
    event.preventDefault();
    const restaurantData = event.dataTransfer.getData("restaurant");

    console.log("handleDrop is called ");
    const parsedRestaurantData = JSON.parse(restaurantData);
    console.log(restaurantData);
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
    setIsDragging(false);
  };

  useEffect(() => {
    if (draggedTagA && draggedTagB && draggedTagC && draggedTagD) {
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
          {
            playerId: 3,
            restId: draggedTagC.restId,
          },
          {
            playerId: 4,
            restId: draggedTagD.restId,
          },
        ],
      });
    }
  }, [draggedTagA, draggedTagB, draggedTagC, draggedTagD, roomId, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("other-user-selected-card", ({ playerId, restaurantData }) => {
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

    socket.on("combined-result", handleCombineResult);

    socket.on("reset-combined-area", () => {
      setDraggedTagA(null);
      setDraggedTagB(null);
      setDraggedTagC(null);
      setDraggedTagD(null);
    });

    return () => {
      socket.off("other-user-selected-card");
      socket.off("combined-result", handleCombineResult);
    };
  }, [socket, draggedTagA, draggedTagB, draggedTagC, draggedTagD]);

  const handleCombineResult = (data) => {
    console.log("Combined result : ", data);
    console.log("Combined result received:", data.restaurantList);
    if (data) {
      setShowContent(true);
      setCombinedPlaceList(data.restaurantList);
    } else {
      console.log("No results received or empty results array");
      setCombinedPlaceList([]);
    }
  };

  const handleResetTarget = () => {
    socket.emit("reset-combined-area", { roomId });
  };
  return (
    <div className="w-full h-full flex justify-center items-center">
      {showContent && limitShowContent ? (
        <div className="w-full h-full flex flex-col flex-grow justify-center items-center relative">
          {/* 애니메이션에 absolute position 지정 */}
          <CombineAnimation
            combinedplaceList={combinedplaceList}
            onDragOver={handleResetTarget}
            handleupdateFinalPlace={handleupdateFinalPlace}
          />
        </div>
      ) : (
        <div className="flex flex-col w-full h-full justify-between items-center">
          <div className="w-full justify-between flex p-10 ">
            {/* USER A Target Area */}
            <div
              className={`w-64 juitems-center py-1 shadow-lg border-dashed border-2 border-white min-h-64 ${
                isDragging ? "" : ""
              }`}
              onDragOver={(event) => handleDragOver(event, 1)}
              onDrop={(event) => handleDrop(event, 1)}
            >
              {draggedTagA && <BigPlaceCard img={draggedTagA.thumbnailImg} />}
            </div>

            {/* USER B Target Area */}
            <div
              className={`w-64 items-center py-1 shadow-lg border-dashed border-2 min-h-64 border-white ${
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
                <MoreHorizIcon
                  fontSize="inherit"
                  style={{ color: "white", fontSize: "3rem" }}
                />
              </div>
              <button
                className={`hover:scale-105 text-white font-semibold rounded-full p-2
      px-2 ${isSpining && "animate-spin animate-infinite"}`}
              >
                {isSpining ? (
                  <LoopIcon
                    fontSize="inherit"
                    style={{ color: "white", fontSize: "5rem" }}
                  />
                ) : (
                  <HelpIcon
                    fontSize="inherit"
                    style={{ color: "white", fontSize: "5rem" }}
                  />
                )}
              </button>
              <MoreHorizIcon
                fontSize="inherit"
                style={{ color: "white", fontSize: "3rem" }}
              />
            </div>
          </div>
          <div className=" w-full flex justify-between p-10">
            {/* USER C Target Area */}
            <div
              className={`w-64 juitems-center py-1 shadow-lg border-dashed border-2 border-white min-h-64 ${
                isDragging ? "" : ""
              }`}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, 3)}
            >
              {draggedTagC && <BigPlaceCard img={draggedTagC.thumbnailImg} />}
            </div>
            {/* USER D Target Area */}
            <div
              className={`w-64 items-center py-1 shadow-lg border-dashed border-2 min-h-64 border-white ${
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
