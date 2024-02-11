const ShowDetailModal = ({ restaurant, closeModal, addToPlayerHand }) => {
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
                {restaurant.title}
              </p>
            </div>
            <div className="flex justify-center rounded-xl ">
              <img className="rounded-xl" src="/돈까스.png" alt="" />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => addToPlayerHand(restaurant)}
                className="modal-close px-4 p-3 rounded-lg font-tenada bg-blue-400 hover:bg-blue-500 transition-all text-white"
              >
                선택하기
              </button>
              <button
                onClick={closeModal}
                className="modal-close px-4 p-3 rounded-lg font-tenada bg-blue-400 hover:bg-blue-500 transition-all text-white"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetailModal;
