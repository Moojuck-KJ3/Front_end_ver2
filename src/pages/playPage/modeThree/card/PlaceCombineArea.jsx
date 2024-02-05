import { useEffect, useState } from "react";
import PlaceCard from "./PlaceCard";
import BigPlaceCard from "./BigPlaceCard";
import ResultCardLists from "./ResultCardLists";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import HelpIcon from "@mui/icons-material/Help";
import LoopIcon from "@mui/icons-material/Loop";
import { useParams } from "react-router-dom";
import { getKeywordsToRests } from "../../../../api";

const PlaceCombineArea = ({ contentNumber, onCardClick }) => {
  const [draggedTagA, setDraggedTagA] = useState(null);
  const [draggedTagB, setDraggedTagB] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isSpining, setIsSpining] = useState(false);
  const [placeList, setPlaceList] = useState([]);

  const roomId = useParams();

  useEffect(() => {
    // get 요청으로 getKeywordsToRests 요청 예정
    // 현재 생각으론 dummy_place를 대체할 예정
    const getPlaceList = async (roomId) => {
      const response = await getKeywordsToRests(roomId);
      if (response.error) {
        console.log(response.exception);
      } else {
        setPlaceList(response.restaurants);
      }
    };

    getPlaceList(roomId);
  }, []);

  useEffect(() => {
    console.log(draggedTagA, draggedTagB);
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

    const tagData = event.dataTransfer.getData("tag");
    const tag = JSON.parse(tagData);
    if (tag) {
      // drag 하여 놓을때 post 요청
      // post 요청이 성공한 경우, response에 error가 없는 경우

      if (targetList === "A") {
        setDraggedTagA(tag);
      } else if (targetList === "B") {
        setDraggedTagB(tag);
      }
    }

    setIsDragging(false);
  };

  const handleResetTarget = () => {
    setDraggedTagA(null);
    setDraggedTagB(null);
  };

  const handleCardClick = (type, card) => {
    onCardClick(type, card);
  };

  switch (contentNumber) {
    case 1:
      return (
        <div className="flex flex-col">
          <ul className="flex gap-14 justify-center">
            {placeList.map((place, index) => (
              <li
                key={index}
                id={place.restarantId}
                onClick={() => handleCardClick("selectedTag", place)}
              >
                {/* imgUrl={place.imgUrl} */}
                <PlaceCard place={place} />
              </li>
            ))}
          </ul>
        </div>
      );
    case 2:
      return (
        <div className="flex flex-col m-10 p-2 w-full h-full justify-center gap-20 items-center">
          {showContent ? (
            <div onDragOver={handleResetTarget}>
              <ResultCardLists />
            </div>
          ) : (
            <div className="flex ">
              <div
                className={`w-48 juitems-center py-1 bg-white shadow-lg border-dashed border-2 min-h-40 border-black ${
                  isDragging ? "" : ""
                }`}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, "A")}
              >
                {draggedTagA && <BigPlaceCard img={draggedTagA.thumbnailURL} />}
              </div>

              <div className=" flex justify-center items-center mt-2 ">
                <div>
                  <MoreHorizIcon fontSize="large" />
                </div>
                <button
                  className={`hover:scale-105 text-gray-800 font-semibold rounded-full p-2
              px-2 ${isSpining && "animate-spin animate-infinite"}`}
                >
                  {isSpining ? <LoopIcon /> : <HelpIcon />}
                </button>
                <MoreHorizIcon fontSize="large" />
              </div>

              {/* USER B Target Area */}
              <div
                className={`w-48 items-center py-1 bg-white shadow-lg border-dashed border-2 min-h-40 border-black ${
                  isDragging ? "" : ""
                }`}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, "B")}
              >
                {draggedTagB && <BigPlaceCard img={draggedTagB.thumbnailURL} />}
              </div>
            </div>
          )}
        </div>
      );
    case 3:
      return (
        <div>
          {/* Content for case 3 */}
          상대방에게 제안하면 어떨까?
        </div>
      );
    default:
      return null;
  }
};

export default PlaceCombineArea;
