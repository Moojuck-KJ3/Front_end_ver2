import { useState } from "react";
import PlaceCombineArea from "../../pages/playPage/modeThree/card/PlaceCombineArea";

const ModeThreeModal = ({
  onShow,
  onSetSelectedCombineList,
  onSelectComplete,
}) => {
  const [restaurantData, setRestaurantData] = useState();
  const handleClick = () => {
    onShow(false);

    const userDetails = localStorage.getItem("user");
    const userId = JSON.parse(userDetails).id;

    const insertData = {
      userId: userId,
      restId: restaurantData.id,
    };

    onSetSelectedCombineList(insertData);

    // 선택 완료 버튼을 눌렀기에 socket을 쏘기 위함
    onSelectComplete();
  };
  return (
    <div className="absolute top-[15%] flex items-center justify-center ">
      <div className="bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg  animate-fade p-1">
        <div className="py-4 text-left px-6">
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
  );
};

export default ModeThreeModal;
