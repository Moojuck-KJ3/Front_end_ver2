import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";

const ShowDetailWithLikeModal = ({ restaurant, closeModal, onLike }) => {
  console.log(restaurant);
  return (
    <div>
      <div className="modal fixed w-full h-full -top-10 left-0 flex items-center justify-center  ">
        {/* overlay  */}
        <div className="modal-overlay absolute  w-full h-full opacity-50"></div>

        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg  animate-fade">
          {/* Add modal content here */}
          <div className="modal-content py-4 text-left px-6">
            <div className="flex justify-between items-center pb-3">
              <p className="text-4xl font-bold  font-tenada">
                {restaurant.name}
              </p>
            </div>
            <div className="flex justify-center rounded-xl ">
              <img
                className="rounded-xl"
                src={restaurant.thumbnailImg}
                alt=""
              />
            </div>
            <div className="mt-3 flex flex-col gap-1">
              <div className="flex items-center justify-between ">
                <p className="text-xl font-bold  font-tenada">리뷰 갯수</p>
                <p className="text-lg text-black font-bold  font-tenada">
                  {restaurant.ratingCount}
                </p>
              </div>
              <div className="flex items-center justify-between ">
                <p className="text-xl font-bold  font-tenada">총 별점</p>
                <p className="text-lg text-black font-bold  font-tenada">
                  ⭐️{restaurant.rating}
                </p>
              </div>
              <div className="flex items-center justify-between ">
                <p className="text-xl font-bold  font-tenada">식당 주소</p>
                <p className="text-lㅎ font-bold  font-tenada">
                  {restaurant.address}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xl font-bold  font-tenada">음식 종류</p>
                <p className="text-2xl bg-gray-300 rounded-lg p-1 font-bold font-tenada">
                  #{restaurant.food_category}
                </p>
              </div>
              <div className="flex justify-between items-center pb-3">
                <p className="text-xl font-bold  font-tenada">전화번호</p>
                <p className="text-lg  rounded-lg p-1 font-bold text-emerald-500 underline font-tenada">
                  📞{restaurant.phone_number}
                </p>
              </div>
              <div className="flex justify-between items-center pb-3">
                <p className="min-w-20 text-xl font-bold  font-tenada">옵션</p>
                <p className="text-xl bg-gray-300 rounded-lg p-1 font-bold font-tenada">
                  {restaurant.options}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={onLike}
                className="modal-close px-4 p-3 rounded-lg font-tenada bg-red-400 hover:bg-red-500 transition-all text-white"
              >
                <FavoriteIcon />
              </button>
              <button
                onClick={closeModal}
                className="modal-close px-4 p-3 rounded-lg font-tenada bg-green-400 hover:bg-green-500 transition-all text-white"
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

export default ShowDetailWithLikeModal;
