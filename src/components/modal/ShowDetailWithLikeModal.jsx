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
              <p className="text-2xl font-bold  font-tenada">
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

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={onLike}
                className="modal-close px-4 p-3 rounded-lg font-tenada bg-blue-400 hover:bg-blue-500 transition-all text-white"
              >
                <FavoriteIcon />
              </button>
              <button
                onClick={closeModal}
                className="modal-close px-4 p-3 rounded-lg font-tenada bg-blue-400 hover:bg-blue-500 transition-all text-white"
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
