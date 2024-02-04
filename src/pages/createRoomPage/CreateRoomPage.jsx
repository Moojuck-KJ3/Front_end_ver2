import { useState, useEffect } from "react";
import InputWithLabel from "../../components/InputWithLable";
import { useNavigate } from "react-router-dom";
import CreateRoomModal from "./modal/CreateRoomModal";
import {
  socket,
  connectionStart,
  joinRoom,
} from "../../realtimeComunication/socket";

const START_LAT = "37.498";
const START_LNG = "127.028";
const START_NAME = "강남역 2호선";

const CreateRoomPage = () => {
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [location, setLocation] = useState({
    START_NAME,
    START_LAT,
    START_LNG,
  });

  useEffect(() => {
    socket.on("create-room-response", (response) => {
      if (response) {
        const { roomId } = response;
        navigate(`/waiting-friends/${roomId}`);
      } else {
        console.error(response.error);
      }
    });

    socket.on("join-room-response", (response) => {
      console.log(response);
      if (response) {
        const roomId = response;
        navigate(`/waiting-friends/${roomId}`);
      } else {
        console.error(response.error);
      }
    });

    return () => {
      socket.off("create-room-response");
      socket.off("join-room-response");
    };
  }, []);

  const handleOpenModal = () => {
    setIsModal(true);
  };

  const handleRoomCreate = async (event) => {
    event.preventDefault();
    socket.emit("create-room", { location });
    setIsModal(false);
  };

  const handleRoomJoin = () => {
    // 성공한 경우, 입력한 roomId를 redux에 저장해야 한다
    //console.log("handleRoomJoin", roomNumber);
    if (roomNumber === "") return;

    //socket.emit("join-room", roomNumber);
    joinRoom(roomNumber);
  };

  return (
    <div className=" min-h-screen text-gray-900 flex justify-center">
      <div className="m-20  max-w-screen-xl sm-m-10 bg-white shadow-lg sm:rounded-lg flex justify-center flex-1 animate-fade-up">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-5 flex flex-col items-center">
            <h1 className="font-bold text-2xl">방 생성</h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <h1>안녕하세요. 마찬옥님</h1>
                <button
                  className="mt-5 tracking-wide font-semibold bg-blue-400 text-gray-100 w-full py-2 rounded-lg hover:bg-blue-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  onClick={handleOpenModal}
                >
                  <span className="">방 생성하기</span>
                </button>

                <InputWithLabel
                  type="roomNumber"
                  value={roomId}
                  setValue={setRoomId}
                  placeholder={"방 ID"}
                />
                <button
                  className="mt-5 tracking-wide font-semibold bg-green-400 text-gray-100 w-full py-2 rounded-lg hover:bg-green-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  onClick={handleRoomJoin}
                >
                  <span className="">방 ID로 참가하기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModal && (
        <CreateRoomModal onModal={setIsModal} onCreate={handleRoomCreate} />
      )}
    </div>
  );
};

export default CreateRoomPage;
