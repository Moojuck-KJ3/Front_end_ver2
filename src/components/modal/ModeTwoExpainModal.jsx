import { useParams } from "react-router";
import { useSocket } from "../../realtimeComunication/SocketContext";

const ModeTwoExpainModal = ({ SetShowVoiceRecorder, onShowModal }) => {
  const roomId = useParams();
  const socket = useSocket();

  const handleClick = () => {
    onShowModal(false);
    SetShowVoiceRecorder(true);
    console.log("start-speech");
    socket.emit("start-speech", roomId);
  };
  return (
    <div className="modal fixed top-1/3 left-0 w-full flex items-center justify-center">
      <div className=" bg-white mx-auto rounded-lg shadow-lg animate-fade">
        {/* Add modal content here */}
        <div className=" py-4 text-left px-6  rounded-xl ">
          <div className="flex justify-between items-center pb-6">
            <p className="text-5xl p-4 font-DalseoHealing font-bold">
              오늘 어떤 분위기의 장소를 원하세요?
            </p>
          </div>
          <div className="text-3xl p-2 font-bold font-DalseoHealing flex flex-col justify-center ">
            <p>
              버튼을 누른 뒤, 오늘{" "}
              <span className="text-red-400">어떤 분위기의 장소</span>를
              원하는지 말해보세요.
            </p>
            <p>
              여러분에게 딱 맞는 식당들이{" "}
              <span className="text-red-400">실시간</span>으로 나타납니다.
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleClick}
              className="px-4 bg-purple-500 text-2xl p-5 ml-3 rounded-lg text-white hover:bg-purple-400 font-DalseoHealing font-bold"
            >
              시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeTwoExpainModal;
