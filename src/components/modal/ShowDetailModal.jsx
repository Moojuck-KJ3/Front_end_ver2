import CloseIcon from "@mui/icons-material/Close";
const ShowDetailModal = ({ restaurant, closeModal, addToPlayerHand }) => {
  return (
    <div>
      <div className="fixed w-full h-full z-10 -top-10 left-0 flex items-center justify-center  ">
        {/* overlay  */}
        <div className=" absolute  w-full h-full opacity-50"></div>

        <div className=" bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg  animate-fade">
          {/* Add modal content here */}
          <div className=" py-4 text-left px-6 font-bold font-DalseoHealing">
            <div className="flex justify-between items-center pb-3">
              <p className="text-4xl ">{restaurant.name}</p>
            </div>
            <div className="flex justify-center rounded-xl ">
              <img
                className="w-full max-h-[300px] rounded-xl"
                src={restaurant.thumbnailImg}
                alt=""
              />
            </div>
            <div className="mt-3 flex flex-col gap-1">
              <div className="flex items-center justify-between ">
                <p className="text-xl ">리뷰 갯수</p>
                <p className="text-2xl text-black ">{restaurant.ratingCount}</p>
              </div>
              <div className="flex items-center justify-between ">
                <p className="text-xl ">총 별점</p>
                <p className="text-2xl text-black">⭐️{restaurant.rating}</p>
              </div>
              <div className="flex items-center justify-between ">
                <p className="min-w-20 text-xl">식당 주소</p>
                <p className="ml-4 text-xl truncate">{restaurant.address}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xl ">음식 종류</p>
                <p className="text-2xl bg-gray-300 rounded-lg p-1">
                  #{restaurant.foodCategory}
                </p>
              </div>
              <div className="flex justify-between items-center pb-3">
                <p className="text-xl ">전화번호</p>
                <p className="text-2xl  rounded-lg p-1 font-bold text-emerald-500 underline">
                  📞{restaurant.phoneNumber}
                </p>
              </div>
              <div className="flex justify-between items-center pb-3">
                <p className="min-w-20 text-xl font-bold">옵션</p>
                <p className="text-2xl bg-gray-300 rounded-lg p-1">
                  {restaurant.options}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => addToPlayerHand(restaurant)}
                className="modal-close px-4 p-3 rounded-lg font-tenada bg-green-400 hover:bg-green-500 transition-all text-white"
              >
                PICK!
              </button>
              <button
                onClick={closeModal}
                className="modal-close px-4 p-3 rounded-lg font-tenada bg-red-400 hover:bg-red-500 transition-all text-white"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetailModal;
