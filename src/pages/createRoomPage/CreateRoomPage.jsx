import { useState, useEffect } from "react";
import InputWithLabel from "../../components/InputWithLable";
import { useNavigate } from "react-router-dom";
import CreateRoomModal from "./modal/CreateRoomModal";
import socket from "../../realtimeComunication/socket";
import { connectionStart } from "../../realtimeComunication/socketConnection";

const CreateRoomPage = () => {
  const navigator = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userDetails = localStorage.getItem("user");

    if (userDetails) {
      const username = JSON.parse(userDetails).username;
      setUserName(username);
    }
    console.log("connectionStart");
    connectionStart(userDetails);

    socket.on("join-room-response", (isSuccess) => {
      console.log("join-room-response", isSuccess);

      if (isSuccess) {
        navigator(`/waiting-friends/${roomNumber}`);
      }
    });

    return () => {
      socket.off("join-room-response");
    };
  }, []);

  const handleRoomCreate = () => {
    console.log("handleRoomCreate");
    setIsModal(true);
    console.log(isModal);
    // navigator("/waiting-friends");
  };

  const handleRoomJoin = () => {
    // 성공한 경우, 입력한 roomId를 redux에 저장해야 한다
    //console.log("handleRoomJoin", roomNumber);
    if (roomNumber === "") return;

    socket.emit("join-room", roomNumber);
    //joinRoom(roomNumber);
  };

  return (
    <div className=" min-h-screen text-gray-900 flex justify-center">
      <div className="m-20  max-w-screen-xl sm-m-10 bg-white shadow-lg sm:rounded-lg flex justify-center flex-1 animate-fade-up">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-5 flex flex-col items-center">
            <h1 className="font-bold text-2xl">방 생성</h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <h1>안녕하세요. {userName}님</h1>
                <button
                  className="mt-5 tracking-wide font-semibold bg-blue-400 text-gray-100 w-full py-2 rounded-lg hover:bg-blue-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  onClick={handleRoomCreate}
                >
                  <span className="">방 생성하기</span>
                </button>

                <InputWithLabel
                  type="roomNumber"
                  value={roomNumber}
                  setValue={setRoomNumber}
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
      {isModal && <CreateRoomModal onSetting={setIsModal} />}
    </div>
  );
};

export default CreateRoomPage;
