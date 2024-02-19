const ModeThreeModal = ({ onShow }) => {
  const handleClick = () => {
    onShow(false);
  };
  return (
    <div className="modal fixed w-full h-full -top-10 left-0 flex items-center justify-center ">
      <div className=" bg-white mx-auto rounded-lg shadow-lg animate-fade">
        <div className=" py-4 text-left px-6  rounded-xl ">
          <div className="flex justify-between items-center pb-6">
            <p className="text-7xl p-4 font-DalseoHealing font-bold">
              식당을 조합해보세요!
            </p>
          </div>
          <div className="text-4xl p-2 font-bold font-DalseoHealing flex flex-col justify-center ">
            <p>
              나와 상대방의{" "}
              <span className="text-red-400">
                식당을 조합해서 서로의 교집합
              </span>
              을 찾아보세요.
            </p>
          </div>
          {/* <div className="flex justify-center ">
            <PlaceCombineArea onSetData={setRestaurantData} />
          </div> */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleClick}
              className="px-4 bg-purple-500 text-4xl p-5 ml-3 rounded-lg text-white hover:bg-purple-400 font-DalseoHealing font-bold"
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
