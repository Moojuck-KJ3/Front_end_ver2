const ModeThreeModal = ({ onShow }) => {
  const handleClick = () => {
    onShow(false);
  };
  return (
    <div className="modal fixed w-full h-full -top-10 left-0 flex items-center justify-center ">
      <div className=" bg-white mx-auto rounded-lg shadow-lg animated-modal">
        <div className=" py-4 text-left px-6  rounded-xl ">
          <div className="flex justify-between items-center pb-6">
            <p className="text-5xl p-4 font-DalseoHealing font-bold">
              식당을 조합해보세요!
            </p>
          </div>
          <div className="text-3xl p-2 font-bold font-DalseoHealing flex flex-col justify-center ">
            <div className="flex flex-col justify-center items-center mb-4  relative">
              <img
                className="w-full h-[450px] rounded-2xl"
                src="/모드쓰리모달.gif"
                alt="모달원마이크"
              />
            </div>
            <p className="text-2xl">
              나와 상대방의{" "}
              <span className="text-4xl text-red-400">
                식당을 조합해서 서로의 교집합
              </span>
              을 찾아보세요.
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

export default ModeThreeModal;
