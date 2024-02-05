import { useParams } from "react-router";
import socket from "../../realtimeComunication/socket";

const ModeOneExpainModal = ({ isShowModal, onShow }) => {
  const roomId = useParams();

  const handleShowModal = () => {
    onShow(true);
    console.log("start-speech");
    socket.emit("start-speech", roomId);
  };
  return (
    <>
      {onShow === false && (
        <div>
          <div className="modal fixed w-full h-full -top-10 left-0 flex items-center justify-center">
            {/* overlay  */}
            <div className="modal-overlay absolute  w-full h-full opacity-50"></div>

            <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg z-50  animate-jump">
              {/* Add modal content here */}
              <div className="modal-content py-4 text-left px-6">
                <div className="flex justify-between items-center pb-3">
                  <p className="text-2xl font-bold">
                    오늘 어떤 종류의 음식을 먹고 싶으세요?
                  </p>
                </div>
                <div className="flex justify-center">
                  <p>
                    버튼을 누른 뒤, 5초 동안 어떤 음식을 먹고 싶은지 말을
                    해보세요. 해당 음성을 기반으로 추천 음식 카테고리가
                    생성됩니다.
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleShowModal}
                    className="px-4 bg-purple-500 p-3 ml-3 rounded-lg text-white hover:bg-purple-400"
                  >
                    음성 인식 시작하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModeOneExpainModal;
