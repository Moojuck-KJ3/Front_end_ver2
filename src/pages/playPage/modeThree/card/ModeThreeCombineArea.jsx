import { useEffect, useState } from "react";
import BigPlaceCard from "./BigPlaceCard";
import ResultCardLists from "./ResultCardLists";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import HelpIcon from "@mui/icons-material/Help";
import LoopIcon from "@mui/icons-material/Loop";
import { useParams } from "react-router-dom";
import socket from "../../../../realtimeComunication/socket";

const ModeThreeCombineArea = () => {
  const [draggedTagA, setDraggedTagA] = useState(null);
  const [draggedTagB, setDraggedTagB] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isSpining, setIsSpining] = useState(false);
  const [combinedplaceList, setCombinedPlaceList] = useState([]);
  const roomId = useParams();

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

  const handleDrop = (event, targetList) => {
    event.preventDefault();

    const restaurantData = event.dataTransfer.getData("restaurant");
    const parsedRestaurantData = JSON.parse(restaurantData);

    if (parsedRestaurantData) {
      if (targetList === "A") {
        setDraggedTagA(parsedRestaurantData);
      } else if (targetList === "B") {
        setDraggedTagB(parsedRestaurantData);
      }
    }
    socket.emit("user-selected-card", {
      roomId,
      targetList,
      restaurantData: parsedRestaurantData,
    });
    setIsDragging(false);
  };

  useEffect(() => {
    socket.on("other-user-selected-card", ({ targetList, restaurantData }) => {
      if (targetList === "A") {
        setDraggedTagA(restaurantData);
      } else if (targetList === "B") {
        setDraggedTagB(restaurantData);
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
        userSelectedList: [draggedTagA, draggedTagB],
      });
    }
  }, [draggedTagA, draggedTagB, roomId, socket]);

  useEffect(() => {
    socket.on("combined-result", handleCombineResult);

    return () => {
      socket.off("combined-result", handleCombineResult);
    };
  }, [socket]);

  const handleCombineResult = (data) => {
    console.log("Combined result received:", data);
    if (data && data.length > 0) {
      setCombinedPlaceList(data);
    } else {
      console.log("No results received or empty results array");
      setCombinedPlaceList([]);
    }
  };

  const handleResetTarget = () => {
    setDraggedTagA(null);
    setDraggedTagB(null);
  };

  return (
    <div className="w-full h-full flex justify-center  items-center">
      {showContent ? (
        <div onDragOver={handleResetTarget}>
          <ResultCardLists combinedplaceList={combinedplaceList} />
        </div>
      ) : (
        <div className="flex ">
          <div
            className={`w-48  juitems-center py-1 shadow-lg border-dashed border-2 border-white min-h-40 ${
              isDragging ? "" : ""
            }`}
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, "A")}
          >
            {draggedTagA && <BigPlaceCard img={"/돈까스.png"} />}
          </div>

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

          {/* USER B Target Area */}
          <div
            className={`w-48 items-center py-1 shadow-lg border-dashed border-2 min-h-40 border-white ${
              isDragging ? "" : ""
            }`}
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, "B")}
          >
            {draggedTagB && <BigPlaceCard img={"/돈까스.png"} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeThreeCombineArea;
