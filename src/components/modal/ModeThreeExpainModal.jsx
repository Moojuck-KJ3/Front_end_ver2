import { useState } from "react";
import PlaceCombineArea from "../../pages/playPage/modeThree/card/PlaceCombineArea";

const ModeThreeModal = ({ isShowModal, onShow, onSetSelectedCombineList }) => {
  const [restaurantData, setRestaurantData] = useState();
  const handleClick = () => {
    onShow(false);
    onSetSelectedCombineList((prev) => [...prev, restaurantData]);
  };
  return (
    <div>
      <div className="modal fixed w-full h-full m-94 -top-10 left-0 flex items-center justify-center ">
        <div className="modal-overlay absolute  w-full h-full opacity-50"></div>

        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg  animate-fade p-1">
          {/* Add modal content here */}
          <div className="modal-content py-4 text-left px-6">
            <div className="flex justify-between items-center pb-3">
              <p className="text-2xl font-bold text-center font-tenada w-full">
                친구와 교집합을 찾아보세요!
              </p>
            </div>
            <div className=" text-semibold text-xl flex justify-center ">
              <p>나와 상대방의 식당을 조합해서 서로의 교집합을 찾아보세요.</p>
            </div>
            <div className="flex justify-center ">
              <PlaceCombineArea onSetData={setRestaurantData} />
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleClick}
                className="p-4 bg-purple-500  rounded-lg text-white hover:bg-purple-400 font-tenada"
              >
                선택 완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeThreeModal;
