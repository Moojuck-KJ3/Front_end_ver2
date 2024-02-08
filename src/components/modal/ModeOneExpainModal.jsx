import { useParams } from "react-router";
import socket from "../../realtimeComunication/socket";

const ModeOneExpainModal = ({ SetShowVoiceRecorder, onShowModal }) => {
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
                오늘 어떤 종류의 음식을 먹고 싶으세요?
              </p>
            </div>
            <div className="flex justify-center ">
              <p>
                버튼을 누른 뒤, 5초 동안 어떤 음식을 먹고 싶은지 말을 해보세요.
                해당 음성을 기반으로 추천 음식 카테고리가 생성됩니다.
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClick}
                className="px-4 bg-purple-500 p-3 ml-3 rounded-lg text-white hover:bg-purple-400 font-tenada"
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

export default ModeOneExpainModal;
