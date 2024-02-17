import { useState, useEffect, useRef } from "react";
import InputWithLabel from "../../components/InputWithLable";
import { useNavigate } from "react-router-dom";
import CreateRoomModal from "./modal/CreateRoomModal";
import LogoutIcon from "@mui/icons-material/Logout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { logout } from "../../api";
import { useSocket } from "../../realtimeComunication/SocketContext";

const CreateRoomPage = ({ localStream, roomDetail, setRoomDetail }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isModal, setIsModal] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const socket = useSocket();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    const userDetails = localStorage.getItem("user");

    if (userDetails) {
      const username = JSON.parse(userDetails).username;
      setUserName(username);
    }
    console.log("roomDetail", roomDetail);
  }, [setRoomDetail, roomDetail]);

  useEffect(() => {
    if (!socket) return;

    socket.on("create-room-response", (response) => {
      if (response) {
        const { roomId } = response;
        setRoomDetail((prev) => ({
          ...prev,
          roomId: roomId,
        }));
        navigate(`/waiting-friends/${roomId}`);
      } else {
        console.error(response.error);
      }
    });

    socket.on("join-room-response", (response) => {
      if (response) {
        const { roomId } = response;
        setRoomDetail((prev) => ({
          ...prev,
          roomId: roomId,
        }));
        navigate(`/waiting-friends/${roomId}`);
      } else {
        console.error(response.error);
      }
    });

    return () => {
      socket.off("create-room-response");
      socket.off("join-room-response");
    };
  }, [socket, navigate, setRoomDetail, roomDetail]);
  const handleOpenModal = () => {
    setIsModal(true);
  };

  const handleRoomCreate = async (event) => {
    event.preventDefault();
    if (socket) {
      const purposeCoordinate = [
        roomDetail.purposeCoordinate.lat,
        roomDetail.purposeCoordinate.lng,
      ];
      console.log(purposeCoordinate);
      socket.emit("create-room", { purposeCoordinate });
      setIsModal(false);
    } else {
      console.error("Socket is not initialized.");
    }
  };

  const handleRoomJoin = () => {
    socket.emit("join-room", { roomId });
  };

  const handleLogout = () => {
    logout();
  };
  const handleShowExpainModal = () => {
    alert("모달 구현해줘!~~");
  };

  return (
    <div className="bg-[url('/BackGroundImg_2.jpg')] min-h-screen text-gray-900 flex justify-center items-center">
      <div className="m-20 p-8 shadow-lg bg-white rounded-lg flex justify-center animate-fade-up">
        <div className="w-full flex flex-col items-center">
          <img
            className="rounded-xl w-[320px] h-[100px] object-cover"
            src="./BackGroundImg_3.png"
            alt=""
          />
          {/* <h1 className="font-bold text-2xl mt-4">방 생성</h1> */}
          <div className="w-full h-full flex-1 mt-4">
            <div className="mx-auto max-w-xs ">
              <h1 className="font-[Tenada]">안녕하세요. {userName}님</h1>
              <div className="mt-2 w-full h-full">
                <video
                  className="w-full h-[250px] items-center border-4 bg-gray-300 border-white shadow-xl rounded-lg object-fill"
                  ref={videoRef}
                  autoPlay={true}
                  muted={false}
                />
              </div>
              <button
                className="w-full font-[Tenada] mt-4 px-8 py-2 rounded-lg font-medium bg-blue-400 hover:bg-blue-500 border transition-all  text-gray-100"
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
                className="mt-3 tracking-wide bg-emerald-400 text-gray-100 w-full py-2 rounded-lg hover:bg-emerald-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                onClick={handleRoomJoin}
              >
                <span className="font-[Tenada]">방 ID로 참가하기</span>
              </button>
              <div className="flex justify-between items-center gap-2 mt-5 tracking-wide">
                <button
                  className=" bg-red-400 text-white w-full p-2 rounded-lg hover:bg-red-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  onClick={handleShowExpainModal}
                >
                  <h1 className="mr-1 font-[Tenada]">시작 가이드</h1>
                  <HelpOutlineIcon />
                </button>
                <button
                  className=" bg-gray-200 text-gray-500 w-full p-2 rounded-lg hover:bg-gray-300 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  onClick={handleShowExpainModal}
                >
                  <h1 className="mr-1 font-[Tenada]">문의 사항</h1>
                </button>
                <button
                  className="font-[Tenada] font-semibold bg-gray-200 text-gray-500 p-2 rounded-lg hover:bg-gray-300 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  onClick={handleLogout}
                >
                  <span className="">
                    <LogoutIcon />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModal && (
        <CreateRoomModal
          onModal={setIsModal}
          onCreate={handleRoomCreate}
          setRoomDetail={setRoomDetail}
        />
      )}
    </div>
  );
};

export default CreateRoomPage;
