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
    <div>
      <div className="modal fixed top-1/3 left-0 w-full flex items-center justify-center">
        <div className="modal-container bg-white md:max-w-lg mx-auto rounded-lg shadow-lg  animate-fade">
          {/* Add modal content here */}
          <div className="modal-content py-4 text-left px-6">
            <div className="flex justify-between items-center pb-3">
              <p className="text-[28px] font-DalseoHealing font-bold">
                오늘 어떤 분위기의 장소를 원하세요?
              </p>
            </div>
            <div className="text-xl font-DalseoHealing flex justify-center ">
              <p>
                버튼을 누른 뒤, 오늘 어떤 분위기의 장소를 원하는지 말해보세요.
                여러분의 취향을 반영한 식당이 실시간으로 나타납니다.
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClick}
                className="px-4 bg-blue-400  hover:bg-blue-500 transition-all font-DalseoHealing font-bold p-3 ml-3 rounded-lg text-white "
              >
                음성 인식 시작하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeTwoExpainModal;
