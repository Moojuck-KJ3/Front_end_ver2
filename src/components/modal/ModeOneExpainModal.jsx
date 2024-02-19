import { useParams } from "react-router";
import { useSocket } from "../../realtimeComunication/SocketContext";

const ModeOneExpainModal = ({ SetShowVoiceRecorder, onShowModal }) => {
  const roomId = useParams();
  const socket = useSocket();

  const handleClick = () => {
    onShowModal(false);
    SetShowVoiceRecorder(true);
    console.log("start-speech");
    socket.emit("start-speech", roomId);
  };
  return (
    <div className="modal fixed top-1/3 left-0 w-full flex items-center justify-center ">
      <div className="modal-container bg-white md:max-w-lg mx-auto rounded-lg shadow-lg  animate-fade">
        {/* Add modal content here */}
        <div className="modal-content py-4 text-left px-6">
          <div className="flex justify-between items-center pb-3">
            <p className="text-[28px] font-bold  font-tenada">
              오늘 어떤 종류의 음식을 먹고 싶으세요?
            </p>
          </div>
          <div className="text-xl flex justify-center ">
            <p>
              버튼을 누른 뒤, 5초 동안 어떤 음식을 먹고 싶은지 말을 해보세요.
              해당 음성을 기반으로 추천 음식 카테고리가 생성됩니다.
            </p>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClick}
              className="px-4 bg-purple-500 text-xl p-3 ml-3 rounded-lg text-white hover:bg-purple-400 font-tenada"
            >
              음성 인식 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeOneExpainModal;
