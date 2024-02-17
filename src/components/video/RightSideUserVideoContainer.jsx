import { useState } from "react";
import VideoContainer from "./VideoContainer";
import RightSideCard from "../../pages/playPage/modeThree/card/RightSideCard";
import { useSocket } from "../../realtimeComunication/SocketContext";
import { useParams } from "react-router-dom";

const RightSideUserVideoContainer = ({
  localStream,
  remoteStrem,
  roomDetail,
}) => {
  const [activeButton, setActiveButton] = useState(null);
  const [dragItem, setDragItem] = useState(null);
  const { roomId } = useParams();
  const socket = useSocket();

  const sortedUserStreams = roomDetail.userStreams.sort((a, b) =>
    a.socketId.localeCompare(b.socketId)
  );
  const streamsToShow = sortedUserStreams.filter((_, index) => index % 2 !== 0);

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragItem(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    console.log("handleDrop");

    const restaurantData = event.dataTransfer.getData("restaurant");

    const parsedRestaurantData = JSON.parse(restaurantData);
    console.log(parsedRestaurantData);
    setDragItem(parsedRestaurantData);
  };
  const handleButtonClick = (buttonId) => {
    // If the active button is clicked again, hide the message box and reset the active button
    console.log("handleButtonClick", buttonId);

    if (activeButton === buttonId) {
      setActiveButton(null);
      setDragItem(null);
    } else {
      setActiveButton(buttonId);
    }
  };

  const sendMessage = () => {
    // activeButton의 ID를 사용하여 현재 활성화된 버튼의 텍스트 찾기
    const action = buttons.find((button) => button.id === activeButton)?.text;

    const data = {
      roomId: roomId,
      socketId: socket.id,
      action: action,
      restaurantData: dragItem,
    };
    console.log(data);

    if (action) {
      socket.emit("right-sidebar-action", data);
    }

    setActiveButton(null);
    setDragItem(null);
  };
  const buttons = [
    { id: "thumbsUp", text: "여기 어때👍" },
    { id: "attention", text: "잠깐 주목🗣️" },
    { id: "dislike", text: "이건 좀...🤬" },
    { id: "cantEat", text: "이거 못 먹어😫" },
  ];

  const renderPlaceholders = (count) => {
    let placeholders = [];
    for (let i = 0; i < count; i++) {
      placeholders.push(
        <div
          key={`placeholder-${i}`}
          className="flex  min-h-[300px] flex-col justify-center bg-white p-4 mx-2  rounded-lg shadow-2xl border-2 relative"
        >
          <div className="w-full h-full object-cover rounded-lg border-1 bg-gray-400 animate-pulse" />
        </div>
      );
    }
    return placeholders;
  };

  return (
    <div className=" flex flex-col w-1/5 min-w-[300px] h-full gap-4 ">
      {streamsToShow.length === 0 && renderPlaceholders(2)}
      {streamsToShow.length === 1 && (
        <>
          <VideoContainer
            key="local-stream"
            stream={streamsToShow[0].stream}
            isLocalStream={
              roomDetail.playerInfo.socketId === streamsToShow[0].socketId
            }
          />
          {renderPlaceholders(1)}
        </>
      )}
      {streamsToShow.length >= 2 &&
        streamsToShow.map((userStream, index) =>
          roomDetail.playerInfo.socketId === userStream.socketId ? (
            <VideoContainer
              key={`local-stream-${index}`}
              stream={localStream}
              isLocalStream={true}
            />
          ) : (
            <VideoContainer
              key={`remote-stream-${index}`}
              stream={userStream.stream}
              isLocalStream={false}
            />
          )
        )}
      <div className="flex flex-col flex-grow items-center justify-around bg-white px-10 mx-2 py-1 rounded-lg shadow-2xl border-4 border-red-500">
        {buttons.map((button) =>
          activeButton === button.id ? (
            <div key={button.id} className="w-full flex flex-grow flex-col">
              {/* Message input field */}
              <div className="p-2 mx-2 my-4 flex flex-col flex-1 bg-white border rounded shadow animate-fade">
                {activeButton === "attention" ? (
                  <p className="w-full border-dashed border-2 flex flex-grow p-2 rounded">
                    <div
                      className={`flex bg-white shadow-md rounded-xl animate-fade `}
                    >
                      <img
                        src="/확성기.png"
                        alt="확성기"
                        className="w-full h-full shadow-md overflow-hidden mx-auto bg-gray-200 rounded-lg shrink-0 object-cover object-center"
                      />
                    </div>
                  </p>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="w-full border-dashed border-2 flex flex-grow p-2 rounded"
                  >
                    {dragItem && <RightSideCard img={dragItem.thumbnailImg} />}
                  </div>
                )}
                <button
                  onClick={sendMessage}
                  className="w-1/2  mx-auto font-tenada p-2 bg-blue-400 hover:bg-blue-500 transition-all text-white rounded mt-2"
                >
                  보내기
                </button>
              </div>
              {/* Active button */}
              <button
                onClick={() => handleButtonClick(button.id)}
                className="mb-4 mx-auto w-full font-tenada text-4xl py-4 px-2 text-black bg-orange-400 hover:bg-orange-500 duration-150 ease-in-out hover:scale-105 transition-all rounded-full"
              >
                {button.text}
              </button>
            </div>
          ) : null
        )}
        {activeButton === null &&
          buttons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleButtonClick(button.id)}
              className="mx-auto w-full font-tenada text-4xl py-4 px-2 text-black bg-orange-400 rounded-full hover:bg-orange-500 duration-150 ease-in-out hover:scale-105 transition-all"
            >
              {button.text}
            </button>
          ))}
      </div>
    </div>
  );
};

export default RightSideUserVideoContainer;
