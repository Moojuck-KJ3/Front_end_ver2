import { useEffect, useState } from "react";
import PlaceCard from "./PlaceCard";
import BigPlaceCard from "./BigPlaceCard";
import ResultCardLists from "./ResultCardLists";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import HelpIcon from "@mui/icons-material/Help";
import LoopIcon from "@mui/icons-material/Loop";
import TastyTag1 from "./TastyTag1";
import TastyTag from "./TastyTag";

const DUMMY_RESULT_PLACE = [
  {
    id: "item1",
    title: "토니모리",
    imgUrl: "./초밥.png",
  },
  {
    id: "item2",
    title: "역전할맥",
    imgUrl: "./PlacePhoto_2.png",
  },
  {
    id: "item3",
    title: "교촌치킨",
    imgUrl: "./PlacePhoto.png",
  },
  {
    id: "item4",
    title: "할매국밥",
    imgUrl: "./PlacePhoto_1.png",
  },
  {
    id: "item5",
    title: "돈까스",
    imgUrl: "./PlacePhoto_2.png",
  },
];

const DUMMY_PLACE = [
  {
    id: "item1",
    title: "맛집",
    imgUrl: "./초밥.png",
  },
  {
    id: "item2",
    title: "카페",
    imgUrl: "./PlacePhoto_2.png",
  },
  {
    id: "item3",
    title: "디저트",
    imgUrl: "./PlacePhoto.png",
  },
];

const DUMMY_PLACE1 = [
  {
    id: "item1",
    title: "맛집",
    imgUrl: "./PlacePhoto_1.png",
  },
  {
    id: "item2",
    title: "카페",
    imgUrl: "./된장찌개.png",
  },
  {
    id: "item3",
    title: "디저트",
    imgUrl: "./국밥.png",
  },
];

const PlaceCombineArea = () => {
  const [openModal, setOpenModal] = useState(false);
  const [draggedTagA, setDraggedTagA] = useState(null);
  const [draggedTagB, setDraggedTagB] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isSpining, setIsSpining] = useState(false);

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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCombine = () => {
    handleOpenModal();
  };
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (event, targetList) => {
    event.preventDefault();

    const id = event.dataTransfer.getData("id");
    const item = DUMMY_PLACE.find((x) => x.id === id);
    console.log(item);

    if (item) {
      if (targetList === "A") {
        setDraggedTagA(item);
      } else if (targetList === "B") {
        setDraggedTagB(item);
      }
    }

    setIsDragging(false);
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData("id", event.currentTarget.id);
    setIsDragging(true);
  };

  const handleResetTarget = () => {
    setDraggedTagA(null);
    setDraggedTagB(null);
  };

  const handleClick = () => {};
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
            {draggedTagA && <BigPlaceCard img={draggedTagA.imgUrl} />}
          </div>

          <div className=" flex justify-center items-center mt-2 ">
            <div>
              <MoreHorizIcon fontSize="large" />
            </div>
            <button
              className={`hover:scale-105 text-gray-800 font-semibold rounded-full p-2 
              px-2 ${isSpining && "animate-spin animate-infinite"}`}
              onClick={handleCombine}
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
            {draggedTagB && <BigPlaceCard img={draggedTagB.imgUrl} />}
          </div>
        </div>
      )}
      {/* USER A Target Area */}
      <div className="flex gap-40">
        <div>
          <h1 className=" text-xl font-bold text-center">
            마찬옥 님의 분석 결과
          </h1>
          <ul className="flex gap-3 justify-center">
            {DUMMY_PLACE.map((place, index) => (
              <li
                key={index}
                id={place.id}
                draggable={true}
                onDragStart={handleDragStart}
              >
                <PlaceCard imgUrl={place.imgUrl} />
              </li>
            ))}
          </ul>
          <TastyTag />
        </div>
        <div>
          <h1 className=" text-xl font-bold text-center">
            천지영 님의 분석 결과
          </h1>
          <ul className="flex gap-3 justify-center">
            {DUMMY_PLACE1.map((place, index) => (
              <li
                key={index}
                id={place.id}
                draggable={true}
                onDragStart={handleDragStart}
                onClick={handleClick}
              >
                <PlaceCard imgUrl={place.imgUrl} />
              </li>
            ))}
          </ul>
          <TastyTag1 />
        </div>
      </div>
    </div>
  );
};

export default PlaceCombineArea;