import { useParams } from "react-router";
import socket from "../../realtimeComunication/socket";

const ModeTwoExpainModal = ({ SetShowVoiceRecorder, onShowModal }) => {
  const roomId = useParams();

  const handleClick = () => {
    onShowModal(false);
    SetShowVoiceRecorder(true);
    console.log("start-speech");
    socket.emit("start-speech", roomId);
  };
  return (
    <div>
      <div className="modal fixed w-full h-full -top-10 left-0 flex items-center justify-center  ">
        {/* overlay  */}
        <div className="modal-overlay absolute  w-full h-full opacity-50"></div>

        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg  animate-fade">
          {/* Add modal content here */}
          <div className="modal-content py-4 text-left px-6">
            <div className="flex justify-between items-center pb-3">
              <p className="text-2xl font-bold  font-tenada">
                오늘 어떤 분위기의 장소를 원하세요?
              </p>
            </div>
            <div className="flex justify-center ">
              <p>
                버튼을 누른 뒤, 오늘 어떤 분위기의 장소를 원하는지 말해보세요.
                여러분의 취향을 반영한 식당이 실시간으로 나타납니다.
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClick}
                className="px-4 bg-blue-400  hover:bg-blue-500 transition-all p-3 ml-3 rounded-lg text-white font-tenada"
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
