import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const CreateRoomPageFooter = ({ isActivate, onStart }) => {
  return (
    <div className="flex items-center mt-3 gap-2">
      <button
        onClick={onStart}
        className="tracking-wide font-semibold bg-gray-200 text-black text-lg p-2 rounded-lg hover:bg-gray-300 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
      >
        <ChevronLeftIcon />
      </button>
      <button
        onClick={onStart}
        disabled={!isActivate} // This disables the button when isActivate is false
        className={`tracking-wide font-semibold bg-blue-300 text-gray-100 py-2 px-12 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none 
          ${
            !isActivate
              ? "cursor-not-allowed hover:bg-blue-300"
              : "hover:bg-blue-400"
          }`}
        // The above line adds 'cursor-not-allowed' when the button is disabled, and removes the hover effect.
      >
        <span className="">시작하기</span>
      </button>
    </div>
  );
};

export default CreateRoomPageFooter;
